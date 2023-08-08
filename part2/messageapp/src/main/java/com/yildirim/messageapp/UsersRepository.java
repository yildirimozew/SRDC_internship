package com.yildirim.messageapp;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.yildirim.messageapp.Users;

public interface UsersRepository extends JpaRepository<Users, Long> {

  List<Users> findByUsername(String username);

  List<Users> findByUsernameAndPassword(String username, String password);

  List<Users> deleteByUsername(String username);

}
/* save(), findOne(), findById(), findAll(), count(), delete(), deleteById() */