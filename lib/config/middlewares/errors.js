exports.userResponse = function (returnedData, returnedInfo, err, req, res) {
  if (err) {
    return res.jsonp({ 
        data: returnedData 
      , 'statusCode': res.statusCode
      , errorState: true
      , info: 'Failed: ' + returnedInfo
      , errorDetail: {
          errorType: 'Notification'
        , errorName: err.name
        , errorText: err.message
        , errorRequestedUrl: req.originalUrl
        , errorMethod: req.method
        //, errorExtendedText: err.stack 
        }
      });
  }
  else {
    return  res.jsonp({
      data: returnedData
      , 'statusCode': res.statusCode
      , errorState: false
      , info: 'Succeded: ' + returnedInfo
    });
  }
}

exports.defaultResponse = function (returnedData, returnedInfo, err, req, res) {
  if (err) {
    return res.jsonp({ 
        data: returnedData 
      , 'statusCode': res.statusCode
      , errorState: true
      , info: 'Failed: ' + returnedInfo
      , errorDetail: {
          errorType: 'Notification'
        , errorName: err.name
        , errorText: err.message
        , errorRequestedUrl: req.originalUrl
        , errorMethod: req.method
        //, errorExtendedText: err.stack 
        }
      });
  }
  else {
    return  res.jsonp({
      data: returnedData
      , 'statusCode': res.statusCode
      , errorState: false
      , info: 'Succeded: ' + returnedInfo
    });
  }
}
