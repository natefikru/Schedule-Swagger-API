'use strict'

// This entire file holds all controller functions that correlate
// directly with shift and schedule related endpoints

var repo = require('./../repos/repo.js')
var helper = require('./../helpers/helper.js')
var moment = require('moment')

var RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss ZZ'

// createShift runs an insert within the database to create a new shift object entry
// only managers have access, a default sjoft manager is assigned, and time data is validated
function createShift (req, res, next) {
  var userID = req.swagger.params.user_id.value
  var shiftObject = req.swagger.params.body.value

  helper.isManager(userID).then(() => {
    return helper.checkShiftTimeFormat(shiftObject)
  }).then(() => {
    return helper.assignShiftManager(userID, shiftObject)
  }).then(newShiftObject => {
    newShiftObject.created_at = moment().format(RFC2822)
    return repo.insertObject(newShiftObject, 'shifts')
  }).then(result => {
    res.status(200).send({'successMessage': 'New shift has been created'})
  }).catch(err => {
    res.status(400).send(err.stack)
  })
}

// getAllShifts returns full list of all user data objects from database
function getAllShifts (req, res, next) {
  repo.getCollection('shifts')
    .then(result => {
      res.status(200).send(result)
    }).catch(err => {
      res.status(400).send(err.stack)
    })
}

// getShiftByID returns specific shift data object from database by ID
function getShiftByID (req, res, next) {
  var shiftID = req.swagger.params.shift_id.value
  repo.getByID(shiftID, 'shifts').then(shift => {
    return helper.addShiftInfo(shift)
  }).then(shift => {
    res.status(200).send(shift)
  }).catch(err => {
    res.status(400).send(err.stack)
  })
}

// updateShiftByID updates a shift object in the db using specified ID and request body data
// only managers have access, and time datas are validated
function updateShiftByID (req, res, next) {
  var shiftID = req.swagger.params.shift_id.value
  var userID = req.swagger.params.user_id.value
  var updateObject = req.swagger.params.body.value

  helper.isManager(userID).then(() => {
    return helper.checkShiftTimeFormat(updateObject)
  }).then(() => {
    updateObject.updated_at = moment().format(RFC2822)
    return repo.updateByID(shiftID, updateObject, 'shifts')
  }).then(result => {
    res.status(200).send({'successMessage': `'Shift ${shiftID} has been updated`})
  }).catch(err => {
    res.status(400).send(err.stack)
  })
}

// deleteShiftByID removes a shift object from the db by specifiying ID
// only managers have access
function deleteShiftByID (req, res, next) {
  var shiftID = req.swagger.params.shift_id.value
  var userID = req.swagger.params.user_id.value

  helper.isManager(userID).then(() => {
    return repo.deleteByID(shiftID, 'shifts')
  }).then(result => {
    res.status(200).send({'successMessage': `Shift ${shiftID} has been deleted`})
  }).catch(err => {
    res.status(400).send(err.stack)
  })
}

// getShiftsInPeriod return a list of shifts that start within a time window requested
// time window is specified in the query parameters
// only managers have access, times in query are validated
function getShiftsInPeriod (req, res, next) {
  var userID = req.swagger.params.user_id.value
  var startTime = req.swagger.params.start_time.value
  var endTime = req.swagger.params.end_time.value
  var timeWindow = {'start_time': startTime, 'end_time': endTime}

  helper.isManager(userID).then(() => {
    return helper.checkShiftTimeFormat(timeWindow)
  }).then(() => {
    return repo.getCollection('shifts')
  }).then(allShifts => {
    return helper.getShiftsInTimeWindow(allShifts, timeWindow)
  }).then(shifts => {
    res.status(200).send(shifts)
  }).catch(err => {
    res.status(400).send(err.stack)
  })
}

// getUserShifts returns a list of all shifts assigned to the user as well as any open shifts
function getUserShifts (req, res, next) {
  var userID = req.swagger.params.user_id.value
  repo.getCollection('shifts').then(allShifts => {
    return helper.getUserShifts(allShifts, userID)
  }).then(userShifts => {
    res.status(200).send(userShifts)
  }).catch(err => {
    res.status(400).send(err.stack)
  })
}

// getHours returns the amount of hours worked by the user in the last 7 days
function getHours (req, res, next) {
  var userID = req.swagger.params.user_id.value

  repo.getCollection('shifts').then(allShifts => {
    return helper.getMyShifts(allShifts, userID)
  }).then(userShifts => {
    return helper.calculateHours(userShifts)
  }).then(hours => {
    res.status(200).send(hours)
  }).catch(err => {
    res.status(400).send(err.stack)
  })
}

module.exports = {
  createShift,
  getAllShifts,
  getShiftByID,
  updateShiftByID,
  deleteShiftByID,
  getUserShifts,
  getShiftsInPeriod,
  getHours
}
