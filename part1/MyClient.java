package part1;

import java.io.*;
import java.net.*;
import java.util.*;

public class MyClient {
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

        // sending the user input to server
        out.println(line);
        out.flush();

        // displaying server reply
        try {
          Thread.sleep(300);
        } catch (Exception e) {
        }
        String reply = in.readLine();
        Scanner scanner = new Scanner(reply.replace('%', '\n'));
        while (scanner.hasNextLine()) {
          System.out.println(scanner.nextLine());
        }
      }

      // closing the scanner object
      sc.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}
