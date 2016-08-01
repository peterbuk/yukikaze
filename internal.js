/*
 *  Internal functionality
 *  ----------------------
 */

var schedule = require("node-schedule");
var moment = require("moment");
var jsonfile = require("jsonfile");

module.exports = function(beaver, db, filePath) {

    /*
     Function: Load DB
     Type: Command
     Usage: ~loaddb
     Description: Load the current DB object from file
     */
    function loadDB() {
        db = jsonfile.readFileSync(filePath);
        console.log(getTimestamp() + " Loaded db from " + filePath);
    }


    /*
     Function: Save DB
     Type: Command
     Usage: ~savedb
     Description: Save the current DB object to file
     */
    function saveDB() {
        jsonfile.writeFileSync(filePath, db, {spaces: 2});
    }

    /*
     Function: Automatic Save
     Type: Passive
     Description: Save db to json file every 5 mins
     */
    var dbSaveRule = new schedule.RecurrenceRule();
    dbSaveRule.minute = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 59];
    schedule.scheduleJob(dbSaveRule, saveDB);


    /*
     Function: Playground for testing one time stuff
     Type: ???
     Description: Lol spaghetti code
     */
    function playground(msg) {
        var server = beaver.guilds.find(function(g) {return g.id === "107915021203304448"});
        var log = "";

        var colorRoles = {};
        server.roles.forEach((r) => {
            if (r.name.startsWith('#')) {
                colorRoles[r.id] = r.name;
            }
        })

        server.members.forEach(function(m, key, mapObj) {
            for (var i = 0; i < m.roles.length; i++) {
                if (colorRoles[m.roles[i]] !== undefined) {
                    log += m.user.username + " " + colorRoles[m.roles[i]] + "\n";
                }
            }
        });

        console.log(log);
        legitCommand = true;
    }




    return {
        saveDB: saveDB,
        loadDB: loadDB,
        playground: playground
    }

    // get the current timestamp for logging
    function getTimestamp() {
        return "[" + moment().format() + "]";
    }
};