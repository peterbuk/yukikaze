/*
 *  Kancolle functionality
 *  ----------------------
 *  PVP Daily Timer
 *  KC Wikia Search
 */

var schedule = require("node-schedule");
var moment = require("moment");

module.exports = function(beaver, db) {

    /*
        Function: PVP Daily Timer
        Type: Passive
        Description: Sends a message one hour before each PVP set expires.
     */
    function pvpTimer() {
        var pvpA = new schedule.RecurrenceRule();
        var pvpB = new schedule.RecurrenceRule();
        pvpA.hour = 13; // JST 03:00 (alert at 02:00)
        pvpB.hour = 1;  // JST 15:00 (alert at 14:00)
        pvpA.minute = 0;
        pvpB.minute = 0;

        var pvpSetA = schedule.scheduleJob(pvpA, function() {
            var msg = ":crossed_swords: **PVP ALERT** :crossed_swords:\nSET A RESETS IN ONE HOUR";
            beaver.createMessage(db.pvpAlert.channel, msg);
            pvpAlert('A');
            console.log("[" + moment().format() + "]" + "pvp alert sent")
        });

        var pvpSetB = schedule.scheduleJob(pvpB, function() {
            var msg = ":crossed_swords: **PVP ALERT** :crossed_swords:\nSET B RESETS IN ONE HOUR";
            beaver.createMessage(db.pvpAlert.channel, msg);
            pvpAlert('B');
            console.log("[" + moment().format() + "]" + "pvp alert sent")
        });
    }
    pvpTimer(); // start
    
    
    // alert for pvp to all registered members
    function pvpAlert(set) {

        var membersToAlert;
        if (set == 'A') {
            membersToAlert = db.pvpAlert.setA;
        }
        else if (set == 'B') {
            membersToAlert = db.pvpAlert.setB; 
        }
        console.log(membersToAlert)
        var msg = "DO YOUR PVP: ";
        for (var i = 0; i < membersToAlert.length; i++) {
            msg += "<@" + membersToAlert[i] + "> ";
        }

        beaver.createMessage(db.pvpAlert.channel, msg);
    }

    /*
     Function: Register PVP
     Type: Command
     Usage: ~registerpvp [A, B, or cancel]
     Description: Add user id to pvp set
     */
    function registerPvp(msg) {
        var errorMsg = "Register for either set A (3:00JST) or set B (15:00JST) with `~registerpvp A` or `~registerpvp B`\n" +
            "To unregister, enter `~registerpvp cancel`";
        var m = msg.content.split(' ');

        // didn't specify A or B
        if (m.length == 1) {
            beaver.createMessage(msg.channel.id, errorMsg);
            return;
        }

        var set = m[1].toUpperCase();
        var id = msg.author.id;
        if (set == 'A') {
            // user not registered yet
            if (db.pvpAlert.setA.indexOf(id) == -1) {
                db.pvpAlert.setA.push(id);
                beaver.createMessage(msg.channel.id, "<@" + id + "> has been registered in set A.");
            }
            else {  // user registered already
                beaver.createMessage(msg.channel.id, "<@" + id + "> is already in set A!");
            }
            console.log(msg.author.username + " has tried to register for set A");
        }
        else if (set == 'B') {
            // user not registered yet
            if (db.pvpAlert.setB.indexOf(id) == -1) {
                db.pvpAlert.setB.push(id);
                beaver.createMessage(msg.channel.id, "<@" + id + "> has been registered in set B.");
            }
            else {  // user registered already
                beaver.createMessage(msg.channel.id, "<@" + id + "> is already in set B!");
            }
            console.log(msg.author.username + " has tried to register for pvp B");
        }
        else if (set == 'CANCEL') {
            var indexA = db.pvpAlert.setA.indexOf(id);
            var indexB = db.pvpAlert.setB.indexOf(id);

            if (indexA > -1) {
                db.pvpAlert.setA.splice(indexA, 1);
            }
            if (indexB > -1) {
                db.pvpAlert.setB.splice(indexB, 1);
            }
            beaver.createMessage(msg.channel.id, "<@" + id + "> has been removed from all pvp sets.");
        }
        else {
            beaver.createMessage(msg.channel.id, errorMsg);
        }


    }


    /*
        Functionality: KC Wikia Search
        Type: Command
        Usage: ~kc [search term]
        Description: Returns the url for the wikia page with the search term appended
     */
    function kcWikia(msg) {
        var url = "http://kancolle.wikia.com/wiki/";
        var search = msg.content.split(' ')[1];
        if (search != undefined)
            beaver.createMessage(msg.channel.id, url + search);
        else
            beaver.createMessage(msg.channel.id, "Error: Please enter one search term with no spaces.");
    }

    return {
        pvpTimer: pvpTimer,
        pvpAlert: pvpAlert,
        kcWikia: kcWikia,
        registerPvp: registerPvp
    }

};