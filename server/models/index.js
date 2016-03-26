var db = require('../db');

module.exports = {
  messages: {
    get: function () { // a function which produces all the messages
      // create an empty message array
      var messages = [];
      var rooms = {};
      var usernames = {};
      var messagesRoom = {};
      var messagesUsername = {};

      // Select all messages from messagesRoom
      db.query('SELECT * FROM messages', function(err, result) {
        if (err) {
          throw err;
        }

        result.forEach(function(message) {
          var msg = {};
          msg.id = message.id;
          msg.createDateTime = message.createDateTime;
          msg.message = message.message;
          messages.push(msg);
        });
      });

      // Select all rooms
      db.query('SELECT * FROM rooms', function(err, result) {
        if (err) {
          throw err;
        }
        // create a rooms object for each room
        result.forEach(function(room) {
          rooms[room.id] = room.name;
        });
      });

      // Select all users
      db.query('SELECT * FROM username', function(err, result) {
        if (err) {
          throw err;
        }
        // create a user object for each user
        result.forEach(function(username) {
          usernames[username.id] = username.username;
        });
      });

      db.query('SELECT * FROM message_username', function(err, result) {
        if (err) {
          throw err;
        }
        result.forEach(function(message) {
          messagesUsername[message.id_message] = usernames[message.id_username];
        });
      });

      db.query('SELECT * FROM message_room', function(err, result) {
        if (err) {
          throw err;
        }
        result.forEach(function(message) {
          messagesRoom[message.id_message] = rooms[message.id_room];
        });
      });

      // For each message
      messages.forEach(function(message) { // assign values for each area to message object
        message.username = messagesUsername[message.id];
        message.roomname = messagesRoom[message.id];
      });

      return messages;
    },
    post: function (message) { // a function which can be used to insert a message into the database
      var usernameID, roomID, messageID;

      // Get the users id #
      db.query('SELECT id FROM username WHERE username=?', [message.username], function(err, result) {
        if (err) {
          throw err;
        }
        // Get the messages id number
        usernameID = result[0].id;
      });

      // Get the rooms id number
      db.query('SELECT id FROM rooms WHERE name=?', [message.roomname], function(err, result) {
        if (err) {
          throw err;
        }
        // Get the messages id number
        roomID = result[0].id;
      });

      // Insert the message in the database
      db.query('INSERT INTO messages SET message=?', [message.message], function(err, result) {
        if (err) {
          throw err;
        }
        // Get the messages id number
        messageID = result.insertId;
      });

      // Insert the message id / room id to messagesRoom
      db.query('INSERT INTO message_room SET id_message=?, id_room=?', [messageID, roomID], function(err, result) {
        if (err) {
          throw err;
        }
      });

      // Insert the message id / username id to username_message
      db.query('INSERT INTO message_username SET id_message=?, id_username=?', [messageID, usernameID], function(err, result) {
        if (err) {
          throw err;
        }
      });
    }
  },

  users: {
    // Ditto as above.
    get: function () {

    },
    post: function (user) {
      // Get the users id #
      db.query('SELECT id FROM username WHERE username=?', [user.username], function(err, result) {
        if (err) {
          throw err;
        }
        if (result.length === 0) { // add username to db
          // Get the messages id number
          db.query('INSERT INTO username SET username=?', [user.username], function(err, result) {
            if (err) {
              throw err;
            }
          });
        }
      });
    }
  }
};

