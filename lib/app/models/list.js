// list schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , _ = require('underscore')

var ListSchema = new Schema({
    owner: {type: Schema.ObjectId, ref : 'User'}
  , name: String
  , status: { type: String, enum: ['default', 'custom'] }
  , privacy: { type: String, enum: ['public', 'private', 'linkonly'] }
  , type: { type: String, enum: ['want','own'] } 
  , followers: [{ type: Schema.Types.ObjectId, ref: 'User' }] 
  , products: [{ type: Schema.Types.ObjectId, ref: 'Product' }] 
  , bannerUrl: { type: String }
  , createdAt: { type: Date }
  , updatedAt: { type: Date }
})

// pre save hooks
ListSchema.pre('save', function(next) {
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

mongoose.model('List', ListSchema)
