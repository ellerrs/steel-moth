// user schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , _ = require('underscore')

var UserSchema = new Schema({
    firstName: String
  , lastName: String
  , description: String
  , url: String
  , email: String
  , username: String
  , profilePictureUrl: String
  , referedBy: {type: Schema.ObjectId, ref : 'User'}
  , condition: String
  , lists: [{type: Schema.ObjectId, ref : 'List'}]
  , createdAt: { type: Date }
  , updatedAt: { type: Date }
  , products: [{
      productId: { type: Schema.ObjectId, ref : 'Product'}
    , type: String // Want or Own
    , createdAt: { type: Date }
    , updatedAt: { type: Date }
    //, listId: {type: String, default: null }
  }] 
  , following: {
        lists: [{type: Schema.ObjectId, ref : 'List'}]
      , users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    }
  , followers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  , actions: [{ 
        info: String
      , itemId: {type: String, default: null }
      , hidden: { type: Boolean, default: false }
      , createdAt: { type: Date }
      , updatedAt: { type: Date }
    }]
  , facebook: {
        fbid: String
      , location: String
      , birthday: String
      , timeZone: String
      , gender: String
      , verified: String
      , currency: String
      , likes: [{
          name: { type: String, default: null}
        , category: { type: String, default: null}
        , fbid: { type: String, default: null}
        , createdAt: { type: Date }
        , updatedAt: { type: Date }
        }]
    }
  , accountSettings: {
        facebookOpenGraph: { type: Boolean }
      , listOptionsMenu: { type: Boolean } 
    }
  , privacySettings: [{
          name: { type: String, default: null}
        , status: { type: Boolean, default: false } 
        , createdAt: { type: Date }
        , updatedAt: { type: Date }
    }]
  , emailAlerts: [{
          name: { type: String, default: null}
        , status: { type: Boolean, default: false } 
        , frequency: {type: String, default: 'daily' }
        , createdAt: { type: Date }
        , updatedAt: { type: Date }
    }]
  , socialLinks: [{ 
        name: { type: String, default: null}
      , url: { type: String, default: null}
      , createdAt: { type: Date }
      , updatedAt: { type: Date }
    }]
})

// validations
var validatePresenceOf = function (value) {
  return value && value.length
}

UserSchema.path('firstName').validate(function (name) {
  return name.length
}, 'Name cannot be blank')

UserSchema.path('lastName').validate(function (name) {
  return name.length
}, 'Name cannot be blank')

UserSchema.path('email').validate(function (email) {
  return email.length
}, 'Email cannot be blank')

UserSchema.path('username').validate(function (username) {
  return username.length
}, 'Username cannot be blank')

// pre save hooks
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date;
  if ( !this.createdAt ) {
    this.createdAt = new Date;
  }
  if ( !this.createdAt ) {
    this.createdAt = new Date;
  }
  //if (!this.isNew) return next()
  next()
})

mongoose.model('User', UserSchema)
