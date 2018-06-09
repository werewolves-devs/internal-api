// local files
const config = require("./config")

// core modules
const fs = require("fs")
const path = require("path")

// glob
const glob = require("glob")

// express
const express = require("express")
const app = express()

var matches = glob.sync("components/*.js")
matches.forEach(name=>{
  var nicename = path.basename(name, ".js")
  var thisRtr = require("./"+name)
  console.log(`Mounting /${nicename}`)
  app.use("/"+nicename, thisRtr)
})

// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send({"error":true, "stack":err.stack})
})
app.listen(config.port, ()=>console.log(`Listening on 127.0.0.1:${config.port}`))
