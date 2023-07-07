package part1;

import java.io.*;
import java.net.*;
import java.util.*;

public class MyClient {
  public static final String ANSI_GREEN = "\u001B[32m";
  public static final String RESET = "\033[0m";

  public static void main(String[] args) {
    // establish a connection by providing host and port
    // number
    try (Socket socket = new Socket("localhost", 1234)) {

      // writing to server
      PrintWriter out = new PrintWriter(socket.getOutputStream(), true);

      // reading from server
      BufferedReader in = new BufferedReader(
          new InputStreamReader(socket.getInputStream()));

      // object of scanner class
      Scanner sc = new Scanner(System.in);
      String line = null;
      System.out.println(in.readLine());

      while (!"exit".equalsIgnoreCase(line)) {
        // reading from user
        line = sc.nextLine();
        if (line.equals("updateuser")) {
          System.out.println(ANSI_GREEN + "Please enter the username of user you want to update:" + RESET);
          String temp_username = sc.nextLine();
          System.out.println(ANSI_GREEN + "Please enter the user's password:" + RESET);
          String temp_password = sc.nextLine();
          System.out.println(ANSI_GREEN + "Please enter the user's first name:" + RESET);
          String temp_firstName = sc.nextLine();
          System.out.println(ANSI_GREEN + "Please enter the user's last name:" + RESET);
          String temp_lastName = sc.nextLine();
          System.out.println(ANSI_GREEN + "Please enter the user's gender:" + RESET);
          String temp_gender = sc.nextLine();
          System.out.println(ANSI_GREEN + "Please enter the user's email:" + RESET);
          String temp_email = sc.nextLine();
          System.out.println(ANSI_GREEN + "Please enter whether the user is an admin(true-false):" + RESET);
          String temp_isAdmin = sc.nextLine();
          System.out.println(ANSI_GREEN + "Please enter users birthday in yyyy-mm-dd format:" + RESET);
          String temp_birthday = sc.nextLine();
          String userstr = temp_username + "%" + temp_password + "%" + temp_firstName + "%"
              + temp_lastName + "%" + temp_gender + "%" + temp_email + "%" + temp_isAdmin + "%" + temp_birthday;
          out.println("updateuser");
          out.flush();
          line = userstr;
        } else if (line.equals("adduser")) {
          System.out.println(ANSI_GREEN + "Please enter the username of user you want to add:" + RESET);
          String temp_username = sc.nextLine();
          System.out.println(ANSI_GREEN + "Please enter the user's password:" + RESET);
          String temp_password = sc.nextLine();
          System.out.println(ANSI_GREEN + "Please enter the user's first name:" + RESET);
          String temp_firstName = sc.nextLine();
          System.out.println(ANSI_GREEN + "Please enter the user's last name:" + RESET);
          String temp_lastName = sc.nextLine();
          System.out.println(ANSI_GREEN + "Please enter the user's gender:" + RESET);
          String temp_gender = sc.nextLine();
          System.out.println(ANSI_GREEN + "Please enter the user's email:" + RESET);
          String temp_email = sc.nextLine();
          System.out.println(ANSI_GREEN + "Please enter whether the user is an admin(true-false):" + RESET);
          String temp_isAdmin = sc.nextLine();
          System.out.println(ANSI_GREEN + "Please enter users birthday in yyyy-mm-dd format:" + RESET);
          String temp_birthday = sc.nextLine();
          String userstr = temp_username + "%" + temp_password + "%" + temp_firstName + "%"
              + temp_lastName + "%" + temp_gender + "%" + temp_email + "%" + temp_isAdmin + "%" + temp_birthday;
          out.println("adduser");
          out.flush();
          line = userstr;
        } else if (line.equals("sendmsg")) {
          System.out.println(ANSI_GREEN + "Please enter the recipient's username:" + RESET);
          String recipient = sc.nextLine();
          System.out.println(ANSI_GREEN + "Please enter the message title:" + RESET);
          String title = sc.nextLine();
          System.out.println(ANSI_GREEN + "Please enter the message body:" + RESET);
          String message = sc.nextLine();
          String msgstr = recipient + "%" + title + "%" + message;
          out.println("sendmsg");
          out.flush();
          line = msgstr;
        }

        // sending the user input to server
        out.println(line);
        out.flush();

        // displaying server reply
        try {
          Thread.sleep(300);
        } catch (Exception e) {
        }
        String reply = in.readLine();
        String[] replylist = null, replylist2 = null;
        if (line.equals("inbox")) {
          replylist = reply.split("%%", 0);
          for (String s : replylist) {
            replylist2 = s.split("%", 0);
            if (replylist2[0].equals(ANSI_GREEN + "ERR")) {
              System.out.println(ANSI_GREEN + replylist2[1] + RESET);
              break;
            }
            System.out.println(ANSI_GREEN + "ID:" + replylist2[0]);
            System.out.println("Date:" + replylist2[1]);
            System.out.println("Sender:" + replylist2[2]);
            System.out.println("Title:" + replylist2[3]);
            System.out.println("Message:" + replylist2[4]);
            System.out.println("********************************" + RESET);
          }
        } else if (line.equals("outbox")) {
          replylist = reply.split("%%", 0);
          for (String s : replylist) {
            replylist2 = s.split("%", 0);
            if (replylist2[0].equals(ANSI_GREEN + "ERR")) {
              System.out.println(ANSI_GREEN + replylist2[1] + RESET);
              break;
            }
            System.out.println(ANSI_GREEN + "ID:" + replylist2[0]);
            System.out.println("Date:" + replylist2[1]);
            System.out.println("Receiver:" + replylist2[2]);
            System.out.println("Title:" + replylist2[3]);
            System.out.println("Message:" + replylist2[4]);
            System.out.println("********************************" + RESET);
          }
        } else {
          Scanner scanner = new Scanner(reply.replace('%', '\n'));
          while (scanner.hasNextLine()) {
            System.out.println(scanner.nextLine());
          }
        }
      }
      // closing the scanner object
      sc.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
