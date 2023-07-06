package part1;

import java.util.Date;

public class Message {
  private String sender;
  String receiver;
  String title;
  String message;
  int id;
  Date date;

  public Message(Integer id, String sender, String receiver, String title,
      String message, Date date) {
    this.sender = sender;
    this.receiver = receiver;
    this.title = title;
    this.message = message;
    this.id = id;
    this.date = date;
  }

  public int getID() {
    return id;
  }

  public String getSender() {
    return sender;
  }

  public String getReceiver() {
    return receiver;
  }

  public String getMessage() {
    return message;
  }

  public void setSender(String sender) {
    this.sender = sender;
  }

  public void setReceiver(String receiver) {
    this.receiver = receiver;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public void setID(int id) {
    this.id = id;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }
}
