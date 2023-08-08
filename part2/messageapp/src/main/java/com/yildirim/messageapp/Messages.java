package com.yildirim.messageapp;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "messages")
public class Messages {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private long id;

  @Column(name = "title")
  private String title;

  @Column(name = "message")
  private String message;

  @Column(name = "deleted-sender")
  private boolean deletedSender;

  @Column(name = "deleted-receiver")
  private boolean deletedReceiver;

  @Column(name = "sender")
  private String sender;

  @Column(name = "receiver")
  private String receiver;

  @Column(name = "date")
  private Date date;

  public Messages() {

  }

  public Messages(long id, String title, String message, boolean deletedSender, boolean deletedReceiver, String sender,
      String receiver, Date date) {
    this.id = id;
    this.title = title;
    this.message = message;
    this.deletedSender = deletedSender;
    this.deletedReceiver = deletedReceiver;
    this.sender = sender;
    this.receiver = receiver;
    this.date = date;
  }

  public Messages(String title, String message, boolean deletedSender, boolean deletedReceiver, String sender,
      String receiver, Date date) {
    this.title = title;
    this.message = message;
    this.deletedSender = deletedSender;
    this.deletedReceiver = deletedReceiver;
    this.sender = sender;
    this.receiver = receiver;
    this.date = date;
  }

  public long getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public String getMessage() {
    return message;
  }

  public boolean isDeletedSender() {
    return deletedSender;
  }

  public boolean isDeletedReceiver() {
    return deletedReceiver;
  }

  public String getSender() {
    return sender;
  }

  public String getReceiver() {
    return receiver;
  }

  public Date getDate() {
    return date;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public void setDeletedSender(boolean deletedSender) {
    this.deletedSender = deletedSender;
  }

  public void setDeletedReceiver(boolean deletedReceiver) {
    this.deletedReceiver = deletedReceiver;
  }

  public void setSender(String sender) {
    this.sender = sender;
  }

  public void setReceiver(String receiver) {
    this.receiver = receiver;
  }

  public void setDate(Date date) {
    this.date = date;
  }

}
