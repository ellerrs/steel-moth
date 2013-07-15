var mongoose = require('mongoose')
//  , User = mongoose.model('User')
  , _ = require('underscore')
  , DataSift = require('datasift')
  , DataSiftRest = require('datasift-rest')
  , util = require('util')
  , config = require('../../../config/config')
  , errorHelpers = require('../../../config/middlewares/errors')

var d = new DataSiftRest({USERNAME: config.datasift.username, API_KEY: config.datasift.password});
var consumer = new DataSift(config.datasift.username, config.datasift.password);

// compile a CSDL
exports.compile = function (req, res) {

  var csdl_text = req.body.csdl_text;
  d.core.compile(csdl_text, function (err, data) {
  	return res.jsonp(data.hash);
  });
  // curl -X POST -H "Content-Type: application/json" http://localhost:61300/ds/compile -d '{"csdl_text": "interaction.content contains \"apple\""}'
  // curl -X POST -H "Content-Type: application/json" http://localhost:61300/ds/compile -d '{"csdl_text": "interaction.content contains \"apple\""}'
  // curl -X POST -H "Content-Type: application/json" http://localhost:61300/ds/compile -d '{"csdl_text": "interaction.content contains \"chacha\""}'
}

exports.checkBalance = function (req, res) {
  d.core.balance(function(err, data) {
    return res.jsonp(data);
  });
}

exports.connect = function (req, res) {
  consumer.connect();
  return res.jsonp("{'test'}");
}

exports.disconnect = function (req, res) {
  consumer.disconnect();
  return res.jsonp("{'test'}");
}

exports.subscribe = function (req,res) {
  var csdl_text = req.body.csdl_text;
  d.core.compile(csdl_text, function (err, data) {
    if(err) {
      return res.jsonp(err);
    }else{
      consumer.subscribe(data.hash);
      return res.jsonp(data.hash);
    }
  });
  // curl -X POST -H "Content-Type: application/json" http://localhost:61300/ds/subscribe -d '{"csdl_text": "interaction.content contains \"apple\""}'
  // curl -X POST -H "Content-Type: application/json" http://localhost:61300/ds/subscribe -d '{"csdl_text": "interaction.content contains \"apple\""}'
  // curl -X POST -H "Content-Type: application/json" http://localhost:61300/ds/subscribe -d '{"csdl_text": "interaction.content contains \"chacha\""}'

}

exports.unsubscribe = function (req, res) {
  consumer.unsubscribe(req.body.csdl_hash);
  return res.jsonp("{'test'}");
  // curl -X POST -H "Content-Type: application/json" http://localhost:61300/ds/unsubscribe -d '{"csdl_hash": "b1eeaa054492ad021aefed86b6bc5e9a"}'

}

consumer.on("connect", function(){
  console.log("Connected!");
});

consumer.on("subscribed", function(message) {
  console.log("Subscribed: " + message)
});

consumer.on("unsubscribed", function(message) {
  console.log("unsubscribed: " + message)
});

//Emitted when there is a warning
consumer.on("warning", function(message){
  console.log("Warning: " + message);
});

//Emitted when disconnected
consumer.on("disconnect", function(){
  console.log("Disconnected!");
});

//Emitted when an interaction is received
consumer.on("interaction", function(data){
  console.log("Received data: " + JSON.stringify(data));
});

//Emitted when a delete message is received
consumer.on("delete", function(data){
  console.log("Delete: " + JSON.stringify(data));
});

consumer.on("error", function(error){
  console.log("Error: " + error.message);
});


// consumer.disconnect();


