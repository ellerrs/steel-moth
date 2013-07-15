var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , _ = require('underscore')
  , errorHelpers = require('../../../config/middlewares/errors')


exports.showFacebookLikes = function (req, res) {
  var user = req.profile
  return res.jsonp({
      data: user.facebook.likes
      , 'statusCode': res.statusCode
      , errorState: false
      , info: ''
    });
}

exports.addFacebookLike = function (req, res) {
  var newId = mongoose.Types.ObjectId.createPk();
  var user = req.profile;
  b = req.body;
  d = {'createdAt': new Date, '_id': newId }
  n = _.extend(b, d);
  user.facebook.likes.push(n);
  user.save( function( err, doc) {
    return errorHelpers.userResponse (n, 'add User Facebook Like', err, req, res);
  });
}

exports.destroyFacebookLike = function (req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId } ,
    { $pull: { "facebook.likes": { _id: req.params.facebookLikeId }}},
    function (err) {
      return errorHelpers.userResponse (null, 'delete User Facebook Like', err, req, res);
  });
}

exports.updateFacebookLike = function (req, res) {
  var user = req.profile;
  a = user.facebook.likes.id(req.params.facebookLikeId);
  a = _.extend(a, req.body);
  User.update(
    { _id: req.params.userId, "facebook.likes": { $elemMatch: {_id: req.params.facebookLikeId }} },
    { $set: {
      "facebook.likes.$.name": a.name
    , "facebook.likes.$.category": a.category
    , "facebook.likes.$.fbid": a.fbid
    , "facebook.likes.$.updatedAt": new Date
    }}
  ).exec(function (err) {
    return errorHelpers.userResponse (a, 'update User Facebook Like', err, req, res);
  });
}