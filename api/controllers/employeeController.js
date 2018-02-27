'use strict'

// This entire file holds all controller functions that correlate
// directly with employee related endpoints

var repo = require('./../repos/repo.js')
var helper = require('./../helpers/helper.js')
var moment = require('moment')

// Required RFC2822 date format
var RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss ZZ'

// getEmployeeByID returns specific user data object from database by ID
function getEmployeeByID (req, res, next) {
  var empID = req.swagger.params.emp_id.value
  repo.getByID(empID, 'users')
    .then(result => {
      res.status(200).send(result)
    }).catch(err => {
      res.status(400).send(err.stack)
    })
}

// getAllEmployees returns full list of all user data objects from database
function getAllEmployees (req, res, next) {
  repo.getCollection('users')
    .then(result => {
      res.status(200).send(result)
    }).catch(err => {
      res.status(400).send(err.stack)
    })
}

// createEmployee runs an insert within the database to create a new user object entry
// only managers have access, a valid role is required and contact info is validated
function createEmployee (req, res, next) {
  var userID = req.swagger.params.user_id.value
  var userObject = req.swagger.params.body.value
  console.log(userID)
  console.log(userObject)
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
    res.status(400).send(err.stack)
  })
}

// deleteEmployeeByID removes a user object from the db by specifiying ID
// only managers have access
function deleteEmployeeByID (req, res, next) {
  var empID = req.swagger.params.emp_id.value
  var userID = req.swagger.params.user_id.value

  helper.isManager(userID).then(() => {
    return repo.deleteByID(empID, 'users')
  }).then(result => {
    res.status(200).send({'successMessage': `User ${empID} has been deleted`})
  }).catch(err => {
    res.status(400).send(err.stack)
  })
}

// updateEmployeeByID updates a user object in the db using specified ID and request body data
// only managers have access, and role values are validated
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
    res.status(400).send(err.stack)
  })
}

module.exports = {
  getEmployeeByID,
  deleteEmployeeByID,
  updateEmployeeByID,
  getAllEmployees,
  createEmployee
}
