var express 	= require('express')
  , fs 			= require('fs')
  , env 		= process.env.NODE_ENV || 'development'
  , config 		= require('./config/config')
  , mongoose 	= require('mongoose')
  , mysql 		= require('mysql');

// Bootstrap db connection
mongoose.connect(config.db)

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
})

var app = express()
// express settings
require('./config/express')(app, config)

// Bootstrap routes
require('./config/routes')(app)

// Start the app by listening on <port>
var port = process.argv[2] || 8080
app.listen(port, function() {})
console.log('Express app started on port '+port)
