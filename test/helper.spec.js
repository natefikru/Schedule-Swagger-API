'use-strict'

const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
var expect = chai.expect
const controller = require('../api/controllers/employeeController.js')
const repo = require('../api/repos/repo.js')
const helper = require('../api/helpers/helper.js')

describe('helper', function () {
  describe('isManager(ID)', function () {
    it('manager role succesfully resolved as undefined', function (done) {
      let testID = 'test_id'
      let testReturn = {'role': 'manager'}
      let stub = sinon.stub(repo, 'getByID').returns(Promise.resolve(testReturn))
      helper.isManager(testID).then(value => {
        expect(value).to.be.an('undefined')
        stub.restore()
        done()
      })
    })
    it('employee role succesfully rejected Error', function (done) {
      let testID = 'test_id'
      let testReturn = {'role': 'employee'}
      let stub = sinon.stub(repo, 'getByID').returns(Promise.resolve(testReturn))
      helper.isManager(testID).catch(value => {
        expect(value).to.be.an('error')
        stub.restore()
        done()
      })
    })
    it('incorrect role succesfully rejected Error', function (done) {
      let testID = 'test_id'
      let testReturn = {'role': '1234'}
      let stub = sinon.stub(repo, 'getByID').returns(Promise.resolve(testReturn))
      helper.isManager(testID).catch(value => {
        expect(value).to.be.an('error')
        stub.restore()
        done()
      })
    })
    it('getByID function succesfully rejected Error', function (done) {
      let testID = 'test_id'
      let testReturn = new Error('error')
      let stub = sinon.stub(repo, 'getByID').returns(Promise.reject(testReturn))
      helper.isManager(testID).catch(value => {
        expect(value).to.be.an('error')
        stub.restore()
        done()
      })
    })
  })

  describe('checkContactInfo(userObject)', function () {
    it('has 1 valid contact value', function (done) {
      let testUserObject = {'phone': '123456789'}
      helper.checkContactInfo(testUserObject).then(value => {
        expect(value).to.be.an('undefined')
        done()
      })
    })
    it('has no valid contact values', function (done) {
      let testUserObject = {}
      helper.checkContactInfo(testUserObject).catch(value => {
        expect(value).to.be.an('error')
        done()
      })
    })
  })

  describe('requireRole(userObject)', function () {
    it('has 1 valid role', function (done) {
      let testUserObject = {'role': 'manager'}
      helper.requireRole(testUserObject).then(value => {
        expect(value).to.be.an('undefined')
        done()
      })
    })
    it('has no valid roles', function (done) {
      let testUserObject = {}
      helper.requireRole(testUserObject).catch(value => {
        expect(value).to.be.an('error')
        done()
      })
    })
  })

  describe('checkChangedRole(userObject)', function () {
    it('does not attempt to update the user role', function (done) {
      let testUserObject = {}
      helper.checkChangedRole(testUserObject).then(value => {
        expect(value).to.be.an('undefined')
        done()
      })
    })
    it('attempts to update user role to manager', function (done) {
      let testUserObject = {'role': 'manager'}
      helper.checkChangedRole(testUserObject).then(value => {
        expect(value).to.be.an('undefined')
        done()
      })
    })
    it('attempts to update user role to employee', function (done) {
      let testUserObject = {'role': 'employee'}
      helper.checkChangedRole(testUserObject).then(value => {
        expect(value).to.be.an('undefined')
        done()
      })
    })
    it('attempts to change role to invalid value', function (done) {
      let testUserObject = {'role': 'error'}
      helper.checkChangedRole(testUserObject).catch(value => {
        expect(value).to.be.an('error')
        done()
      })
    })
  })

  describe('checkShiftTimeFormat(timeObject)', function () {
    it('has both start and end RFC2822 time format', function (done) {
      let mockStartTime = 'Sat, 24 Feb 2018 22:49:11 -0600'
      let mockEndTime = 'Sun, 25 Feb 2018 22:49:11 -0600'
      let mockTimeObject = {'start_time': mockStartTime, 'end_time': mockEndTime}
      helper.checkShiftTimeFormat(mockTimeObject).then(value => {
        expect(value).to.be.an('undefined')
        done()
      })
    })
    it('has correct start time RFC2822 time format', function (done) {
      let mockStartTime = 'Sat, 24 Feb 2018 22:49:11 -0600'
      let mockTimeObject = {'start_time': mockStartTime}
      helper.checkShiftTimeFormat(mockTimeObject).then(value => {
        expect(value).to.be.an('undefined')
        done()
      })
    })
    it('has correct end time RFC2822 time format', function (done) {
      let mockEndTime = 'Sat, 24 Feb 2018 22:49:11 -0600'
      let mockTimeObject = {'start_time': mockEndTime}
      helper.checkShiftTimeFormat(mockTimeObject).then(value => {
        expect(value).to.be.an('undefined')
        done()
      })
    })
    it('has incorrect time RFC2822 time format', function (done) {
      let mockEndTime = 'at, 24 Feb 2018 22:49:11 -0600'
      let mockTimeObject = {'start_time': mockEndTime}
      helper.checkShiftTimeFormat(mockTimeObject).catch(value => {
        expect(value).to.be.an('error')
        done()
      })
    })
  })

  describe('assignShiftManager(managerID, shiftObject)', function () {
    it('doesnt changed shift manager_id value', function (done) {
      let mockManagerID = '234'
      let mockShiftObject = {'manager_id': 'testID'}
      helper.assignShiftManager(mockManagerID, mockShiftObject).then(value => {
        expect(value.manager_id).to.equal(mockShiftObject.manager_id)
        done()
      })
    })
    it('assigns shift manager_id to managerID parameter', function (done) {
      let mockManagerID = '234'
      let mockShiftObject = {}
      helper.assignShiftManager(mockManagerID, mockShiftObject).then(value => {
        expect(value.manager_id).to.equal('234')
        done()
      })
    })
  })

  describe('addManagerContact(shift)', function () {
    it('adds manager contact info into shift object', function (done) {
      let mockShift = {'manager_id': '1234'}
      let mockManager = {'email': 'test_email', 'phone': 'test_phone'}
      let stub = sinon.stub(repo, 'getByID').returns(Promise.resolve(mockManager))
      helper.addManagerContact(mockShift).then(value => {
        expect(value.manager_phone).to.be.an('undefined')
        expect(value.manager_email).to.be.equal('test_email')
        stub.restore()
        done()
      })
    })
    it('adds manager contact info into shift object', function (done) {
      let mockShift = {'manager_id': '1234'}
      let mockManager = {'email': 'test_email'}
      let stub = sinon.stub(repo, 'getByID').returns(Promise.resolve(mockManager))
      helper.addManagerContact(mockShift).then(value => {
        expect(value.manager_email).to.equal('test_email')
        expect(value.manager_phone).to.be.an('undefined')
        stub.restore()
        done()
      })
    })
  })
})
