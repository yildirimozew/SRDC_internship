package part1;

import java.io.*;
import java.net.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.ArrayList;

public class MyServer {
  public static final String ANSI_GREEN = "\u001B[32m";
  public static final String RESET = "\033[0m";

  public static void main(String[] args) {
    ServerSocket server = null;
    try {
      Database datab = new Database();
      // server is listening on port 1234
      server = new ServerSocket(1234);
      server.setReuseAddress(true);
      // running infinite loop for getting
      // client request
      while (true) {

        // socket object to receive incoming client
        // requests

        Socket client = server.accept();

        // Displaying that new client is connected
        // to server
        System.out.println(ANSI_GREEN + "New client connected" +
            client.getInetAddress().getHostAddress());

        // create a new thread object
        ClientHandler clientSock = new ClientHandler(client, datab);

        // This thread will handle the client
        // separately
        new Thread(clientSock).start();
      }
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      if (server != null) {
        try {
          server.close();
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
  }

  private static class ClientHandler implements Runnable {
    private final Socket clientSocket;
    private final Database datab;

    // Constructor
    public ClientHandler(Socket socket, Database datab) {
      this.datab = datab;
      this.clientSocket = socket;
    }

    public void run() {
      PrintWriter out = null;
      BufferedReader in = null;
      try {

        // get the outputstream of client
        out = new PrintWriter(clientSocket.getOutputStream(), true);

        // get the inputstream of client
        in = new BufferedReader(
            new InputStreamReader(clientSocket.getInputStream()));

        out.println(ANSI_GREEN + "Please enter a command:" + RESET);
        String line;
        String username = null;
        Boolean isAdmin = false;
        while ((line = in.readLine()) != null) {

          // writing the received message from
          // client
          System.out.printf(" Sent from the client: %s\n", line);
          if (line.equals("login")) {
            out.println(ANSI_GREEN + "Please enter your username:" + RESET);
            String temp_username = in.readLine();
            out.println(ANSI_GREEN + "Please enter your password:" + RESET);
            String temp_password = in.readLine();
            if (datab.login(temp_username, temp_password)) {
              username = temp_username;
              isAdmin = datab.isAdmin(username);
              if (isAdmin) {
                out.println(ANSI_GREEN + "Login successful as an admin" + RESET);
              } else {
                out.println(ANSI_GREEN + "Login successful" + RESET);
              }
            } else {
              out.println(ANSI_GREEN + "Login failed" + RESET);
            }
          } else if (line.equals("logout")) {
            if (username != null) {
              username = null;
              isAdmin = false;
              out.println(ANSI_GREEN + "Logout successful" + RESET);
            } else {
              out.println(ANSI_GREEN + "You must be logged in to logout" + RESET);
            }
          } else if (line.equals("sendmsg")) {
            if (username != null) {
              String[] msglst = in.readLine().split("%", 0);
              Message msg = new Message(-1, username, msglst[0], msglst[1], msglst[2],
                  Date.from(java.time.Instant.now()));
              if (datab.saveMessage(msg)) {
                out.println(ANSI_GREEN + "Message sent" + RESET);
              } else {
                if (!datab.userExists(username)) {
                  out.println(ANSI_GREEN + "ERR%User does not exist" + RESET);
                  username = null;
                  isAdmin = false;
                } else if (!datab.userExists(msglst[0])) {
                  out.println(ANSI_GREEN + "ERR%Recipient does not exist" + RESET);
                } else {
                  out.println(ANSI_GREEN + "ERR%Message failed to send" + RESET);
                }
              }
            } else {
              out.println(ANSI_GREEN + ANSI_GREEN + "ERR%You must be logged in to send a message" + RESET);
            }
          } else if (line.equals("inbox")) {
            if (username != null) {
              StringBuilder finalstr = new StringBuilder();
              Message[] inbox = datab.inbox(username);
              ArrayList<String[]> stringTable = new ArrayList<>();
              SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
              int i = 1;
              try {
                stringTable
                    .add(
                        new String[] { Integer.toString(inbox[0].id), dateFormat.format(inbox[0].date),
                            ((inbox[0].getSender() == null)
                                ? "<deleted user>"
                                : (inbox[0].getSender())),
                            inbox[0].getTitle(), inbox[0].getMessage() });
                while (inbox[i] != null) {
                  stringTable
                      .add(
                          new String[] { Integer.toString(inbox[i].id), dateFormat.format(inbox[i].date),
                              ((inbox[i].getSender() == null)
                                  ? "<deleted user>"
                                  : (inbox[i].getSender())),
                              inbox[i].getTitle(), inbox[i].getMessage() });
                  i++;
                }
                for (String[] row : stringTable) {
                  finalstr.append(row[0] + "%");
                  finalstr.append(row[1] + "%");
                  finalstr.append(row[2] + "%");
                  finalstr.append(row[3] + "%");
                  finalstr.append(row[4] + "%%");
                }
                out.println(finalstr.toString());
              } catch (Exception e) {
                if (!datab.userExists(username)) {
                  out.println(ANSI_GREEN + "ERR%User does not exist" + RESET);
                  username = null;
                  isAdmin = false;
                } else {
                  out.println(ANSI_GREEN + "ERR%Error while viewing inbox" + RESET);
                }
              }
            } else {
              out.println(ANSI_GREEN +
                  "ERR%You must be logged in to view your inbox" + RESET);
            }
          } else if (line.equals("outbox")) {
            if (username != null) {
              StringBuilder finalstr = new StringBuilder();
              Message[] outbox = datab.outbox(username);
              ArrayList<String[]> stringTable = new ArrayList<>();
              SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
              int i = 1;
              try {
                stringTable
                    .add(
                        new String[] { Integer.toString(outbox[0].id), dateFormat.format(outbox[0].date),
                            ((outbox[0].getSender() == null)
                                ? "<deleted user>"
                                : (outbox[0].getSender())),
                            outbox[0].getTitle(), outbox[0].getMessage() });
                while (outbox[i] != null) {
                  stringTable
                      .add(
                          new String[] { Integer.toString(outbox[i].id), dateFormat.format(outbox[i].date),
                              ((outbox[i].getSender() == null)
                                  ? "<deleted user>"
                                  : (outbox[i].getSender())),
                              outbox[i].getTitle(), outbox[i].getMessage() });
                  i++;
                }
                for (String[] row : stringTable) {
                  finalstr.append(row[0] + "%");
                  finalstr.append(row[1] + "%");
                  finalstr.append(row[2] + "%");
                  finalstr.append(row[3] + "%");
                  finalstr.append(row[4] + "%%");
                }
                out.println(finalstr.toString());
              } catch (Exception e) {
                if (!datab.userExists(username)) {
                  out.println(ANSI_GREEN + "ERR%User does not exist" + RESET);
                  username = null;
                  isAdmin = false;
                } else {
                  out.println(ANSI_GREEN + "ERR%Error while viewing outbox" + RESET);
                }
              }
            } else {
              out.println(ANSI_GREEN +
                  "ERR%You must be logged in to view your outbox" + RESET);
            }
          } else if (line.equals("adduser")) {
            if (isAdmin) {
              SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
              String[] userlst = in.readLine().split("%", 0);
              User user = new User(userlst[0], userlst[1], userlst[2], userlst[3], userlst[4], userlst[5],
                  Boolean.parseBoolean(userlst[6]), dateFormat.parse(userlst[7]));
              if (datab.addUser(user)) {
                out.println(ANSI_GREEN + "User added" + RESET);
              } else {
                out.println(ANSI_GREEN + "Error while adding user" + RESET);
              }
            } else {
              out.println(ANSI_GREEN + "You must be an admin to add a user" + RESET);
            }
          } else if (line.equals("updateuser")) {
            if (isAdmin) {
              SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
              String[] userlst = in.readLine().split("%", 0);
              User user = new User(userlst[0], userlst[1], userlst[2], userlst[3], userlst[4], userlst[5],
                  Boolean.parseBoolean(userlst[6]), dateFormat.parse(userlst[7]));
              if (datab.updateUser(user)) {
                out.println(ANSI_GREEN + "User updated" + RESET);
              } else {
                out.println(ANSI_GREEN + "Error while updating user" + RESET);
              }
            } else {
              out.println(ANSI_GREEN +
                  "You must be an admin to update a user" + RESET);
            }
          } else if (line.equals("removeuser")) {
            if (isAdmin) {
              out.println(ANSI_GREEN + "Please enter the username of user you want to remove:" + RESET);
              String temp_username = in.readLine();
              if (datab.removeUser(temp_username)) {
                out.println(ANSI_GREEN + "User deleted" + RESET);
              } else {
                out.println(ANSI_GREEN + "Error while deleting user" + RESET);
              }
            } else {
              out.println(ANSI_GREEN +
                  "You must be an admin to delete a user" + RESET);
            }
          } else if (line.equals("listusers")) {
            if (isAdmin) {
              User[] users = datab.listUsers();
              StringBuilder finalstr = new StringBuilder();
              int i = 1;
              try {
                finalstr.append(ANSI_GREEN + users[0].getUsername() + "|" +
                    users[0].getName() + "|" +
                    users[0].getSurname() + "%" + RESET);
                while (users[i] != null) {
                  finalstr.append(ANSI_GREEN + users[i].getUsername() +
                      "|" + users[i].getName() +
                      "|" +
                      users[i].getSurname() + "%" + RESET);
                  i++;
                }
                out.println(finalstr.toString());
              } catch (Exception e) {
                if (!datab.userExists(username)) {
                  out.println(ANSI_GREEN + "User does not exist" + RESET);
                  username = null;
                  isAdmin = false;
                } else {
                  out.println(ANSI_GREEN + "Error while viewing users" + RESET);
                }
              }
            } else {
              out.println(ANSI_GREEN + "You must be an admin to view users" + RESET);
            }
          } else if (line.equals("help")) {
            if (isAdmin) {
              out.println(ANSI_GREEN +
                  "Commands: % LOGIN username password % LOGOUT % SENDMSG receiver_username title msg % INBOX % OUTBOX % ADDUSER username password "
                  +
                  "name surname gender email isAdmin % UPDATEUSER username password name surname gender email isAdmin % REMOVEUSER username % LISTUSERS % HELP"
                  + RESET);
            } else {
              out.println(ANSI_GREEN +
                  "Commands: % LOGIN username password % LOGOUT % SENDMSG receiver_username title msg % INBOX % OUTBOX % HELP % DELETEMSG "
                  + RESET);
            }
          } else if (line.equals("deletemsg")) {
            if (username != null) {
              out.println(ANSI_GREEN + "Please enter the id of message you want to remove:" + RESET);
              String temp_id = in.readLine();
              if (datab.deleteMessage(
                  Integer.parseInt(temp_id), username)) {
                out.println(ANSI_GREEN + "Message deleted" + RESET);
              } else {
                out.println(ANSI_GREEN + "Error while deleting message" + RESET);
              }
            } else {
              out.println(ANSI_GREEN + "You must be logged in to delete a message" + RESET);
            }
          } else {
            out.println(ANSI_GREEN + "Invalid command" + RESET);
          }
        }
      } catch (Exception e) {
        System.out.println(ANSI_GREEN + e.getMessage() + RESET);
      } finally {
        try {
          if (out != null) {
            out.close();
          }
          if (in != null) {
            in.close();
            clientSocket.close();
          }
        } catch (IOException e) {
          e.printStackTrace();
        }
      }
    }
  }
}
