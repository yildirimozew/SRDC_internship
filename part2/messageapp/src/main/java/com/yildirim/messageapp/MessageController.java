package com.yildirim.messageapp;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yildirim.messageapp.Messages;
import com.yildirim.messageapp.MessagesRepository;
import com.yildirim.messageapp.Users;
import com.yildirim.messageapp.UsersRepository;

import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.OPTIONS;

@CrossOrigin
@RestController
@RequestMapping("/messages")
public class MessageController {
  @Autowired
  MessagesRepository messagesRepository;
  @Autowired
  UsersRepository usersRepository;

  @GetMapping("/inbox")
  public ResponseEntity<List<Messages>> getInbox(@RequestHeader("Authorization") String token) {
    List<Users> users = new ArrayList<Users>();
    ReturnClass decoded = JwtUtil.getFromToken(token);
    String username = decoded.getUsername();
    String password = decoded.getPassword();
    usersRepository.findByUsernameAndPassword(username, password).forEach(users::add);
    if (users.size() <= 0 || !TokenStorage.findInTokens(token)) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    try {
      List<Messages> messages = new ArrayList<Messages>();

      messagesRepository.findByReceiverAndDeletedReceiver(username, false).forEach(messages::add);

      if (messages.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }

      return new ResponseEntity<>(messages, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping("/outbox")
  public ResponseEntity<List<Messages>> getOutbox(@RequestHeader("Authorization") String token) {
    List<Users> users = new ArrayList<Users>();
    ReturnClass decoded = JwtUtil.getFromToken(token);
    String username = decoded.getUsername();
    String password = decoded.getPassword();
    usersRepository.findByUsernameAndPassword(username, password).forEach(users::add);
    if (users.size() <= 0 || !TokenStorage.findInTokens(token)) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    try {
      List<Messages> messages = new ArrayList<Messages>();
      messagesRepository.findBySenderAndDeletedSender(username, false).forEach(messages::add);
      if (messages.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }
      return new ResponseEntity<>(messages, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PostMapping
  public ResponseEntity<Messages> createMessage(@RequestBody Messages message,
      @RequestHeader("Authorization") String token) {
    List<Users> users = new ArrayList<Users>();
    ReturnClass decoded = JwtUtil.getFromToken(token);
    String username = decoded.getUsername();
    String password = decoded.getPassword();
    usersRepository.findByUsernameAndPassword(username, password).forEach(users::add);
    if (users.size() <= 0 || !TokenStorage.findInTokens(token)) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    try {
      Messages _message = messagesRepository
          .save(new Messages(message.getTitle(), message.getMessage(), false, false, message.getSender(),
              message.getReceiver(), message.getDate()));
      return new ResponseEntity<>(_message, HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Messages> deleteMessage(@RequestHeader("Authorization") String token,
      @PathVariable("id") long id) {
    List<Messages> messages = new ArrayList<Messages>();
    List<Users> users = new ArrayList<Users>();
    ReturnClass decoded = JwtUtil.getFromToken(token);
    String username = decoded.getUsername();
    String password = decoded.getPassword();
    usersRepository.findByUsernameAndPassword(username, password).forEach(users::add);
    if (users.size() <= 0 || !TokenStorage.findInTokens(token)) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    try {
      messagesRepository.findByReceiverAndId(username, id).forEach(messages::add);
      messagesRepository.findBySenderAndId(username, id).forEach(messages::add);
      Messages message = messages.get(0);
      Messages _message = messagesRepository
          .save(
              new Messages(message.getId(), message.getTitle(), message.getMessage(),
                  message.getSender().equals(username) ? true : false,
                  message.getReceiver().equals(username) ? true : false,
                  message.getSender(),
                  message.getReceiver(), message.getDate()));
      return new ResponseEntity<>(_message, HttpStatus.NO_CONTENT);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}

/*
 * {
 * "title": "uniquetest",
 * "message": "uniquetest",
 * "sender": "yildirimozew",
 * "receiver": "yildirimozew2",
 * "date": "2000-10-10"
 * }
 */
