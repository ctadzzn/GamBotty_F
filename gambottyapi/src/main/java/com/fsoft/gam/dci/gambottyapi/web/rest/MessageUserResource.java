package com.fsoft.gam.dci.gambottyapi.web.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fsoft.gam.dci.gambottyapi.exception.ResourceNotFoundException;
import com.fsoft.gam.dci.gambottyapi.domain.MessageUser;
import com.fsoft.gam.dci.gambottyapi.repository.MessageUserRepository;

@RestController
@RequestMapping("/api/v1")
public class MessageUserResource {
	@Autowired
	private MessageUserRepository messageUserRepository;

	@GetMapping("/message_users")
	public List<MessageUser> getAllMessageUser() {
		return messageUserRepository.findAll();
	}

	@GetMapping("/message_users/{id}")
	public ResponseEntity<MessageUser> getMessageUserById(@PathVariable(value = "id") Long id)
			throws ResourceNotFoundException {
		MessageUser messageUser = messageUserRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Not found for this id :: " + id));
		return ResponseEntity.ok().body(messageUser);
	}

	@PostMapping("/message_users")
	public MessageUser createMessageUser(@Valid @RequestBody MessageUser messageUser) {
		return messageUserRepository.save(messageUser);
	}

	// @PutMapping("/message_users/{id}")
	// public ResponseEntity<MessageUser> updateSurvey(@PathVariable(value = "id")
	// Long surveyId,
	// @Valid @RequestBody MessageUser surveyDetails) throws
	// ResourceNotFoundException {
	// MessageUser survey = surveyRepository.findById(surveyId)
	// .orElseThrow(() -> new ResourceNotFoundException("Survey not found for this
	// id :: " + surveyId));

	// survey.setAccessToken(surveyDetails.getAccessToken());
	// survey.setMessage(surveyDetails.getMessage());
	// survey.setTime(surveyDetails.getTime());
	// survey.setPayload(surveyDetails.getPayload());
	// survey.setSenderGroupId(surveyDetails.getSenderGroupId());
	// final MessageUser updatedSurvey = surveyRepository.save(survey);
	// return ResponseEntity.ok(updatedSurvey);
	// }

	@DeleteMapping("/message_users/{id}")
	public Map<String, Boolean> deleteMessageUser(@PathVariable(value = "id") Long id)
			throws ResourceNotFoundException {
		MessageUser messageUser = messageUserRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Not found for this id :: " + id));

		messageUserRepository.delete(messageUser);
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return response;
	}
}
