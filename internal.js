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
        beaver.createMessage(msg.channel.id, "`db saved`");
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
        /*
        var server = beaver.guilds.find(function(g) {return g.id === "107915021203304448"});
        var log = "";
        server.channels.forEach((c) => {
            if (c.type === "text")
                log += c.name + ": " + c.position +"\n";
        });
         console.log(log);
        */

        var server = beaver.guilds.find(function(g) {return g.id === "180542031616147456"});
        var log = "ORDER:\n";
        server.channels.forEach((c) => {
            if (c.type == "0")
                log += c.name + ": " + c.position +"\n";
        });

        beaver.createMessage(msg.channel.id, log);
        console.log(log);
    }


    function order(msg) {
        var server = beaver.guilds.find(function(g) {return g.id == db.etc.rAnimeServerID});
        var log = "CHANNEL ORDER:\n";
        server.channels.forEach((c) => {
            if (c.type == "0")
                log += c.name + ": " + c.position +"\n";
        });

        console.log(log);
        beaver.createMessage(msg.channel.id, log);
    }

    function channelOrder(msg) {
        var channelOrder = {
            "180542031616147456": 0,
            "182969967463890945": 1,
            "215548516649402368": 2,
            "215548527885942784": 3,
            "215548538489274378": 4,
            "215548548618518529": 5
        };

        var server = beaver.guilds.find(function(g) {return g.id === "180542031616147456"});
        server.channels.forEach((c) => {
            if (c.type == "0") {
                if (c.position != channelOrder[c.id]) {
                    console.log("moving " + c.name + " from " + c.position + " to " + channelOrder[c.id] + "\n");
                    beaver.editChannelPosition("180542031616147456", c.id, channelOrder[c.id]);
                }
             }
        });
    }


    return {
        saveDB: saveDB,
        loadDB: loadDB,
        order: order,
        playground: playground
    }

    // get the current timestamp for logging
    function getTimestamp() {
        return "[" + moment().format() + "]";
    }
};