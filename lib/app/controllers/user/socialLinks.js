var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , _ = require('underscore')
  , errorHelpers = require('../../../config/middlewares/errors')



exports.showSocialLinks = function (req, res) {
  var user = req.profile
  return res.jsonp(
    {
      data: user.socialLinks
      , 'statusCode': res.statusCode
      , errorState: false
      , info: ''
    }
  )
}

exports.addSocialLink = function (req, res) {
  var newId = mongoose.Types.ObjectId.createPk();
  var user = req.profile;
  b = req.body;
  d = {'createdAt': new Date, '_id': newId }
  n = _.extend(b, d);
  user.socialLinks.push(n);
  user.save( function( err, doc) {
    return errorHelpers.userResponse (n, 'add User Social Link', err, req, res);
  })
}

exports.destroySocialLink = function (req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId } ,
    { $pull: { socialLinks: { _id: req.params.socialLinkId }}},
    function (err) {
      return errorHelpers.userResponse (null, 'delete User Social Link', err, req, res);
  });
}

exports.updateSocialLink = function (req, res) {
  var user = req.profile;
  a = user.socialLinks.id(req.params.socialLinkId);
  a = _.extend(a, req.body);

  User.update(
    { _id: req.params.userId, "socialLinks": { $elemMatch: {_id: req.params.socialLinkId }} },
    { $set: {
      "socialLinks.$.name": a.name
    , "socialLinks.$.url": a.url
    , "socialLinks.$.updatedAt": new Date
    }}
  ).exec(function (err) {
    return errorHelpers.userResponse (a, 'update User Social Link', err, req, res);
  });
  
}