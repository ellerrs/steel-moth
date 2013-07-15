
module.exports = {
  root: require('path').normalize(__dirname + '/..'),
  app: {
    name: 'Nodejs Express Mongoose Demo'
  },
  db: 'mongodb://localhost/steelMoth',
  datasift: {
    username: "ellerrs",
    password: "de6365efe3dbb526017eb46a7292d1da"
  },
  facebook: {
      clientID: "APP_ID"
    , clientSecret: "APP_SECRET"
    , callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  twitter: {
      clientID: "CONSUMER_KEY"
    , clientSecret: "CONSUMER_SECRET"
    , callbackURL: "http://localhost:3000/auth/twitter/callback"
  },
  github: {
      clientID: 'f942ee86125c551c1de1'
    , clientSecret: '84253af6434826183533f6ee20896705d0a86966'
    , callbackURL: 'http://localhost:8080/auth/github/callback'
  },
  google: {
      clientID: "APP_ID"
    , clientSecret: "APP_SECRET"
    , callbackURL: "http://localhost:3000/auth/google/callback"
  }
}
