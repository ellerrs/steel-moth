var mongoose = require('mongoose')
  , _ = require('underscore')
  , errorHelpers = require('../../../config/middlewares/errors')
  , OperationHelper = require('../../../../node_modules/apac/lib/apac').OperationHelper;


var opHelper = new OperationHelper({
  awsId: 'id',
  awsSecret: 'secret',
  assocId: 'blah'
});

// search for products
exports.search = function (req, res) {
  opHelper.execute('ItemSearch', {
    'SearchIndex': 'All',
    'Keywords': 'ipad 3',
    'ResponseGroup': 'Small,Images,SalesRank,ItemAttributes',
    'Version': '2012-11-21'
  }, function(error, results) {
    return res.jsonp(results) ;
  });
}
