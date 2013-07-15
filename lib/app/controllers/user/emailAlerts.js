var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , _ = require('underscore')
  , errorHelpers = require('../../../config/middlewares/errors')


exports.showEmailAlerts = function (req, res) {
  var user = req.profile
  return res.jsonp({
      data: user.emailAlerts
      , 'statusCode': res.statusCode
      , errorState: false
      , info: ''
  });
}

exports.addEmailAlert = function (req, res) {
  var newId = mongoose.Types.ObjectId.createPk();
  var user = req.profile;
  b = req.body;
  d = {'createdAt': new Date, '_id': newId }
  n = _.extend(b, d);
  user.emailAlerts.push(n);
  user.save( function( err, doc) {
    return errorHelpers.userResponse (n, 'add User Email Alert', err, req, res);
  })
}

exports.updateEmailAlert = function (req, res) {
  var user = req.profile;
  a = user.emailAlerts.id(req.params.emailAlertId);
  a = _.extend(a, req.body);

  User.update(
    { _id: req.params.userId, "emailAlerts": { $elemMatch: {_id: req.params.emailAlertId }} },
    { $set: {
      "actions.$.name": a.name
    , "actions.$.status": a.status
    , "actions.$.frequency": a.frequency
    , "actions.$.updatedAt": new Date
    }}
  ).exec(function (err) {
    return errorHelpers.userResponse (a, 'update User Email Alert', err, req, res);
  });
}

exports.destroyEmailAlert = function (req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId } ,
    { $pull: { emailAlerts: { _id: req.params.emailAlertId }}},
    function (err) {
      return errorHelpers.userResponse (null, 'delete User Email Alert', err, req, res);
  });
}