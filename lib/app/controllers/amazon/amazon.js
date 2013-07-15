var mongoose = require('mongoose')
  , _ = require('underscore')
  , errorHelpers = require('../../../config/middlewares/errors')
  , OperationHelper = require('../../../../node_modules/apac/lib/apac').OperationHelper;


var opHelper = new OperationHelper({
  awsId: '0P0S1RGTEFQF4PJMJ482',
  awsSecret: 'eTGRmFbU76blrLTDNi/OaDEPenW7hWpYkHeKEV3Y',
  assocId: 'ellerws-20'
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
