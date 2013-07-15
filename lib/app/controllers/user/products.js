var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , _ = require('underscore')
  , errorHelpers = require('../../../config/middlewares/errors')


exports.showUserProducts = function (req, res) {
  var user = req.profile
  return res.jsonp({
      data: user.products
      , 'statusCode': res.statusCode
      , errorState: false
      , info: ''
    });
}

exports.addUserProducts = function (req, res) {
  var newId = mongoose.Types.ObjectId.createPk();
  var product = req.profile;
  dateToAppend = {'createdAt': new Date, '_id': newId }
  newProduct = _.extend(req.body, dateToAppend);
  user.products.push(newSetting);
  user.save( function( err, doc) {
    return errorHelpers.userResponse (newSetting, 'add User/Product want or own', err, req, res);
  });
}

exports.destroyUserProduct = function (req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId } ,
    { $pull: { products: { _id: req.params.productId }}},
    function (err) {
      return errorHelpers.userResponse (null, 'delete User/Product want or own', err, req, res);
  });
}