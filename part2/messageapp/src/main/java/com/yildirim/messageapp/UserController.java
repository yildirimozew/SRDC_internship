package com.yildirim.messageapp;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yildirim.messageapp.Users;
import com.yildirim.messageapp.UsersRepository;
import com.yildirim.messageapp.JwtUtil;

@CrossOrigin
@RestController
@RequestMapping("/users")
public class UserController {
  @Autowired
  UsersRepository usersRepository;

  @PostMapping("/login")
  public ResponseEntity<String> getToken(@RequestBody Map<String, String> json) {
    String username = json.get("username");
    String password = json.get("password");
    List<Users> users = new ArrayList<Users>();
    usersRepository.findByUsernameAndPassword(username, password).forEach(users::add);
    if (users.size() <= 0) {
      return new ResponseEntity<>(null, HttpStatus.OK);
    }
    String token = JwtUtil.generateToken(username, password, users.get(0).getIsAdmin());
    TokenStorage.addToken(token);
    return new ResponseEntity<>(token, HttpStatus.OK);
  }

  @PostMapping("/logout")
  public ResponseEntity<String> removeToken(@RequestHeader("Authorization") String token) {
    TokenStorage.removeToken(token);
    return new ResponseEntity<>(null, HttpStatus.OK);
  }

  @PostMapping
  public ResponseEntity<Users> createUser(@RequestBody Users user, @RequestHeader("Authorization") String token) {
    List<Users> users = new ArrayList<Users>();
    ReturnClass decoded = JwtUtil.getFromToken(token);
    String username = decoded.getUsername();
    String password = decoded.getPassword();
    boolean isAdmin = decoded.getIsAdmin();
    usersRepository.findByUsernameAndPassword(username, password).forEach(users::add);
    if (users.size() > 0 && TokenStorage.findInTokens(token)) {
      if (!isAdmin) {
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    try {
      Users _user = usersRepository
          .save(new Users(user.getUsername(), user.getPassword(), user.getName(), user.getSurname(), user.getGender(),
              user.getEmail(),
              user.getIsAdmin(), user.getBirthday()));
      return new ResponseEntity<>(_user, HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PutMapping
  public ResponseEntity<Users> updateUser(@RequestBody Users user, @RequestHeader("Authorization") String token) {
    List<Users> users = new ArrayList<Users>();
    ReturnClass decoded = JwtUtil.getFromToken(token);
    String username = decoded.getUsername();
    String password = decoded.getPassword();
    boolean isAdmin = decoded.getIsAdmin();
    usersRepository.findByUsernameAndPassword(username, password).forEach(users::add);
    if (users.size() > 0 && TokenStorage.findInTokens(token)) {
      if (!isAdmin) {
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    try {
      if (usersRepository.findByUsername(user.getUsername()).size() == 0) {
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      Users _user = usersRepository
          .save(new Users(user.getUsername(), user.getPassword(), user.getName(), user.getSurname(), user.getGender(),
              user.getEmail(),
              user.getIsAdmin(), user.getBirthday()));
      return new ResponseEntity<>(_user, HttpStatus.CREATED);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @DeleteMapping("/{deletedUsername}")
  public ResponseEntity<Users> deleteUser(@PathVariable String deletedUsername,
      @RequestHeader("Authorization") String token) {
    List<Users> users = new ArrayList<Users>();
    ReturnClass decoded = JwtUtil.getFromToken(token);
    String username = decoded.getUsername();
    String password = decoded.getPassword();
    usersRepository.findByUsernameAndPassword(username, password).forEach(users::add);
    if (users.size() > 0 && TokenStorage.findInTokens(token)) {
      if (users.get(0).getIsAdmin() == false) {
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    try {
      if (usersRepository.findByUsername(deletedUsername).size() == 0) {
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      Users user = usersRepository.findByUsername(deletedUsername).get(0);
      usersRepository.delete(user);
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @GetMapping
  public ResponseEntity<List<Users>> getAllUsers(@RequestHeader("Authorization") String token) {
    List<Users> users = new ArrayList<Users>();
    ReturnClass decoded = JwtUtil.getFromToken(token);
    String username = decoded.getUsername();
    String password = decoded.getPassword();
    usersRepository.findByUsernameAndPassword(username, password).forEach(users::add);
    if (users.size() > 0 && TokenStorage.findInTokens(token)) {
      if (users.get(0).getIsAdmin() == false) {
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    try {
      List<Users> users2 = new ArrayList<Users>();

      usersRepository.findAll().forEach(users2::add);

      if (users2.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
      }

      return new ResponseEntity<>(users2, HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

/*
 * {
 * "username": "yildirimozew-temp3",
 * "password": "123456",
 * "name": "yildirim",
 * "surname": "ozen",
 * "gender": "male",
 * "email": "yildirimozew@hotmail.com",
 * "isAdmin": "true",
 * "birthday": "2002-10-04"
 * }
 */