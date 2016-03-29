var models = require('../models');
//var app = require('../app');

module.exports = {
  messages: {
    get: function (req, res) {
      console.log('GET BEING CALLED');
      models.messages.get(function(err, results) {
        var messages = [];
        results.forEach(function(message) { // assign values for each area to message object
          var retrievedMessage = {};
          retrievedMessage.id = message.id;
          retrievedMessage.createDateTime = message.createDateTime;
          retrievedMessage.message = message.message;
          retrievedMessage.username = message.username;
          retrievedMessage.roomname = message.name;
          messages.push(retrievedMessage);
        });

        res.status(200).json(JSON.stringify(messages)).end();
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) { // a function which handles posting a message to the database
      var body = req.body;
      models.messages.post(body);
      res.status(201).end();
    }
  },

  users: {
    get: function (req, res) {
      var users = models.users.get();
      res.status(200).json(JSON.stringify(users)).end();
    },
    post: function (req, res) {
      var body = req.body;
      models.users.post(body);
      res.status(201).end();
    }
  }
};

