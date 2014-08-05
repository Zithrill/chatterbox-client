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
      for(var i = 0; i < 99; i++){
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

  var username = messageObject.username;
  var roomName = messageObject.roomname;
  var msg = messageObject.text;
  var date = new Date(messageObject.createdAt);
  var messageToDisplay = username + ': ' + msg + ''

  $('#chats').append('<li></li>');
  $('li:last-child').text(messageToDisplay).addClass('' + username).html();
  $('li:last-child').append('<span></span>')
  $('span:last-child').addClass('time').text(date.toLocaleTimeString());

  if(app.friends.indexOf(messageObject.username) !== -1){
    $('li:last-child').addClass('friends');
  }
};

app.addRoom = function(roomName){
  $('select').append('<option value='+roomName+'>'+roomName+'</option>')
};

app.addFriend = function(friendName){
  app.friends.push(friendName);
};

app.init = function(){
  app.fetch();
};

app.init();

$('document').ready(function(){
  var interval;
  $('.submitBoard').on("click", function(){
    var messageToSend = {
      username: window.location.search.slice(10),
      text: $('.message').val(),
      roomname: app.currentRoom
    }
    $('.message').val('');
    app.send(messageToSend);
  });

  $('.submitRoom').on("click", function(){
    //make new room here
    var newRoom = $('.room').val();
    app.chatRooms.push(newRoom);
    app.addRoom(newRoom);
    $('select').val(newRoom);
    $('select').trigger('change');
    $('.room').val('');
  });

$(document).on('click', 'li', function(){
  if(app.friends.indexOf($(this)[0].classList[0]) === -1){
    app.addFriend($(this)[0].classList[0]);
  }
  });

$('select').on('change', function(){
  var room = $('select :selected').text();
  app.clearMessages();
  app.currentRoom = room;
  if(room === "All Rooms"){
    room = undefined;
  }
  app.fetch(room);
  window.clearInterval(interval);
  interval = window.setInterval(function(){app.fetch(room)}, 1250);
});

$('.submitUser').on('click', function(){
  window.location.search = "?username=" + $('.user').val();
  $('user').val("");
})

interval = window.setInterval(app.fetch, 1250);

});




