var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , _ = require('underscore')
  , errorHelpers = require('../../../config/middlewares/errors')

exports.showAccountSettings = function (req, res) {
  var user = req.profile
  return res.jsonp({
      data: user.accountSettings
      , 'statusCode': res.statusCode
      , errorState: false
      , info: ''
    })
}

exports.addAccountSettings = function (req, res) {
  var user = req.profile;
  user.accountSettings = _.extend(user.accountSettings, req.body);
  user.save( function( err, doc) {
    return errorHelpers.userResponse (user.accountSettings, 'add User Account Setting', err, req, res);
  })
}