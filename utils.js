const config = require("./config")
const sqlite3 = require("sqlite3")
const fs = require("fs")
const express = require("express")
const path = require("path")

module.exports.init = function() {
  if (!fs.existsSync(path.join(__dirname, config.db_path))) {
    fs.readFile(path.join(__dirname, config.schema_path), "utf-8", function(err, schema) {
      console.log("db not found - creating one")
      if (err) throw err;
      const db = new sqlite3.Database(path.join(__dirname, config.db_path))
      db.exec(schema).close()
    })
  }
}

module.exports.getDB = function() {
  return new sqlite3.Database(path.join(__dirname, config.db_path))
}

module.exports.getRtr = function() {
  return express.Router()
}
