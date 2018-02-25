'use strict'

var repo = require('./../repos/repo.js')
var helper = require('./../helpers/helper.js')
var moment = require('moment')

var RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss ZZ'

function getEmployeeByID (req, res, next) {
  var empID = req.swagger.params.emp_id.value
  repo.getByID(empID, 'users')
    .then(result => {
      res.status(200).send(result)
    }).catch(err => {
      res.status(400).send(err)
    })
}

function getAllEmployees (req, res, next) {
  repo.getCollection('users')
    .then(result => {
      res.status(200).send(result)
    }).catch(err => {
      res.status(400).send(err)
    })
}

function createEmployee (req, res, next) {
  var userID = req.swagger.params.user_id.value
  var userObject = req.swagger.params.body.value

  helper.isManager(userID).then(() => {
    return helper.requireRole(userObject)
  }).then(() => {
    userObject.created_at = moment().format(RFC2822)
    return helper.checkContactInfo(userObject)
  }).then(() => {
    return repo.insertObject(userObject, 'users')
  }).then(result => {
    res.status(200).send({'successMessage': 'New user has been created'})
  }).catch(err => {
    res.status(400).send(err)
  })
}

function deleteEmployeeByID (req, res, next) {
  var empID = req.swagger.params.emp_id.value
  var userID = req.swagger.params.user_id.value

  helper.isManager(userID).then(() => {
    return repo.deleteByID(empID, 'users')
  }).then(result => {
    res.status(200).send({'successMessage': `User ${empID} has been deleted`})
  }).catch(err => {
    res.status(400).send(err)
  })
}

function updateEmployeeByID (req, res, next) {
  var empID = req.swagger.params.emp_id.value
  var userID = req.swagger.params.user_id.value
  var updateObject = req.swagger.params.body.value

  helper.isManager(userID).then(() => {
    return helper.checkChangedRole(updateObject)
  }).then(() => {
    updateObject.updated_at = moment().format(RFC2822)
    return repo.updateByID(empID, updateObject, 'users')
  }).then(result => {
    res.status(200).send({'successMessage': `User ${empID} has been updated`})
  }).catch(err => {
    res.status(400).send(err)
  })
}

module.exports = {
  getEmployeeByID,
  deleteEmployeeByID,
  updateEmployeeByID,
  getAllEmployees,
  createEmployee
}
