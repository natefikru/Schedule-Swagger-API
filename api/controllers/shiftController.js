'use strict'

var repo = require('./../repos/repo.js')
var helper = require('./../helpers/helper.js')
var moment = require('moment')

var RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss ZZ'

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

function getAllShifts (req, res, next) {
  repo.getCollection('shifts')
    .then(result => {
      res.status(200).send(result)
    }).catch(err => {
      res.status(400).send(err.stack)
    })
}

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
