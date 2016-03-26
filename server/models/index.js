var db = require('../db');

module.exports = {
  messages: {
    get: function () { // a function which produces all the messages
      // Select all messages from messages_room
      // Select all users
      // create a user object for each user
      // Select all rooms
      // create a rooms object for each room
      // For each message
      // create an empty message array
      // assign values for each area to message object
      // add message object to array
    },
    post: function (message) { // a function which can be used to insert a message into the database
      var usernameID;
      var roomID;
      var messageID;

      // Get the users id #
      db.query('SELECT id FROM username WHERE username=?', [message.user], function(err, result) {
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

      // Insert the message id / room id to messages_room
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
    get: function () {},
    post: function () {}
  }
};

