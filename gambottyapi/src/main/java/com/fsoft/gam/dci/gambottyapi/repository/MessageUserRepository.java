package com.fsoft.gam.dci.gambottyapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.fsoft.gam.dci.gambottyapi.domain.Message;
import com.fsoft.gam.dci.gambottyapi.domain.MessageUser;

@Repository
public interface MessageUserRepository extends JpaRepository<MessageUser, Long> {

    public List<MessageUser> findAllByMessageAndStatus(Message message, String status);

    public void deleteAllByMessage(Message message);
}
