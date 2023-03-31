// ./routes/index.js
const users = require('./users')
const addresses = require('./addresses')
//const photos = require('./photos')
module.exports = app => {
    app.use('/users', users)
    app.use('/addresses', addresses)
//  app.use('/photos', photos)
  // etc..
}

