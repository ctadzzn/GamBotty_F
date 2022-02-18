package com.fsoft.gam.dci.gambottyapi.repository;

import java.util.Date;
import java.util.List;

import com.fsoft.gam.dci.gambottyapi.domain.Message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query(nativeQuery = true, value = "select * from Message ms where ms.scheduled<=:date and ms.status is null order by ms.scheduled asc limit 1")
    public Message getScheduledMessage(@Param("date") Date date);

    public List<Message> findAllByOrderByIdAsc();

    @Query(nativeQuery = true, value = "select * from Message ms where ms.payload is not null and ms.sent_at is not null order by ms.created_at")
    public List<Message> getSurvey();
}
