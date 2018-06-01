// local files
const config = require("./config")


// core modules
const fs = require("fs")
const path = require("path")

// express
const express = require("express")
const app = express()

// sqlite
const sqlite3 = require("sqlite3")
if (!fs.existsSync(path.join(__dirname, config.db_path))) {
  fs.readFile(path.join(__dirname, config.schema_path), "utf-8", function(err, schema) {
    console.log("db not found - creating one")
    if (err) throw err;
    const db = new sqlite3.Database(path.join(__dirname, config.db_path))
    db.exec(schema)
  })
}
const db = new sqlite3.Database(path.join(__dirname, config.db_path))
