// bootstrap.js
// Launches the child processes and starts the healthcheck routine.
// 
// If a child process dies, times-out, or is killed it will spawn a new process 
// to take its place, listening on the same port as the newly-decesed process. 
// If you change the ports or number of child processes, you must also change 
// the Nginx upstream server settings to match. 
//


(function() {
  var children, healthCheck, i, numWorkers, port, startPort, _i, _ref;
  var childMonitor = require('./child_monitor')
  var http = require('http');
  // TODO: need to remove this and use the lib/config/config.js file instead
  var nconf = require('nconf');
  nconf.file({ file: './lib/settings.json' });
  
  console.log("Bootstrap initiated at: " + new Date() + "");
    
  // healthcheck: I've routed /healthcheck to the housekeeping controller.  
  healthCheck = function(port, cb) {
    // TODO: move these values to the config file
    var options = {
      host: 'localhost',
      port: port,
      path: '/healthcheck',
      method: 'GET'
    };

    var c = http.get(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(data) {
        var d = null;
        try {
          d = JSON.parse(data);
          console.log("Health check response", d );
          return cb(true);
        } catch (error) {
          res.end();
          console.error("Health check failed: bad initial response. " + data);
          return cb(false);
        }
      });
      res.on('error', function(e) {
        console.error("Health check failed: error connecting " + e);
        return cb(false);
      });
      // TODO: need to put this timeout value in the config file
      return c.setTimeout(60000, function() {
        return c.destroy();
      });
    });
  }

  // TODO: move these values to the config file

  // child processes to start
  numWorkers = 1;

  // starting port number 
  startPort = 61300;  
  
  // list of children. I had big plans for this, but I forget what they were. 
  children = [];

  // starts the children, and populates the list of children I forget what I was 
  // going to do with
  for (i = _i = 0, _ref = numWorkers - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    port = startPort + i;
    children.push(childMonitor.spawnMonitoredChild('./lib/server.js', port, healthCheck, {}));
  }
  
}).call(this);