var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , _ = require('underscore')
  , errorHelpers = require('../../../config/middlewares/errors')


exports.showActions = function (req, res) {
  var user = req.profile
  return res.jsonp({
      data: user.actions
      , 'statusCode': res.statusCode
      , errorState: false
      , info: ''
  });
}

exports.addAction = function (req, res) {
  var newId = mongoose.Types.ObjectId.createPk();
  var user = req.profile;
  dateToAppend = {'createdAt': new Date, '_id': newId }
  newAction = _.extend(req.body, dateToAppend);
  user.actions.push(newAction);
  user.save( function( err, doc) {
    return errorHelpers.userResponse (newAction, 'add User Action', err, req, res);
  });
}

exports.updateAction = function (req, res) {
  var user = req.profile;
  a = user.actions.id(req.params.actionId);
  a = _.extend(a, req.body);
  User.update(
    { _id: req.params.userId, "actions": { $elemMatch: {_id: req.params.actionId }} },
    { $set: {
      "actions.$.info": a.info
    , "actions.$.itemId": a.itemId
    , "actions.$.hidden": a.hidden
    , "actions.$.updatedAt": new Date
    }}
  ).exec(function (err) {
    return errorHelpers.userResponse (a, 'update User Action', err, req, res);
  });
}

exports.destroyAction = function (req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId } ,
    { $pull: { actions: { _id: req.params.actionId }}},
    function (err) {
      return errorHelpers.userResponse (null, 'delete User Action', err, req, res);
  });
}