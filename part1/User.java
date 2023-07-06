package part1;

import java.util.Date;

public class User {
  private String username;
  String password;
  String name;
  String surname;
  String gender;
  String email;
  boolean isAdmin;
  Date birthday;

  public User(String username, String password, String name, String surname,
      String gender, String email, boolean isAdmin, Date birthday) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.surname = surname;
    this.gender = gender;
    this.email = email;
    this.isAdmin = isAdmin;

    this.birthday = birthday;
  }

  public String getUsername() {
    return username;
  }

  public String getPassword() {
    return password;
  }

  public String getName() {
    return name;
  }

  public String getSurname() {
    return surname;
  }

  public String getGender() {
    return gender;
  }

  public String getEmail() {
    return email;
  }

  public boolean getIsAdmin() {
    return isAdmin;
  }

  public Date getBirthday() {
    return birthday;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setSurname(String surname) {
    this.surname = surname;
  }

  public void setGender(String gender) {
    this.gender = gender;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public void setIsAdmin(boolean isAdmin) {
    this.isAdmin = isAdmin;
  }

  public void setBirthday(Date birthday) {
    this.birthday = birthday;
  }
}
