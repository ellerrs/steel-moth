var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , _ = require('underscore')
  , errorHelpers = require('../../../config/middlewares/errors')


// create user
exports.create = function (req, res) {
  var user = new User(req.body)
  //user.actions = { 'info': 'User Created', 'createdAt': new Date };
  user.save(function (err) {
    return errorHelpers.userResponse (user, 'add User', err, req, res);  
  })
}

// modify a user
exports.update = function (req, res) {
  var user = req.profile;
  user = _.extend(user, req.body);
  user.save( function( err, doc) {
    return errorHelpers.userResponse (user, 'update User', err, req, res);
  });
}

exports.show = function (req, res) {
  var user = req.profile
  return res.jsonp(
    {
      data: user
      , 'statusCode': res.statusCode
      , errorState: false
    }
  )
}

exports.showAll = function (req, res) {
  User.find(function (err, users) {
    return errorHelpers.userResponse (users, 'find Users', err, req, res);
  });
}

exports.destroy = function (req, res) {
  var user = req.profile;
  user.remove(function (err) {
    return errorHelpers.userResponse (null, 'delete User', err, req, res);
  });
}

exports.search = function (req, res) {
  var key = req.body.key;
  var value = req.body.val;
  console.log(key);
  User.find(req.body, function (err, users) {
    return errorHelpers.userResponse (users, 'search for Users', err, req, res);
  });
}

exports.followUser = function (req, res) {
  var followingUser = req.profile;
  following.user.push(req.body);
  followingUser.save( function( err, doc) {
    return errorHelpers.userResponse (followingUser, 'follow User', err, req, res);
  });
  // TODO: need to add the reference to the followed user. 
  var followedUser = req.params.followedUserId;
}

exports.showPrivacySettings = function (req, res) {
  var user = req.profile
  return res.jsonp(
    {
      data: user.privacySettings
      , 'statusCode': res.statusCode
      , errorState: false
      , info: ''
    }
  )
}

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

exports.showFacebookLikes = function (req, res) {
  var user = req.profile
  return res.jsonp(
    {
      data: user.facebook.likes
      , 'statusCode': res.statusCode
      , errorState: false
      , info: ''
    }
  )
}

exports.showAccountSettings = function (req, res) {
  var user = req.profile
  return res.jsonp(
    {
      data: user.accountSettings
      , 'statusCode': res.statusCode
      , errorState: false
      , info: ''
    }
  )
}


exports.addPrivacySetting = function (req, res) {
  var newId = mongoose.Types.ObjectId.createPk();
  var user = req.profile;
  dateToAppend = {'createdAt': new Date, '_id': newId }
  newSetting = _.extend(req.body, dateToAppend);
  user.privacySettings.push(newSetting);
  user.save( function( err, doc) {
    return errorHelpers.userResponse (newSetting, 'add User Privacy Setting', err, req, res);
  })
}

exports.destroyPrivacySetting = function (req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId } ,
    { $pull: { privacySettings: { _id: req.params.privacySettingId }}},
    function (err) {
      return errorHelpers.userResponse (null, 'delete User Privacy Setting', err, req, res);
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
  })
}

exports.destroyFacebookLike = function (req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId } ,
    { $pull: { "facebook.likes": { _id: req.params.facebookLikeId }}},
    function (err) {
      return errorHelpers.userResponse (null, 'delete User Facebook Like', err, req, res);
  });
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

exports.addAccountSettings = function (req, res) {
  var user = req.profile;
  user.accountSettings = _.extend(user.accountSettings, req.body);
  user.save( function( err, doc) {
    return errorHelpers.userResponse (user.accountSettings, 'add User Account Setting', err, req, res);
  })
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