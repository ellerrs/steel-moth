var mongoose = require('mongoose')
  , _ = require('underscore');

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
// healthCheck
exports.healthcheck = function (req, res) {
  res.jsonp({'healthcheck': 'ok'});
}

exports.home = function (req, res) {
  //var uptime_sec = process.uptime();
  var uptime_hrs = pad(Math.floor(process.uptime()/60/60),2);
  var uptime_min = pad(Math.floor((process.uptime()/60)-(uptime_hrs*60)),2)
  var uptime_sec = pad(Math.floor(process.uptime()-(uptime_hrs*60*60)-(uptime_min*60)),2)
  var uptime_string = uptime_hrs + ':' + uptime_min + ':' + uptime_sec;
  res.jsonp({hrs: uptime_hrs, min: uptime_min, sec: uptime_sec, uptime: uptime_string, uptime_seconds: process.uptime()})
}