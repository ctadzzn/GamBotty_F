package com.fsoft.gam.dci.gambottyapi.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fsoft.gam.dci.gambottyapi.domain.Message;
import com.fsoft.gam.dci.gambottyapi.domain.MessageUser;
import com.fsoft.gam.dci.gambottyapi.domain.User;
import com.fsoft.gam.dci.gambottyapi.domain.status.MessageStatus;
import com.fsoft.gam.dci.gambottyapi.domain.status.MessageUserStatus;
import com.fsoft.gam.dci.gambottyapi.repository.MessageRepository;
import com.fsoft.gam.dci.gambottyapi.repository.MessageUserRepository;
import com.fsoft.gam.dci.gambottyapi.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import reactor.core.publisher.Mono;

@Service
public class SurveyService {

    private final int THREAD_LIMIT = 25;

    private GraphApiService graphApiService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageUserRepository messageUserRepository;

    @Autowired
    private MessageRepository messageRepository;

    public SurveyService() {
        graphApiService = new GraphApiService();
    }

    public double send(Message message) {
        double successRate = 0;
        //
        int index = 0;
        List<Mono<Void>> listMessageToUser = new ArrayList<>();
        for (MessageUser messageUser : message.getListMessageUser()) {
            User user = userRepository.findByAccount(messageUser.getAccount());
            // if not found user by account continue next loop
            if (user == null) {
                System.out.println("Not found account " + messageUser.getAccount());
                messageUser.setStatus(MessageUserStatus.NOT_FOUND);
                messageUser.setFailMessage(messageUser.getAccount() + " doesn't seem to exist");
                messageUserRepository.save(messageUser);
                index++;
                continue;
            }
            String userId = user.getId();
            String msg;

            if (message.getTextMessage().contains("{sender_name}")) {

                msg = message.getTextMessage().replace("{sender_name}", user.getUsername());

            }

            else {

                msg = message.getTextMessage();

            }
            Mono<String> sendSurvey = null;
            if (message.getTextMessage() != null) {
                sendSurvey = graphApiService
                        .sendSurvey(userId, msg, message.getAccessToken(), message.getPayload(),
                                message.getId().toString())
                        .onErrorResume(throwable -> Mono.error(throwable));
            }
            //
            List<Mono<String>> requests = new ArrayList<>();
            if (sendSurvey != null) {
                requests.add(sendSurvey);
            }
            //
            Mono<Void> messageToUser = Mono.when(requests)
                    .doOnSuccess(onSuccess -> {
                        System.out.println("Sent survey to " + user.getAccount());
                        messageUser.setStatus(MessageUserStatus.OK);
                        messageUserRepository.save(messageUser);
                    })
                    .onErrorResume(throwable -> {
                        System.out.println("Sent failed " + user.getAccount());
                        messageUser.setStatus(MessageUserStatus.FAILED);
                        messageUser.setFailMessage(throwable.getMessage().substring(0, 49));
                        messageUserRepository.save(messageUser);
                        return Mono.empty();
                    });
            listMessageToUser.add(messageToUser);
            index++;
            // wait listMessageToUser run finish
            if (listMessageToUser.size() >= THREAD_LIMIT ||
                    index >= message.getListMessageUser().size()) {
                Mono<Void> waitResponses = Mono.when(listMessageToUser);
                waitResponses.block();
                listMessageToUser.clear();
            }
        }
        //
        int successTime = messageUserRepository
                .findAllByMessageAndStatus(message, MessageUserStatus.OK).size();
        int failedTime = messageUserRepository
                .findAllByMessageAndStatus(message, MessageUserStatus.FAILED).size();
        int notFoundTime = messageUserRepository
                .findAllByMessageAndStatus(message, MessageUserStatus.NOT_FOUND).size();
        System.out.println("Success: " + successTime + " - Failed: " + failedTime + " - NotFound: " + notFoundTime);
        successRate = ((double) successTime) / (successTime + failedTime + notFoundTime);
        if (successRate == 1) {
            message.setStatus(MessageStatus.OK);
            message.setSentAt(new Date());
            messageRepository.save(message);
        } else if (successRate < 1 && successRate >= 0.6) {
            message.setStatus(MessageStatus.WARNING);
            message.setSentAt(new Date());
            messageRepository.save(message);
        } else {
            message.setStatus(MessageStatus.FAILED);
            message.setSentAt(new Date());
            messageRepository.save(message);
        }
        return successRate;
    }
}
