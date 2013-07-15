var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , _ = require('underscore')
  , errorHelpers = require('../../../config/middlewares/errors')


exports.showPrivacySettings = function (req, res) {
  var user = req.profile
  return res.jsonp({
      data: user.privacySettings
      , 'statusCode': res.statusCode
      , errorState: false
      , info: ''
    });
}

exports.addPrivacySetting = function (req, res) {
  var newId = mongoose.Types.ObjectId.createPk();
  var user = req.profile;
  dateToAppend = {'createdAt': new Date, '_id': newId }
  newSetting = _.extend(req.body, dateToAppend);
  user.privacySettings.push(newSetting);
  user.save( function( err, doc) {
    return errorHelpers.userResponse (newSetting, 'add User Privacy Setting', err, req, res);
  });
}

exports.destroyPrivacySetting = function (req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId } ,
    { $pull: { privacySettings: { _id: req.params.privacySettingId }}},
    function (err) {
      return errorHelpers.userResponse (null, 'delete User Privacy Setting', err, req, res);
  });
}

exports.updatePrivacySetting = function (req, res) {
  var user = req.profile;
  a = user.privacySettings.id(req.params.privacySettingId);
  a = _.extend(a, req.body);
  User.update(
    { _id: req.params.userId, "privacySettings": { $elemMatch: {_id: req.params.privacySettingId }} },
    { $set: {
      "privacySettings.$.name": a.name
    , "privacySettings.$.status": a.status
    , "privacySettings.$.updatedAt": new Date
    }}
  ).exec(function (err) {
    return errorHelpers.userResponse (a, 'update User Privacy Setting', err, req, res);
  });
}