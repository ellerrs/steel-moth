var mongoose = require('mongoose')
  , List = mongoose.model('List')
  , User = mongoose.model('User')
  , _ = require('underscore')
  , errorHelpers = require('../../../config/middlewares/errors')

// create list
exports.createList = function (req, res) {
  var list = new List(req.body)
  list.save( function (err) {
    return errorHelpers.defaultResponse (list, 'add List', err, req, res); 
  })
}

// modify a list
exports.updateList = function (req, res) {
  var list = req.profile;
  list = _.extend(list, req.body);
  list.save( function( err, doc) {
    return errorHelpers.defaultResponse (list, 'update List', err, req, res);
  });
}

exports.showList = function (req, res) {
  var list = req.profile
  return res.jsonp(
    {
      data: list
      , 'statusCode': res.statusCode
      , errorState: false
    }
  )
}

exports.showAllLists = function (req, res) {
  List.find(function (err, lists) {
    return errorHelpers.defaultResponse (lists, 'find Lists', err, req, res);
  });
}

exports.destroy = function (req, res) {
  var list = req.profile;
  list.remove(function (err) {
    return errorHelpers.defaultResponse (null, 'delete List', err, req, res);
  });
}

exports.followList = function (req, res) {
  list = List.findById(req.body.listId);
  user = User.findById(req.body.userId);

  user.following.lists.push(list);
  list.followers.push(user);
  list.save();
  user.save( function( err, doc) {
    return errorHelpers.defaultResponse (null, 'user following lists', err, req, res);
  })
}

exports.unfollowList = function (req, res) {
  list = List.findById(req.body.listId);
  user = User.findById(req.body.userId);

  user.following.lists.remove(list._id);
  user.save();
  list.followers.remove(user._id);
  list.save();
}