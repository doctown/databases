var app = {
  server: 'http://127.0.0.1:3000/classes/messages/',
  friends: [],
  username: window.location.search.split('username=')[1],
  roomname: 'lobby',

  init: function() {
    //call dropdown.js
    $('dropdown-toggle').dropdown();
    // Handle events from clicking username
    $('#main').on('click', '.username', function () {
      app.addFriend($(this).text());
    });

    // Handle events from submit button and adds text to page
    $('#send').submit( function(e) {
      e.preventDefault();
      // Create a message
      var message = {
        username: app.username,
        text: $(this).find('#message').val(),
        roomname: app.roomname// get current room name
      };
      app.handleSubmit(message);
    });

    // Handle event on username change
    $('#user').on('click', 'button', function() {
      app.username = $(this).siblings('#user-input').val();
    });

    // Handle click on add new chatroom
    $('#main').on('click', '.room-add', function() {
      var newRoomName = prompt('Enter new room');
      // TODO: Sanitize input
      app.addRoom(newRoomName);
    });

    // When a room is selected, create tab for room
    $('#roomSelect').change(function() {
      // Get the room selected
      var roomName = $(this).val();
      app.roomnname = roomName;
      // Create html list element for room tab and add room name as the class
      var $newRoomTab = $('<li role="presentation"></li>');
      $newRoomTab.addClass(roomName);
      $newRoomTab.html('<a href="#">' + roomName + '</a>');
      // Add active class and remove from siblings active class
      $newRoomTab.addClass('active');
      $('.tabs .tab-links').children().removeClass('active');
      // Append new tab to tabs area
      $('.tabs .tab-links').append($newRoomTab);
    });

    // Click on tab and creates room content on page
    $('.tabs .tab-links').on('click', 'li', function() {
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      var roomName = $(this).text();
      app.clearMessages();
      $(this).fadeIn('slow');
      app.fetchRoom(roomName);
    });

    app.setupRooms();

    // Initialize room
    //automateMessages();
  },
  send: function (message) {

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function () {
    // body...
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      dataTye: 'json',
      contentType: 'application/json',
      success: function (data, status) {
        // TODO: Sanitize all data received from Parse
        for (var i = 0; i < data.length; i++) {
          app.addMessage(data[i].message);
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message', data);
      }
    });

  },

  fetchRoom: function (roomName) {
    // body...
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      dataTye: 'json',
      contentType: 'application/json',
      data: {
        'where': {
          'roomname': roomName
        }
      },
      success: function (data, status) {
        // TODO: Sanitize all data received from Parse
        for (var i = 0; i < data.results.length; i++) {
          app.addMessage(data.results[i]);
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message', data);
      }
    });

  },

  
  clearMessages: function() {
    $('#chats').empty();
  },
  // Add one message to the DOM under chats
  addMessage: function(message) {
    var username = htmlEntities(stripTags(message.username));
    // Clean messages from XSS attack
    var cleanMessage = htmlEntities(stripTags(message.text));
    // Create a DOM node under chats
    // Create a div for the message with message class
    var $chatMessage = $('<div class="chat-message panel panel-primary"></div>');
    var $panelBody = $('<div class="panel-body"></div>');
    // Add the username and message in the div
    // Add bold tag to username
    $panelBody.append('<span class=" panel-heading username ' + username + '">' + username + '</span>:'); 
    //check if userName is in friend list
    //if in list, add friend Class to message  
    if (app.friends.indexOf(username) !== -1) {
      $panelBody.append('<span class="message friend ' + username + '"> <br />' + cleanMessage + '</span>');
    } else {
      $panelBody.append('<span class="message ' + username + '"> <br />' + cleanMessage + '</span>');
    }
    // Appende message to chats
    $chatMessage.append($panelBody);
    $('#chats').append($chatMessage);
  },

  setupRooms: function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      dataTye: 'json',
      contentType: 'application/json',
      success: function (data, status) {
        var rooms = {};
        // TODO: Sanitize all data received from Parse
        for (var i = 0; i < data.results.length; i++) {
          var roomName = htmlEntities(stripTags(data.results[i].roomname));
          rooms[roomName] = roomName;
        }
        for (var key in rooms) {
          app.addRoom(rooms[key]);
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch message', data);
      }
    });
  },
  // Add a room to the list of available rooms on the chat page
  addRoom: function(roomName) {
    // TODO: See if the room name might have XSS vulnerability
    // use jQuery to create an option for the room name 
    // Append the option to #roomSelect
    $('#roomSelect')
    .append($('<option></option>')
    .attr('value', roomName)
    .text(roomName));
  }, 

  //adds a friend class to all friends messages
  addFriend: function(friendName) {

    //add friend to friend array.
    app.friends.push(friendName);
    //find all friend's messages and add friend Class

    $('.' + friendName + '.message').addClass('friend');
  },

  // Add message to the chat room
  handleSubmit: function(message) {
    // Send message to the server
    app.send(message);
    // TODO: Sanitize text before sending to server
  }
};

// HELPER FUNCTIONS
// Strips html from a text and replace it with generic html to be rendered as text
// Help protect against XSS attacks
var htmlEntities = function (str) {
  if (str === undefined) {
    return;
  }

  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

// Strips HTML tags from text
// Credits: https://github.com/kvz/phpjs/blob/master/functions/strings/strip_tags.js
var stripTags = function(input, allowed) {
  if (input === undefined) {
    return;
  }

  allowed = (((allowed || '') + '')
    .toLowerCase()
    .match(/<[a-z][a-z0-9]*>/g) || [])
    .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '')
    .replace(tags, function($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
};

//create a function to automate messages
var automateMessages = function() {
  app.clearMessages();
  app.fetchRoom(app.roomname);
};
// Temporary disable
//setInterval(automateMessages, 10000);
