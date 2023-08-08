var token = '';
var selfusername = '';  
/*document.body.style.backgroundImage = "url('tenor.jpg')";
document.body.style.backgroundSize = "cover";*/

export function deletemsg(id){
  var xhr = new XMLHttpRequest();
  var url = 'http://localhost:8080/messages/' + encodeURIComponent(id);
  xhr.open('DELETE', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Authorization', `${token}`);
  xhr.send();
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function startup(){
  if(window.localStorage.getItem("token") != null){
    token = window.localStorage.getItem("token");
    var responseData = parseJwt(token);
    if(responseData.isAdmin == true){
      document.getElementById('loggedin').innerHTML = 'You are logged in as admin';
      document.getElementById("select").innerHTML = '<option value="inbox-opt">Inbox</option><option value="outbox-opt">Outbox</option><option value="sendmsg-opt">Send Message</option><option value="deletemsg-opt">Delete Message</option><option value="adduser-opt">Add User</option><option value="updateuser-opt">Update User</option><option value="removeuser-opt">Remove User</option><option value="listusers-opt">List Users</option>';
    }else{
      document.getElementById('loggedin').innerHTML = 'You are logged in';
      document.getElementById("select").innerHTML = '<option value="inbox-opt">Inbox</option><option value="outbox-opt">Outbox</option><option value="sendmsg-opt">Send Message</option><option value="deletemsg-opt">Delete Message</option>';
    }
    document.getElementById('loggedin').style.display = 'block';
    document.getElementById('login').style.display = 'none';
    document.getElementById('logout').style.display = 'block';
    document.getElementById('options').style.display = 'block';
  }
}

document.querySelectorAll('select').forEach((select) => {
  select.addEventListener('change', function() {
    var value = this.value;
    var output = '';
    if(value=='sendmsg-opt'){
      output+='<input type="text" id="receiver-input" placeholder="Enter receiver">'
      output+='<input type="text" id="title-input" placeholder="Enter title">'
      output+='<input type="text" id="Message-input" placeholder="Enter your message">'
    }else if(value=='adduser-opt' || value=='updateuser-opt'){
      output+='<input type="text" id="username-input" placeholder="Enter username">'
      output+='<input type="text" id="password-input" placeholder="Enter password">'
      output+='<input type="text" id="name-input" placeholder="Enter name">'
      output+='<input type="text" id="surname-input" placeholder="Enter surname">'
      output+='<input type="text" id="email-input" placeholder="Enter email">'
      output+='<input type="text" id="gender-input" placeholder="Enter gender">'
      output+='<input type="text" id="isadmin-input" placeholder="Enter isAdmin">'
      output+='<input type="text" id="birthday-input" placeholder="Enter birthday">'
    }else if(value=='removeuser-opt'){
      output+='<input type="text" id="username-input" placeholder="Enter username">'
    }else if(value=='deletemsg-opt'){
      output+='<input type="text" id="id-input" placeholder="Enter id">'
    }
    document.getElementById('test').innerHTML = output;
  });
});



document.getElementById('login-button').addEventListener('click', function() {
  var xhr = new XMLHttpRequest();
  var selfUsernameInput = document.getElementById('self-username-input');
  var selfPasswordInput = document.getElementById('self-password-input');
  selfusername = selfUsernameInput.value;
  var selfpassword = selfPasswordInput.value;
  var url = 'http://localhost:8080/users/login';
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  var data = {
    username: selfusername,
    password: selfpassword
  };
  var jsonData = JSON.stringify(data);

  xhr.onload = function() {
    if(xhr.responseText == ''){
      var errordiv = document.createElement("div")
      errordiv.innerHTML = 'You are not logged in';
      errordiv.classList.add('errordiv');
      document.getElementById('login-error').innerHTML = '';
      document.getElementById('login-error').appendChild(errordiv); 
    }else{
      token = xhr.responseText;
      window.localStorage.setItem("token", token);
      var responseData = parseJwt(token);
      console.log(responseData);
      if(responseData.isAdmin == true){
        document.getElementById('loggedin').innerHTML = 'You are logged in as admin';
        document.getElementById("select").innerHTML = '<option value="inbox-opt">Inbox</option><option value="outbox-opt">Outbox</option><option value="sendmsg-opt">Send Message</option><option value="deletemsg-opt">Delete Message</option><option value="adduser-opt">Add User</option><option value="updateuser-opt">Update User</option><option value="removeuser-opt">Remove User</option><option value="listusers-opt">List Users</option>';
      }else{
        document.getElementById('loggedin').innerHTML = 'You are logged in';
        document.getElementById("select").innerHTML = '<option value="inbox-opt">Inbox</option><option value="outbox-opt">Outbox</option><option value="sendmsg-opt">Send Message</option><option value="deletemsg-opt">Delete Message</option>';
      }
      document.getElementById('loggedin').style.display = 'block';
      document.getElementById('login').style.display = 'none';
      document.getElementById('logout').style.display = 'block';
      document.getElementById('options').style.display = 'block';
    }
  }
  xhr.send(jsonData);
});

document.getElementById('logout-button').addEventListener('click', function() {
  document.getElementById('login').style.display = 'block';
  document.getElementById('loggedin').style.display = 'none';
  document.getElementById('logout').style.display = 'none';
  document.getElementById('options').style.display = 'none';
  document.getElementById('result').innerHTML = '';
  selfusername = '';
  window.localStorage.removeItem("token");
  var xhr = new XMLHttpRequest();
  var url = 'http://localhost:8080/users/logout';
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Authorization', `${token}`);
  token = '';
  xhr.send();
});

document.getElementById('send-button').addEventListener('click', function() {
  var xhr = new XMLHttpRequest();
  var e = document.getElementById("select");
  var value = e.value;

  
  if(value=='sendmsg-opt'){
    var messageInput = document.getElementById('Message-input');
    var message = messageInput.value;
    var titleInput = document.getElementById('title-input');
    var title = titleInput.value;
    var receiverInput = document.getElementById('receiver-input');
    var receiver = receiverInput.value;
    var url = 'http://localhost:8080/messages';
    xhr.open('POST', url, true); 
    var data = {
      message: message,
      title: title,
      receiver: receiver,
      sender: selfusername,
      date: new Date().getTime() + 3600000 * 3
    };
    var jsonData = JSON.stringify(data);
  }else if(value=='adduser-opt' || value=='updateuser-opt'){
    var usernameInput = document.getElementById('username-input');
    var passwordInput = document.getElementById('password-input');
    var nameInput = document.getElementById('name-input');
    var surnameInput = document.getElementById('surname-input');
    var emailInput = document.getElementById('email-input');
    var genderInput = document.getElementById('gender-input');
    var isAdminInput = document.getElementById('isadmin-input');
    var birthdayInput = document.getElementById('birthday-input');
    var username = usernameInput.value;
    var password = passwordInput.value;
    var name = nameInput.value;
    var surname = surnameInput.value;
    var email = emailInput.value;
    var gender = genderInput.value;
    var isAdmin = isAdminInput.value;
    var birthday = birthdayInput.value;
    var url = 'http://localhost:8080/users';
    xhr.open('POST', url, true); 
    var data = {
      username: username,
      password: password,
      name: name,
      surname: surname,
      email: email,
      gender: gender,
      isAdmin: isAdmin,
      birthday: birthday
    };
    var jsonData = JSON.stringify(data);
  }else if(value=='inbox-opt'){
    var url = 'http://localhost:8080/messages/inbox';
    xhr.open('GET', url, true);
  }else if(value=='outbox-opt'){
    var url = 'http://localhost:8080/messages/outbox';
    xhr.open('GET', url, true);
  }else if(value=='removeuser-opt'){
    var usernameInput = document.getElementById('username-input');
    var username = usernameInput.value;
    var url = 'http://localhost:8080/users/' + encodeURIComponent(username);
    xhr.open('DELETE', url, true);
  }else if(value=='listusers-opt'){
    var url = 'http://localhost:8080/users';
    xhr.open('GET', url, true);
  }else if(value=='deletemsg-opt'){
    var idInput = document.getElementById('id-input');
    var id = idInput.value;
    var url = 'http://localhost:8080/messages/' + encodeURIComponent(id);
    xhr.open('DELETE', url, true);
  }
  // Set the request header
  xhr.setRequestHeader('Authorization', `${token}`);
  xhr.setRequestHeader('Content-Type', 'application/json');

  // Define the callback function when the request is complete
  xhr.onload = function() {
    if (xhr.status === 200 || xhr.status === 201 || xhr.status === 204) {
      // Request succeeded
      if(value=='inbox-opt'){
        var responseData = JSON.parse(xhr.responseText);
        var resultElement = document.getElementById("result");
        document.getElementById('result').innerHTML = '<div id="success"></div>';
        document.getElementById('success').innerHTML = 'Inbox loaded successfully';
        for(var i=0; i<responseData.length; i++){
          var newdiv = document.createElement("div");
          newdiv.classList.add('resultdiv');
          newdiv.innerHTML = 'ID:' + responseData[i].id + '<br />' + 'Sender:' + responseData[i].sender + '<br />' + 'Title:' + responseData[i].title + '<br />' + 'Message:' + responseData[i].message + '<br />' + 'Date:' + responseData[i].date.slice(0,10) + '<br />' + 'Time:' + responseData[i].date.slice(11,16) + '<br /><a href="javascript:deletemsg(' + responseData[i].id + ');">Delete Message</a>';
          resultElement.append(newdiv);
        }
      }else if(value=='outbox-opt'){
        var responseData = JSON.parse(xhr.responseText);
        var resultElement = document.getElementById("result");
        document.getElementById('result').innerHTML = '<div id="success"></div>';
        document.getElementById('success').innerHTML = 'Outbox loaded successfully';
        for(var i=0; i<responseData.length; i++){
          var newdiv = document.createElement("div");
          newdiv.classList.add('resultdiv');
          newdiv.innerHTML = 'ID:' + responseData[i].id + '<br />' + 'Receiver:' + responseData[i].receiver + '<br />' + 'Title:' + responseData[i].title + '<br />' + 'Message:' + responseData[i].message + '<br />' + 'Date:' + responseData[i].date.slice(0,10) + '<br />' + 'Time:' + responseData[i].date.slice(11,16)+ '<br /><a href="javascript:deletemsg(' + responseData[i].id + ');">Delete Message</a>'  ;
          resultElement.append(newdiv);
        }
      }else if(value=='listusers-opt'){
        var responseData = JSON.parse(xhr.responseText);
        var resultElement = document.getElementById("result");
        document.getElementById('result').innerHTML = '<div id="success"></div>';
        document.getElementById('success').innerHTML = 'Users successfully listed';
        for(var i=0; i<responseData.length; i++){
          var newdiv = document.createElement("div");
          newdiv.classList.add('resultdiv');
          newdiv.innerHTML = 'Username:' + responseData[i].username + '\n' + 'Password:' + responseData[i].password + '\n' + 'Name:' + responseData[i].name + '\n' + 'Surname:' + responseData[i].surname + '\n' + 'Gender:' + responseData[i].gender + '\n' + 'IsAdmin:' + responseData[i].isAdmin + '\n' + 'Birthday:' + responseData[i].birthday.slice(0,10);
          resultElement.append(newdiv);
        }
      }else if(value=='sendmsg-opt'){
        document.getElementById('result').innerHTML = '<div id="success"></div>';
        document.getElementById('success').innerHTML = 'Message sent successfully';
      }else if(value=='removeuser-opt'){
        document.getElementById('result').innerHTML = '<div id="success"></div>';
        document.getElementById('success').innerHTML = 'User removed successfully';
      }else if(value=='deletemsg-opt'){
        document.getElementById('result').innerHTML = '<div id="success"></div>';
        document.getElementById('success').innerHTML = 'Message deleted successfully';
      }else if(value=='updateuser-opt'){
        document.getElementById('result').innerHTML = '<div id="success"></div>';
        document.getElementById('success').innerHTML = 'User updated successfully';
      }else if(value=='adduser-opt'){
        document.getElementById('result').innerHTML = '<div id="success"></div>';
        document.getElementById('success').innerHTML = 'User added successfully';
      }
      
    } else {
      // Request failed
      document.getElementById('result').innerHTML = '<div id="success"></div>';
      document.getElementById('success').innerHTML = 'Error. Please try again.';
    }
  };

  var jsonData = JSON.stringify(data);
  xhr.send(jsonData);
});

startup();