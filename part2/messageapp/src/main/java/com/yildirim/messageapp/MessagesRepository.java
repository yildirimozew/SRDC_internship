package com.yildirim.messageapp;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.yildirim.messageapp.Messages;

public interface MessagesRepository extends JpaRepository<Messages, Long> {

  List<Messages> findByReceiver(String receiver);

  List<Messages> findByReceiverAndId(String receiver, Long id);

  List<Messages> findBySender(String sender);

  List<Messages> findBySenderAndId(String sender, Long id);

  List<Messages> findByReceiverAndDeletedReceiver(String receiver, Boolean deletedReceiver);

  List<Messages> findBySenderAndDeletedSender(String sender, Boolean deletedSender);

}
/* save(), findOne(), findById(), findAll(), count(), delete(), deleteById() */