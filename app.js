'use strict'
var SwaggerExpress = require('swagger-express-mw')
var express = require('express')
var app = express()
var path = require('path')

var swaggerConfig = {
  appRoot: __dirname // required config
}

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname + '/api/swagger/index.html'))
// })

app.use(express.static(path.join(__dirname, 'public')))

SwaggerExpress.create(swaggerConfig, function (err, swaggerExpress) {
  if (err) { throw err }

  // install middleware
  swaggerExpress.register(app)

  var port = process.env.PORT || 10010
  app.listen(port)
})

module.exports = app
