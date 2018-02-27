'use strict'
var SwaggerExpress = require('swagger-express-mw')
var express = require('express')
var app = express()
var path = require('path')

var swaggerConfig = {
  appRoot: __dirname // required config
}

// creates static path in public folder for documentation retrieval
app.use(express.static(path.join(__dirname, 'public')))

// inititates swagger framework for the app
SwaggerExpress.create(swaggerConfig, function (err, swaggerExpress) {
  if (err) { throw err }

  // install middleware
  swaggerExpress.register(app)

  // assigns port to listen to
  var port = process.env.PORT || 10010
  app.listen(port)
})

module.exports = app
