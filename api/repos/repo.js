'use_strict'
var config = require('../../config/config.js')
var shortid = require('shortid')
var MongoClient = require('mongodb').MongoClient

const URL = config.url
const DBNAME = config.dbName

// connectToDB makes a connection the the MongoDB instance specified in the config/config.js file
function connectToDB () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(URL + DBNAME, (err, db) => {
      if (err) reject(err)
      resolve(db.db(DBNAME))
    })
  })
}

// getCollection connects to mongo and returns all data within a collection of the db
function getCollection (collection) {
  return new Promise((resolve, reject) => {
    connectToDB().then(dbo => {
      dbo.collection(collection).find({}).toArray((err, res) => {
        if (err) reject(err)
        resolve(res)
      })
    }).catch(err => {
      reject(err)
    })
  })
}

// insertObject connects to mongo and inserts an object within the db collection specified in the parameters
function insertObject (object, collection) {
  return new Promise((resolve, reject) => {
    connectToDB().then(dbo => {
      object._id = shortid.generate()
      dbo.collection(collection).insertOne(object, (err, res) => {
        if (err) reject(err)
        resolve(res)
      })
    }).catch(err => {
      reject(err)
    })
  })
}

// getByID connects to mongo and returns an object within the db collection specified in the parameters
function getByID (id, collection) {
  return new Promise((resolve, reject) => {
    connectToDB().then(dbo => {
      console.log(id)
      dbo.collection(collection).findOne({'_id': id}, (err, res) => {
        if (err) reject(err)
        resolve(res)
      })
    }).catch(err => {
      reject(err)
    })
  })
}

// deleteByID connects to mongo and deletes an object by ID within the db collection specified in the parameters
function deleteByID (id, collection) {
  return new Promise((resolve, reject) => {
    connectToDB().then(dbo => {
      dbo.collection(collection).deleteOne({'_id': id}, (err, res) => {
        if (err) reject(err)
        resolve(res)
      })
    }).catch(err => {
      reject(err)
    })
  })
}

// updateByID connects to mongo and updates an object by ID within the db collection specified in the parameters
function updateByID (id, updateObject, collection) {
  return new Promise((resolve, reject) => {
    connectToDB().then(dbo => {
      var newValues = {$set: updateObject}
      dbo.collection(collection).updateOne({'_id': id}, newValues, (err, res) => {
        if (err) reject(err)
        resolve(res)
      })
    }).catch(err => {
      reject(err)
    })
  })
}

module.exports = {
  insertObject,
  getByID,
  deleteByID,
  getCollection,
  updateByID
}
