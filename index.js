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

app.get('/user/resolve/:str', function(req, res){
  new Promise(function(resolve, reject) {
    var str = req.params.str
    var plainIdRegex = /^(\d+)$/ // just digits
    if (plainIdRegex.test(str)) {
      resolve(plainIdRegex.exec(str)[1])
    } else {
      var discordIdRegex = /^<@!?(\d+)>$/ // <@12345> or <@!12345>
      if (discordIdRegex.test(str)) { // str is a valid discord mention
        resolve(discordIdRegex.exec(str)[1])
      } else { // emoji or invalid
        db.get("select id from players where emoji = ?;", str, function(err, row){
          console.log(err, row)
          if (err) throw err
          if (row) {
            resolve(row.id)
          } else {
            resolve(null)
          }
        })
      }
    }
  }).then(id=>{
    console.log(id)
    var found = !(id === null)
    var result = {"found":found, "id":id}
    res.send(result)
  })
})

/*app.use(function(req, res, next) {
  res.send(JSON.stringify(res.data))
})*/

// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send({"error":true, "stack":err.stack})
})
app.listen(config.port, ()=>console.log(`Listening on 127.0.0.1:${config.port}`))
