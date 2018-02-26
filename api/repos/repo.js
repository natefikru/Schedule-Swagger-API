'use_strict'
var config = require('../../config/config.js')
var shortid = require('shortid')
var MongoClient = require('mongodb').MongoClient

const URL = config.url
const DBNAME = config.dbName

function connectToDB () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(URL + DBNAME, (err, db) => {
      if (err) reject(err)
      resolve(db.db(DBNAME))
    })
  })
}

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
