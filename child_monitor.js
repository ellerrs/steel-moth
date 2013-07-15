// child_monitor.js
// Launches the individual child processes and starts the delayed healthcheck 
// routine. This heathcheck does the ping time checks and kills the process if 
// it gets stuck.
// 

(function() {
  var MonitoredChild, async, bounceInterval, bounceWait, delayTimeout, healthCheckInterval;
  _ = require('underscore');
  var childProcess = require('child_process');
  async = require('async');
  var nconf = require('nconf');
  nconf.file({ file: './lib/settings.json' });
  
  console.log("ChildMonitor initiated at: " + new Date() + "");

  delayTimeout = function(ms, func) {
    return setTimeout(func, ms);
  };

  exports.spawnMonitoredChild = function(script, port, healthCheck, environmentVariables) {
    var respawn;
    respawn = function() {
      var child, delayedHealthCheck, healthCheckTimeout;
      child = childProcess.spawn(process.execPath, [script, port], {
        env: _.extend(environmentVariables, process.env)
      });
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
      console.log("Started child, port=" + port + ", pid=" + child.pid);
      healthCheckTimeout = null;
      delayedHealthCheck = function() {
        return healthCheckTimeout = delayTimeout(nconf.get('bootstrap:healthCheckInterval'), function() {
          var start = new Date();
          return healthCheck(port, function(healthy) {
            if (healthy) {
              console.log("" + port + " is healthy - ping time " + (new Date() - start) + "ms");
              return delayedHealthCheck();
            } else {
              console.log("" + port + " did not respond in time - killing it");
              return child.kill();
            }
          });
        });
      };
      child.on('exit', function(code, signal) {
        clearTimeout(healthCheckTimeout);
        console.log("Child exited with code " + code + ", signal " + signal + ", respawning");
        return respawn();
      });
      return delayedHealthCheck();
    };
    return respawn();
  };
}).call(this);