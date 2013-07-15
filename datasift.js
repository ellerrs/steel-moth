var DataSiftRest = require('datasift-rest');
var DataSift = require('datasift');
var util = require('util')

var datasift_username = "ellerrs";
var datasift_password = "de6365efe3dbb526017eb46a7292d1da"


var ds = new DataSiftRest({USERNAME: datasift_username, API_KEY: datasift_password});

ds.core.balance(function(err, data) {
  if (err) { throw err; }
  console.log(data['balance']);
});


var consumer = new DataSift(datasift_username, datasift_password);

consumer.connect();

consumer.on("connect", function(){
	console.log("Connected!");
	//Subscribe to Foursquare and Gowalla checkins
});

csdl_text = "interaction.content contains \"apple\"";
ds.core.compile(csdl_text, function(err, data){
	console.log(util.inspect(data));
});

consumer.disconnect();


