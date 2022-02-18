package com.fsoft.gam.dci.gambottyapi.component;

import java.util.Date;
import com.fsoft.gam.dci.gambottyapi.domain.Message;
import com.fsoft.gam.dci.gambottyapi.domain.status.MessageStatus;
import com.fsoft.gam.dci.gambottyapi.repository.MessageRepository;
import com.fsoft.gam.dci.gambottyapi.service.NotificationService;
import com.fsoft.gam.dci.gambottyapi.service.SurveyService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SurveyService surveyService;

    @Scheduled(fixedRate = 5000)
    public void sendScheduledNotification() {
        Message scheduledMessage = messageRepository.getScheduledMessage(new Date());
        if (scheduledMessage != null) {
            scheduledMessage.setStatus(MessageStatus.SENDING);
            scheduledMessage = messageRepository.save(scheduledMessage);
            long start = System.currentTimeMillis();
            if (scheduledMessage.getPayload() != null) {
                log.info("Hacking...");
                surveyService.send(scheduledMessage);
            } else {
                log.info("Hacking...");
                notificationService.send(scheduledMessage);
            }
            long diff = System.currentTimeMillis() - start;
            System.out.println("Response time: " + diff + "ms");
        }
    }
}
