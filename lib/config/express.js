
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoStore = require('connect-mongo')(express)
  , flash = require('connect-flash')
  , viewHelpers = require('./middlewares/view')

module.exports = function (app, config) {

  app.set('showStackError', true)
  
  app.use(express.compress({
    filter: function (req, res) {
      console.log(res.getHeader('Content-Type'));
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }))
  app.use(express.static(config.root + '/public'))
  app.use(express.logger('dev'))

  
  app.set('views', config.root + '/app/views')
  app.set('view engine', 'jade')

  app.configure(function () {
  
    app.use(viewHelpers(config))

    app.use(express.cookieParser())

    app.use(express.bodyParser())
    app.use(express.methodOverride())
  
    app.use(express.session({
      secret: 'noobjs',
      store: new mongoStore({
        url: config.db,
        collection : 'sessions'
      })
    }))

    app.use(flash())

    app.use(express.favicon())

    app.use(app.router)

    app.use(function(err, req, res, next){
      if (~err.message.indexOf('not found')) return next()

      console.error(err.stack)

      res.status(500).jsonp(
        {
          statusCode: '500'
        , errorState: true
        , errorDetail: {
            errorType: 'Fatal'
          , errorName: err.name
          , errorText: err.message
          , errorRequestedUrl: req.originalUrl
          , errorMethod: req.method
          , errorExtendedText: err.stack 
          }
        }
      )
    })

    app.use(function(req, res, next){
      res.status(404).jsonp(
        {
          statusCode: '404'
        , errorState: true
        , errorDetail: {
            errorType: 'Fatal'
          , errorName: err.name
          , errorText: err.message
          , errorRequestedUrl: req.originalUrl
          , errorMethod: req.method
          , errorExtendedText: err.stack 
          }
        }
      )
    })

  })
}
