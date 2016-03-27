var db = require('../db');

module.exports = {
  messages: {
    get: function (callback) { // a function which produces all the messages
      db.query('SELECT messages.id, messages.createDateTime, messages.message, rooms.name, username.username FROM username, message_username, messages, message_room, rooms WHERE messages.id = message_room.id_message AND message_room.id_room = rooms.id AND username.id = message_username.id_username AND message_username.id_message = messages.id', callback);
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

        // Get the rooms id number
        db.query('SELECT id FROM rooms WHERE name=?', [message.roomname], function(err, result) {
          if (err) {
            throw err;
          }
          // Get the messages id number
          roomID = result[0].id;

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
        });
      });
    }
  },

  users: {
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

