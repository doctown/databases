var models = require('../models');
//var app = require('../app');

module.exports = {
  messages: {
    get: function (req, res) {
      // create an empty array
      var messages = [];
      // call models.messages.get();
      messages = models.messages.get();
      // Stringify the array
      // Send the array back to the user
      res.status(200).json(JSON.stringify(messages)).end();
    }, // a function which handles a get request for all messages
    post: function (req, res) { // a function which handles posting a message to the database
      // Get the data from the post request
      var body = req.body;
      // Call models.messages.post(data);
      models.messages.post(JSON.parse(body));
      // Reply with object creation response code
      res.status(201).end();
    }
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {}
  }
};

