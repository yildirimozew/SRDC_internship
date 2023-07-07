package part1;

import java.sql.*;

public class Database {
  public Connection conn = null;

  public Database() {
    try {
      Class.forName("org.postgresql.Driver");
      conn = DriverManager.getConnection(
          "jdbc:postgresql://localhost:5432/msg_app", "postgres", "1234");
    } catch (Exception e) {
      e.printStackTrace();
      System.err.println(e.getClass().getName() + ": " + e.getMessage());
      System.exit(0);
    }
    System.out.println("Opened database successfully");
  }

  public boolean login(String username, String password) {
    String QUERY = "SELECT * FROM users WHERE username = ? AND password = ?";
    try {
      PreparedStatement stmt = conn.prepareStatement(QUERY);
      stmt.setString(1, username);
      stmt.setString(2, password);
      ResultSet rs = stmt.executeQuery();
      if (rs.next()) {
        stmt.close();
        return true;
      } else {
        stmt.close();
        return false;
      }
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }
  }

  public boolean isAdmin(String username) {
    String QUERY = "SELECT * FROM users WHERE username = ? AND isadmin = true";
    try {
      PreparedStatement stmt = conn.prepareStatement(QUERY);
      stmt.setString(1, username);
      ResultSet rs = stmt.executeQuery();
      if (rs.next()) {
        stmt.close();
        return true;
      } else {
        stmt.close();
        return false;
      }
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }
  }

  public boolean saveMessage(Message msg) {
    String QUERY = "INSERT INTO messages (sender, receiver, title, message, date) VALUES (?, ?, ?, ?, NOW())";
    try {
      PreparedStatement stmt = conn.prepareStatement(QUERY);
      stmt.setString(1, msg.getSender());
      stmt.setString(2, msg.getReceiver());
      stmt.setString(3, msg.getTitle());
      stmt.setString(4, msg.getMessage());
      stmt.executeUpdate();
      stmt.close();
      return true;
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }
  }

  public Message[] inbox(String username) {
    String QUERY = "SELECT * FROM messages WHERE receiver = ? AND deleted_receiver = false";
    try {
      PreparedStatement stmt = conn.prepareStatement(QUERY);
      stmt.setString(1, username);
      ResultSet rs = stmt.executeQuery();
      Message[] messages = new Message[100];
      int i = 0;
      while (rs.next()) {
        messages[i] = new Message(rs.getInt("id"), rs.getString("sender"),
            rs.getString("receiver"), rs.getString("title"),
            rs.getString("message"), rs.getDate("date"));
        i++;
      }
      stmt.close();
      return messages;
    } catch (SQLException e) {
      e.printStackTrace();
      return null;
    }
  }

  public Message[] outbox(String username) {
    String QUERY = "SELECT * FROM messages WHERE sender = ? AND deleted_sender = false";
    try {
      PreparedStatement stmt = conn.prepareStatement(QUERY);
      stmt.setString(1, username);
      ResultSet rs = stmt.executeQuery();
      Message[] messages = new Message[100];
      int i = 0;
      while (rs.next()) {
        messages[i] = new Message(rs.getInt("id"), rs.getString("sender"),
            rs.getString("receiver"), rs.getString("title"),
            rs.getString("message"), rs.getDate("date"));
        i++;
      }
      stmt.close();
      return messages;
    } catch (SQLException e) {
      e.printStackTrace();
      return null;
    }
  }

  public boolean addUser(User user) {
    String QUERY = "INSERT INTO users (username, password, name, surname, gender, email, isadmin, birthday) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    try {
      PreparedStatement stmt = conn.prepareStatement(QUERY);
      java.sql.Date sqlDate = new java.sql.Date(user.getBirthday().getTime());
      stmt.setString(1, user.getUsername());
      stmt.setString(2, user.getPassword());
      stmt.setString(3, user.getName());
      stmt.setString(4, user.getSurname());
      stmt.setString(5, user.getGender());
      stmt.setString(6, user.getEmail());
      stmt.setBoolean(7, user.getIsAdmin());
      stmt.setDate(8, sqlDate);
      stmt.executeUpdate();
      stmt.close();
      return true;
    } catch (SQLException e) {
      /* if(e == ) */
      e.printStackTrace();
      return false;
    }
  }

  public boolean updateUser(User user) {
    String QUERY = "UPDATE users SET password = ? , name = ? , surname = ? , gender = ? , email = ? , isadmin = ? WHERE username = ?";
    try {
      PreparedStatement stmt = conn.prepareStatement(QUERY);
      stmt.setString(7, user.getUsername());
      stmt.setString(1, user.getPassword());
      stmt.setString(2, user.getName());
      stmt.setString(3, user.getSurname());
      stmt.setString(4, user.getGender());
      stmt.setString(5, user.getEmail());
      stmt.setBoolean(6, user.getIsAdmin());
      stmt.executeUpdate();
      stmt.close();
      return true;
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }
  }

  public boolean removeUser(String username) {
    String QUERY3 = "DELETE FROM users WHERE username = ?";
    try {
      PreparedStatement stmt = conn.prepareStatement(QUERY3);
      stmt.setString(1, username);
      stmt.executeUpdate();
      stmt.close();
      return true;
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }
  }

  public User[] listUsers() {
    String QUERY = "SELECT * FROM users";
    try {
      Statement stmt = conn.createStatement();
      ResultSet rs = stmt.executeQuery(QUERY);
      User[] users = new User[100];
      int i = 0;
      while (rs.next()) {
        users[i] = new User(rs.getString("username"), rs.getString("password"), rs.getString("name"),
            rs.getString("surname"), rs.getString("gender"), rs.getString("email"), rs.getBoolean("isadmin"),
            rs.getDate("birthday"));
        i++;
      }
      stmt.close();
      return users;
    } catch (SQLException e) {
      e.printStackTrace();
      return null;
    }
  }

  public boolean deleteMessage(int msgID, String username) {
    int value1, value2;
    String QUERY = "UPDATE messages SET deleted_sender = true WHERE id = ? AND sender = ?";
    String QUERY2 = "UPDATE messages SET deleted_receiver = true WHERE id = ? AND receiver = ?";
    try {
      PreparedStatement stmt = conn.prepareStatement(QUERY);
      PreparedStatement stmt2 = conn.prepareStatement(QUERY2);
      stmt.setInt(1, msgID);
      stmt.setString(2, username);
      stmt2.setInt(1, msgID);
      stmt2.setString(2, username);
      value1 = stmt.executeUpdate();
      value2 = stmt2.executeUpdate();
      if (value1 + value2 > 0) {
        stmt.close();
        return true;
      } else {
        stmt.close();
        return false;
      }
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }
  }

  public boolean userExists(String username) {
    String QUERY = "SELECT * FROM users WHERE username = ?";
    try {
      PreparedStatement stmt = conn.prepareStatement(QUERY);
      stmt.setString(1, username);
      ResultSet rs = stmt.executeQuery();
      if (rs.next()) {
        stmt.close();
        return true;
      } else {
        stmt.close();
        return false;
      }
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    }
  }
}