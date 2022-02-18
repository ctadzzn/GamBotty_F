package com.fsoft.gam.dci.gambottyapi.web.rest;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.fsoft.gam.dci.gambottyapi.domain.Message;
import com.fsoft.gam.dci.gambottyapi.domain.MessageUser;
import com.fsoft.gam.dci.gambottyapi.repository.MessageRepository;
import com.fsoft.gam.dci.gambottyapi.repository.MessageUserRepository;
import com.fsoft.gam.dci.gambottyapi.service.ExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.fsoft.gam.dci.gambottyapi.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api/v1")
public class MessageResource {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MessageUserRepository messageUserRepository;

    // @Autowired
    // private NotificationService notificationService;

    // @Autowired
    // private SurveyService surveyService;

    @Autowired
    private ExcelService excelService;

    private String validate(Message message) {
        if (message.getAccessToken() == null) {
            return "Message must have access token";
        }
        if (message.getMessageName() == null) {
            return "Message must have name";
        }
        if (message.getListMessageUser() == null) {
            return "Message must have recipients";
        }
        if (message.getTextMessage() == null) {
            return "Message must have text message";
        }
        return null;
    }

    @GetMapping("/messages")
    public ResponseEntity<Map<String, Object>> getPageMessages(@RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "true") boolean asc) {
        if (page <= 1) {
            page = 0;
        } else {
            page--;
        }
        Pageable pageable = PageRequest.of(page,
                size,
                Sort.by(asc ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy));
        Page<Message> pageMessages = messageRepository.findAll(pageable);
        Map<String, Object> result = new HashMap<>();
        result.put("page", page + 1);
        result.put("messages", pageMessages.getContent());
        result.put("totalPages", pageMessages.getTotalPages());
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/messages/{id}")
    public ResponseEntity<Message> getMessageById(@PathVariable Long id)
            throws ResourceNotFoundException {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Couldn't found message id: " + id));
        return ResponseEntity.ok().body(message);
    }

    @PostMapping("/messages/sent")
    public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody Message message) {
        Map<String, Object> result = new HashMap<>();
        //
        if (message.getId() != null) {
            result.put("error", "Invalid ID");
            return ResponseEntity.badRequest().body(result);
        }
        // Validate message properties
        String error = validate(message);
        if (error != null) {
            result.put("error", error);
            return ResponseEntity.badRequest().body(result);
        }
        for (MessageUser messageUser : message.getListMessageUser()) {
            messageUser.setAccount(messageUser.getAccount().toLowerCase());
            messageUser.setMessage(message);
        }
        // set message scheduled is NOW
        message.setScheduled(new Date());
        // save message
        Message savedMessage = messageRepository.save(message);
        result.put("id", savedMessage.getId());
        return ResponseEntity.ok().body(result);
        //
        // long start = System.currentTimeMillis();
        // double successRate;
        // if (savedMessage.getPayload() != null) {
        // successRate = surveyService.send(savedMessage);
        // } else {
        // successRate = notificationService.send(savedMessage);
        // }
        // long diff = System.currentTimeMillis() - start;
        // System.out.println("Response time: " + diff + "ms");
        // result.put("responseTime", diff);
        // result.put("message", "Sent to " + (successRate * 100) + "% users");
        // if (successRate >= 0.6) {
        // return ResponseEntity.ok().body(result);
        // } else {
        // return ResponseEntity.badRequest().body(result);
        // }
    }

    @PostMapping("/messages")
    public ResponseEntity<Map<String, Object>> saveMessage(@RequestBody Message message) {
        Map<String, Object> result = new HashMap<>();
        if (message.getId() != null) {
            result.put("error", "Invalid ID");
            return ResponseEntity.badRequest().body(result);
        }
        // Validate message properties
        String error = validate(message);
        if (error != null) {
            result.put("error", error);
            return ResponseEntity.badRequest().body(result);
        }
        for (MessageUser messageUser : message.getListMessageUser()) {
            messageUser.setAccount(messageUser.getAccount().toLowerCase());
            messageUser.setMessage(message);
        }
        // save message
        Message savedMessage = messageRepository.save(message);
        result.put("id", savedMessage.getId());
        return ResponseEntity.ok().body(result);
    }

    @Transactional
    @PutMapping("/messages/{id}")
    public ResponseEntity<Message> updateMessage(@PathVariable long id, @RequestBody Message message)
            throws ResourceNotFoundException {
        Message result = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Couldn't found message id: " + id));
        if (message.getListMessageUser() != null) {
            messageUserRepository.deleteAllByMessage(result);
            result.setListMessageUser(message.getListMessageUser());
            for (MessageUser messageUser : result.getListMessageUser()) {
                messageUser.setAccount(messageUser.getAccount().toLowerCase());
                messageUser.setMessage(result);
            }
        }
        result.setAccessToken(message.getAccessToken());
        result.setMessageName(message.getMessageName());
        result.setTextMessage(message.getTextMessage());
        result.setImageUrl(message.getImageUrl());
        result.setScheduled(message.getScheduled());
        result.setModifiedAt(new Date());
        result = messageRepository.save(result);
        return ResponseEntity.ok().body(result);
    }

    @Transactional
    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Map<String, Object>> deleteMessage(@PathVariable long id)
            throws ResourceNotFoundException {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Couldn't found message id: " + id));
        messageUserRepository.deleteAllByMessage(message);
        messageRepository.delete(message);
        Map<String, Object> result = new HashMap<>();
        result.put("id", message.getId());
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/messages/{id}/message_users/excel")
    public ResponseEntity<InputStreamResource> exportMessageUsers(@PathVariable Long id)
            throws ResourceNotFoundException, IOException {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Couldn't found message id: " + id));

        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());
        String filename = id + "_message_users_" + currentDateTime + ".xlsx";
        //
        ByteArrayInputStream stream = excelService.messageUsersToExcel(message.getListMessageUser());
        InputStreamResource file = new InputStreamResource(stream);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(file);
    }

    @GetMapping("/surveyHistory")
    public List<Message> getAllSurvey() {
        return messageRepository.getSurvey();
    }
}
