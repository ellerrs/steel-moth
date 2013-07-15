/*
 * INSTRUCTIONS
 *
 * run the site at localhost, port 8010
 *
 * run vows --spec test/api-test-authed.js
 *
 */


var request = require('request'),
    vows = require('vows'),
    assert = require('assert'),
    apiUrl = "http://localhost:61300/",
    mongoose = require('mongoose'),
    cookie = null
var userId = mongoose.Types.ObjectId.createPk();
var apiTest = {
  general: function( method, url, data, cb ){
    //console.log( 'cb?', cb )
    request(
      {
        method: method,
        url: apiUrl+(url||''),
        json: data || {},
        headers: {Cookie: cookie}
      },
      function(req, res){
        cb( res )
      }
    )
  },
  get: function( url, data, cb  ){ apiTest.general( 'GET', url, data, cb    )  },
  post: function( url, data, cb ){ apiTest.general( 'POST', url, data, cb   )  },
  put: function( url, data, cb  ){ apiTest.general( 'PUT', url, data, cb    )  },
  del: function( url, data, cb  ){ apiTest.general( 'DELETE', url, data, cb )  }
}

function assertStatus(code) {
  return function (res, b, c) {
    assert.equal(res.statusCode, code);
  };
}


function assertJSONHead(){
  return function(res, b, c ){
    assert.equal( res.headers['content-type'], 'application/json; charset=utf-8' )
  }
}

function assertValidJSON(){
  return function(res, b ){
    // this can either be a Object or Array
    assert.ok( typeof( res.body ) == 'object' )
    //assert.isObject( res.body)
  }
}

function assertErrorState(errorstate){
  return function(res, b, c){
    assert.equal(res.body.errorState, errorstate)
  }
}

function assertValidEmail(em){
  return function(res,b,c){
    assert.equal(res.body.data.email, em)
  }
}

// TODO include unauthed tests
var suite = vows.describe('API Localhost HTTP Tests')

// Very first test!
.addBatch({
  "The server should be up": {
    topic: function(){
      apiTest.get('', {} ,this.callback )
    },

    '/ should repond something' : function(res, b){
      assert.ok(res.body)
    }
  }
})
.addBatch({
  // create a test object so I can set and compare to the same 'thing'
  'Creating a test User': {
    topic: function(){
      apiTest.post( 
        'users', 
        { 
          email: 'test.user@example.com', 
          '_id':  userId
        }, 
        this.callback
      )
    },
    'should be 200': assertStatus(200),
    'should have JSON header' : assertJSONHead(),
    'body is valid JSON' : assertValidJSON(),
    'error state shoule be false' : assertErrorState(false),
    'return email should be test.user@example.com': assertValidEmail('test.user@example.com')
  },
})
.addBatch({
  'Find the test User': {
    topic: function(){
      apiTest.get( 
        'users/'+userId, {}, this.callback )
    },
    'should be 200': assertStatus(200),
    'should have JSON header' : assertJSONHead(),
    'body is valid JSON' : assertValidJSON(),
    'error state shoule be false' : assertErrorState(false),
    'return email should be test.user@example.com': assertValidEmail('test.user@example.com')
  },
})
.addBatch({
  'Modify the test User': {
    topic: function(){
      apiTest.put( 
        'users/'+userId, 
        { 
          email: 'tested.user@example.com'
        }, 
        this.callback
      )
    },
    'should be 200': assertStatus(200),
    'should have JSON header' : assertJSONHead(),
    'body is valid JSON' : assertValidJSON(),
    'error state shoule be false' : assertErrorState(false),
    'return email should be tested.user@example.com': assertValidEmail('tested.user@example.com')
  },
})
.addBatch({
   'Listing all users': {
     topic: function(){
       apiTest.get('users', {}, this.callback)
     },
     'should be 200': assertStatus(200),
     'should have JSON header' : assertJSONHead(),
     'body is valid JSON' : assertValidJSON(),
     'error state shoule be false' : assertErrorState(false)
  },
})
.addBatch({
  'Delete the test User': {
    topic: function(){
      apiTest.del( 'users/'+userId, {}, this.callback )
    },
    'should be 200': assertStatus(200),
    'should have JSON header' : assertJSONHead(),
    'body is valid JSON' : assertValidJSON(),
    'error state shoule be false' : assertErrorState(false)
  },
})
// .addBatch({
//   'Qrcodes#index': {
//     topic: function(){
//       apiTest.get('admin/qrcodes', {}, this.callback)
//     },
//     'should be 200': assertStatus(200),
//     'should have JSON header' : assertJSONHead(),
//     'body is valid JSON' : assertValidJSON(),

//   },
// })

//suite.run( )
suite.export( module )