// YOUR CODE HERE:

var app = {
  server: "https://api.parse.com/1/classes/chatterbox",
  currentRoom: "",
  chatRooms: ['allRooms', 'lobby'],
  friends: [],
  interval: null
};

app.send = function(message){
  $.ajax({
    // always use this url
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function(roomName){
  $.ajax({
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    data: {
      order: '-createdAt',
    },
    success: function (object) {
      var results = object.results;
      for(var i = 0; i < results.length; i++){
        if(app.chatRooms.indexOf(results[i].roomname) === -1){
          app.chatRooms.push(results[i].roomname);
          $('select').append('<option value='+results[i].roomname+'>'+results[i].roomname+'</option>')
        }
      }
      app.clearMessages();
      for(var i = 0; i < 10; i++){
        if(roomName === undefined || results[i].roomname === roomName){
          app.addMessage(results[i]);
        }
      }
    },
    failure: function(){
      console.log("failure")
    }
  });
};


app.clearMessages = function(){/*add clear message method*/
  $('#chats').empty();
};

app.addMessage = function(messageObject){

  var username = messageObject.username
  var msg = messageObject.text
  if(app.friends.indexOf(messageObject.username) !== -1){
    $('#chats').append('<li><span class="'+username+' friends" >'+encodeURI(messageObject.username) +'</span>' + ': ' + encodeURI(messageObject.text) + ' time created: ' + messageObject.createdAt + ' room: ' +messageObject.roomname+'</li>');
  }else{
    $('#chats').append('<li><span class='+username+'>'+encodeURI(messageObject.username) +'</span>' + ': ' + encodeURI(messageObject.text) + ' time created: ' + messageObject.createdAt + ' room: ' +messageObject.roomname+'</li>');
  }

/*add message method*/};

app.addRoom = function(roomName){
/*add room method*/
  $('#roomSelect').append('<li id='+roomName+'></li>')
};

app.addFriend = function(friendName){
  app.friends.push(friendName);
};

app.init = function(){
  app.fetch();
};

app.init();

$('document').ready(function(){
  $('.submit').on("click", function(){
    var messageToSend = {
      username: window.location.search.slice(10),
      text: $('input').val()
      // roomname: app.currentRoom
    }
    app.send(messageToSend);
  });

$(document).on('click', 'span', function(){
  if(app.friends.indexOf($(this)[0].classList[0]) === -1){
    app.addFriend($(this)[0].classList[0]);
  }
  });

$('select').on('change', function(){
  app.clearMessages();
  app.fetch($(this).val());
  window.clearInterval(app.interval);
  app.interval = window.setInterval(app.fetch($(this).val()), 500);
});

app.interval = window.setInterval(app.fetch, 500);

});




