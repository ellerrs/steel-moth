var mongoose = require('mongoose')
  , _ = require('underscore')
  , DataSift = require('datasift')
  , DataSiftRest = require('datasift-rest')
  , util = require('util')
  , config = require('../../../config/config')
  , errorHelpers = require('../../../config/middlewares/errors')
  , mysql = require('mysql')
  , d = new DataSiftRest({USERNAME: config.datasift.username, API_KEY: config.datasift.password})
  , consumer = new DataSift(config.datasift.username, config.datasift.password)
  , mysqlconn = mysql.createConnection({
      host : config.mysqldb.host,
      user : config.mysqldb.username,
      password : config.mysqldb.password,
      database : config.mysqldb.database})


/* 
  ds/compile
  Compiles a CSDL string using the REST API. 

  Accepts: JSON post string containting 'csdl_text'. 
  Returns:  id          - mysql primary key
            hash        - compiled stream hash used for subscribing
            created_at  - timestamp provided by DataSift
            dpu         - data processing unit cost for this stream
            text        - text used to compile stream

  Example: curl -X POST -H "Content-Type: application/json" http://localhost:61300/ds/compile -d '{"csdl_text": "interaction.content contains \"applessasdfiiiii\""}'
*/
exports.compile = function (req, res) {
  d.core.compile(req.body.csdl_text, function (err, data) {
    data = _.extend(data, {'text': req.body.csdl_text, 'cost_per_hour': (data.dpu * config.datasift.dpuCost) });
    mysqlconn.query('INSERT IGNORE INTO streams SET ?', data, function(err, results) {
      if (err) throw err;
    });
    return res.jsonp(data);
  });
}


/* 
  ds/balance
  Returns account balance data from Datasift REST API.

  Accepts: nothing
  
  Returns:  {
              "balance": {
                "credit": 9.81,
                "plan": "free",
                "threshold": 2
              }
            }
            
  Example: curl http://localhost:61300/ds/balance
*/
exports.checkBalance = function (req, res) {
  d.core.balance(function(err, data) {
    return res.jsonp(data);
  });
}


/* 
  ds/usage/:period
  Returns usage data from Datasift REST API for specified period.

  Accepts: Querystring parameter value of 'day', 'hour' or 'current'
  
  Returns:  {
              "start": "Mon, 15 Jul 2013 19:15:00 +0000",
              "end": "Mon, 15 Jul 2013 19:20:00 +0000",
              "streams": {
                "b1eeaa054492ad021aefed86b6bc5e9a": {
                  "licenses": {
                    "facebook": 37,
                    "gender": 25,
                    "interaction": 37,
                    "language": 34,
                    "links": 15,
                    "salience.sentiment": 27
                  },
                  "seconds": 114
                }
              }
            }
            {
              "start": "Mon, 15 Jul 2013 21:00:00 +0000",
              "end": "Mon, 15 Jul 2013 21:05:00 +0000",
              "streams": {
                "b1eeaa054492ad021aefed86b6bc5e9a": {
                  "licenses": {
                    "facebook": 78,   free
                    "gender": 439,     free
                    "interaction": 752,    free
                    "klout.score": 650,    free
                    "language": 736,     free
                    "links": 374,      .10/1000
                    "salience.sentiment": 664,   .05/1000
                    "twitter": 674    .10/1000
                  },
                  "seconds": 300
                }
              }
            }
            
  Example: curl http://localhost:61300/ds/usage/current
*/
exports.checkUsage = function (req, res) {
  d.core.usage(req.params.period, function (err, data) {
    return res.jsonp(data);
  })
}


/* 
  ds/start
  Connets to the datasift steaming api, and will eventually bootstrap all required connections

  Accepts: 
  Returns:  

  Example: curl http://localhost:61300/ds/start
*/
exports.connect = function (req, res) {
  consumer.connect();
  return res.send();
}
consumer.on("connect", function (){
  console.log("Connected!");
});


/* 
  ds/stop
  Disconnects

  Accepts: 
  Returns:  

  Example: curl http://localhost:61300/ds/stop
*/
exports.disconnect = function (req, res) {
  consumer.disconnect();
  return res.send();
}
consumer.on("disconnect", function(){
  console.log("Disconnected!");
});


/* 
  ds/subscribe/:hash
  Subscribes to the stream identified by :hash

  Accepts: Querystring parameter value for hash
  
  Returns:  

  Example: curl http://localhost:61300/ds/subscribe/b1eeaa054492ad021aefed86b6bc5e9a
*/
exports.subscribe = function (req,res) {
  consumer.subscribe(req.params.hash);
  return res.send();
}
consumer.on("subscribed", function(message) {
  console.log("Subscribed: " + message)
});


/* 
  ds/unsubscribe/:hash
  Unsubscribes to the stream identified by :hash

  Accepts: Querystring parameter value for hash
  
  Returns:  

  Example: curl http://localhost:61300/ds/unsubscribe/b1eeaa054492ad021aefed86b6bc5e9a
*/
exports.unsubscribe = function (req, res) {
  consumer.unsubscribe(req.params.hash);
  return res.send();
}
consumer.on("unsubscribed", function(message) {
  console.log("unsubscribed: " + message)
});



consumer.on("warning", function(message){
  console.log("Warning: " + message);
});

consumer.on("interaction", function(data){
  console.log("Received data: " + JSON.stringify(data));
});

consumer.on("delete", function(data){
  console.log("Delete: " + JSON.stringify(data));
});

consumer.on("error", function(error){
  console.log("Error: " + error.message);
});




