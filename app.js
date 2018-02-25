'use strict'
var SwaggerExpress = require('swagger-express-mw')
var express = require('express')
var app = express()

var swaggerConfig = {
  appRoot: __dirname // required config
}

SwaggerExpress.create(swaggerConfig, function (err, swaggerExpress) {
  if (err) { throw err }

  // install middleware
  swaggerExpress.register(app)

  var port = process.env.PORT || 10010
  app.listen(port)
})

module.exports = app
