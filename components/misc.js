const utils = require("../utils")
const db = utils.getDB() // database
const rtr = utils.getRtr() // express router

rtr.get('/resolve_to_id/:str', function(req, res){
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
    var found = !(id === null)
    var result = {"found":found, "id":id}
    res.send(result)
  })
})

module.exports = rtr
