
var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , async = require('async')

module.exports = function (app) {


  // housekeeping routes
  var housekeeping = require('../app/controllers/housekeeping')
  app.get('/', housekeeping.home)
  app.get('/healthcheck', housekeeping.healthcheck)

  var datasift = require('../app/controllers/datasift/datasift')
    
    app.post('/ds/compile', datasift.compile)
    
    app.get('/ds/balance', datasift.checkBalance)
    
    app.get('/ds/usage/:period', datasift.checkUsage)
    
    app.get('/ds/start', datasift.connect)
    app.get('/ds/stop', datasift.disconnect)
    app.get('/ds/subscribe/:hash', datasift.subscribe)
    app.get('/ds/unsubscribe/:hash', datasift.unsubscribe)

  // var amazon = require('../app/controllers/amazon/amazon')
  //   app.get('/aws', amazon.search)
    
  // var lists = require('../app/controllers/list/lists')
  //   app.get('/lists', lists.showList)
  //   app.get('/lists/:listId', lists.showAllLists)
  //   app.post('/lists', lists.createList)
  //   app.put('/lists/:listId', lists.updateList)
  //   app.del('/lists/:listId', lists.destroy)
  //   app.post('/lists/follow', lists.followList)
  //   app.post('/lists/unfollow', lists.unfollowList)

  // var users = require('../app/controllers/user/users')
  //   app.get('/users', users.showAll) //tested
  //   app.get('/users/:userId', users.show) //tested
  //   app.del('/users/:userId', users.destroy)
  //   app.put('/users/:userId', users.update) //tested
  //   app.post('/users', users.create) //tested
  //   app.post('/users/search', users.search)
  //   app.put('/users/:userId/follow', users.followUser)

  // var userActions = require('../app/controllers/user/actions')
  //   app.get('/users/:userId/actions', userActions.showActions)
  //   app.put('/users/:userId/actions/:actionId', userActions.updateAction)
  //   app.post('/users/:userId/actions', userActions.addAction)
  //   app.del('/users/:userId/actions/:actionId', userActions.destroyAction)

  // var userProducts = require('../app/controllers/user/products')
  //   app.get('/users/:userId/products', userActions.showActions)
  //   app.post('/users/:userId/products', userActions.addAction)
  //   app.del('/users/:userId/products/:productId', userActions.destroyAction)

  // var userAccountSettings = require('../app/controllers/user/accountSettings')
  //   app.get('/users/:userId/accountSettings', userAccountSettings.showAccountSettings)
  //   app.post('/users/:userId/accountSettings', userAccountSettings.addAccountSettings)
  //   app.put('/users/:userId/accountSettings', userAccountSettings.addAccountSettings)

  // var userEmailAlerts = require('../app/controllers/user/emailAlerts')
  //   app.get('/users/:userId/emailAlerts', userEmailAlerts.showEmailAlerts)
  //   app.put('/users/:userId/emailAlerts/:emailAlertId', userEmailAlerts.updateEmailAlert)
  //   app.post('/users/:userId/emailAlerts', userEmailAlerts.addEmailAlert)
  //   app.del('/users/:userId/emailAlerts/:emailAlertId', userEmailAlerts.destroyEmailAlert)

  // var userPrivacySettings = require('../app/controllers/user/privacySettings')
  //   app.get('/users/:userId/privacySettings', userPrivacySettings.showPrivacySettings)
  //   app.put('/users/:userId/privacySettings/:privacySettingId', userPrivacySettings.updatePrivacySetting)
  //   app.post('/users/:userId/privacySettings', userPrivacySettings.addPrivacySetting)
  //   app.del('/users/:userId/privacySettings/:privacySettingId', userPrivacySettings.destroyPrivacySetting)

  // var userSocialLinks = require('../app/controllers/user/socialLinks')
  //   app.get('/users/:userId/socialLinks', userSocialLinks.showSocialLinks)
  //   app.put('/users/:userId/socialLinks/:socialLinkId', userSocialLinks.updateSocialLink)
  //   app.post('/users/:userId/socialLinks', userSocialLinks.addSocialLink)
  //   app.del('/users/:userId/socialLinks/:socialLinkId', userSocialLinks.destroySocialLink)

  // var userFacebookLikes = require('../app/controllers/user/facebookLikes')
  //   app.get('/users/:userId/facebookLikes', userFacebookLikes.showFacebookLikes)
  //   app.post('/users/:userId/facebookLikes', userFacebookLikes.addFacebookLike)
  //   app.put('/users/:userId/facebookLikes/:facebookLikeId', userFacebookLikes.updateFacebookLike)
  //   app.del('/users/:userId/facebookLikes/:facebookLikeId', userFacebookLikes.destroyFacebookLike)

  // app.param('userId', function (req, res, next, id) {
  //   User
  //     .findOne({ _id : id })
  //     .exec(function (err, user) {
  //       if (err) return next(err)
  //       if (!user) return next(new Error('User ' + id + ' not found'))
  //       req.profile = user
  //       next()
  //     })
  // })

  // app.param('listId', function (req, res, next, id) {
  //   List
  //     .findOne({ _id : id })
  //     .exec(function (err, list) {
  //       if (err) return next(err)
  //       if (!list) return next(new Error('List ' + id + ' not found'))
  //       req.profile = list
  //       next()
  //     })
  // })

}