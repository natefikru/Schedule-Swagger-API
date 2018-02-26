'use strict'

var repo = require('./../repos/repo.js')
var moment = require('moment')
var async = require('async')

function isManager (id) {
  return new Promise((resolve, reject) => {
    repo.getByID(id, 'users').then(result => {
      if (result.role === 'manager') {
        resolve()
      } else if (result.role === 'employee') {
        reject(new Error('Current user does not posses correct role for access'))
      } else {
        reject(new Error('Current user role is corrupted'))
      }
    }).catch(err => {
      reject(err)
    })
  })
}

function checkContactInfo (userObject) {
  return new Promise((resolve, reject) => {
    if ((typeof userObject.phone === 'undefined') && (typeof userObject.email === 'undefined')) {
      reject(new Error('New user must contain email and/or phone information'))
    } else {
      resolve()
    }
  })
}

function requireRole (userObject) {
  return new Promise((resolve, reject) => {
    if ((userObject.role === 'employee') || (userObject.role === 'manager')) {
      resolve()
    } else {
      reject(new Error('object must include manager or employee as role'))
    }
  })
}

function checkChangedRole (userObject) {
  return new Promise((resolve, reject) => {
    if (typeof userObject.role === 'undefined') {
      resolve()
    } else if ((userObject.role === 'employee') || (userObject.role === 'manager')) {
      resolve()
    } else {
      reject(new Error('object must include manager or employee as role'))
    }
  })
}

function checkShiftTimeFormat (timeObject) {
  return new Promise((resolve, reject) => {
    var RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss ZZ'
    var startTime
    var endTime
    if (typeof timeObject.start_time === 'undefined') {
      startTime = 'Sat, 24 Feb 2018 22:49:11 -0600'
    } else {
      startTime = timeObject.start_time
    }
    if (typeof timeObject.end_time === 'undefined') {
      endTime = 'Sat, 24 Feb 2018 22:49:11 -0600'
    } else {
      endTime = timeObject.end_time
    }

    var correctStartFormat = moment(startTime, RFC2822).format(RFC2822) === startTime
    var correctEndFormat = moment(endTime, RFC2822).format(RFC2822) === endTime

    if (correctStartFormat && correctEndFormat) {
      resolve()
    } else {
      reject(new Error('Start or End time are not in correct RFC2822 date formats'))
    }
  })
}

function assignShiftManager (managerID, shiftObject) {
  return new Promise((resolve, reject) => {
    if (typeof shiftObject.manager_id === 'undefined') {
      shiftObject.manager_id = managerID
      resolve(shiftObject)
    } else {
      resolve(shiftObject)
    }
  })
}

function getUserShifts (shifts, userID) {
  return new Promise((resolve, reject) => {
    var shiftList = []
    async.each(shifts, (shift, callback) => {
      if ((shift.employee_id === userID) || (typeof shift.employee_id === 'undefined')) {
        shiftList.push(shift)
        callback()
      } else {
        callback()
      }
    },
    (err) => {
      if (err) {
        reject(err)
      }
      resolve(shiftList)
    })
  })
}

function getShiftsInTimeWindow (shifts, timeWindow) {
  return new Promise((resolve, reject) => {
    var windowStart = moment(timeWindow.start_time).unix()
    var windowEnd = moment(timeWindow.end_time).unix()
    var shiftList = []
    async.each(shifts, (shift, callback) => {
      var shiftStart = moment(shift.start_time).unix()
      var shiftEnd = moment(shift.end_time).unix()
      if ((shiftStart >= windowStart) && (shiftEnd <= windowEnd)) {
        shiftList.push(shift)
        callback()
      } else {
        callback()
      }
    },
    (err) => {
      if (err) {
        reject(err)
      }
      resolve(shiftList)
    })
  })
}

function addCoworkers (userShift) {
  return new Promise((resolve, reject) => {
    userShift.employeesWorking = []
    var userShiftStart = moment(userShift.start_time).unix()
    var userShiftEnd = moment(userShift.end_time).unix()
    repo.getCollection('shifts').then(allShifts => {
      async.each(allShifts, (shift, callback) => {
        var shiftStart = moment(shift.start_time).unix()
        if ((shiftStart >= userShiftStart) && (shiftStart <= userShiftEnd)) {
          if (typeof shift.employee_id !== 'undefined') {
            userShift.employeesWorking.push(shift.employee_id)
            callback()
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      (err) => {
        if (err) {
          reject(err)
        }
        resolve(userShift)
      })
    })
  })
}

function addShiftInfo (shift) {
  return new Promise((resolve, reject) => {
    addManagerContact(shift)
      .then(shift => {
        return addCoworkers(shift)
      }).then(shift => {
        resolve(shift)
      }).catch(err => {
        reject(err)
      })
  })
}

function addManagerContact (shift) {
  return new Promise((resolve, reject) => {
    repo.getByID(shift.manager_id, 'users').then(managerObject => {
      if (typeof managerObject.email !== 'undefined') {
        shift['manager_email'] = managerObject.email
        resolve(shift)
      } else if (typeof managerObject.phone !== 'undefined') {
        shift['manager_phone'] = managerObject.phone
        resolve(shift)
      } else {
        resolve(shift)
      }
    })
  })
}

function getMyShifts (shifts, userID) {
  return new Promise((resolve, reject) => {
    var shiftList = []
    async.each(shifts, (shift, callback) => {
      if ((shift.employee_id === userID)) {
        shiftList.push(shift)
        callback()
      } else {
        callback()
      }
    },
    (err) => {
      if (err) {
        reject(err)
      }
      resolve(shiftList)
    })
  })
}

function calculateHours (userShifts) {
  return new Promise((resolve, reject) => {
    var totalHours = 0
    var timeNow = moment().unix()
    var time1WeekAgo = timeNow - 604800
    async.each(userShifts, (shift, callback) => {
      var shiftStart = moment(shift.start_time).unix()
      var shiftEnd = moment(shift.end_time).unix()
      if ((shiftStart >= time1WeekAgo) && (shiftStart <= timeNow)) {
        if (shiftEnd >= timeNow) {
          totalHours += ((timeNow - shiftStart) / 3600)
          callback()
        } else {
          totalHours += ((shiftEnd - shiftStart) / 3600)
          callback()
        }
      } else {
        callback()
      }
    },
    (err) => {
      if (err) {
        reject(err)
      }
      resolve({'hoursWorkedInLast7Days': totalHours})
    })
  })
}

module.exports = {
  isManager,
  requireRole,
  checkChangedRole,
  checkContactInfo,
  checkShiftTimeFormat,
  assignShiftManager,
  getUserShifts,
  getShiftsInTimeWindow,
  addShiftInfo,
  getMyShifts,
  calculateHours,
  addManagerContact
}
