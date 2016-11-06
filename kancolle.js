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
        var pvpRule = new schedule.RecurrenceRule();
        pvpRule.hour = [0, 12];
        pvpRule.minute = 0;
        
        var pvp = schedule.scheduleJob(pvpRule, function() {
            var msg = ":crossed_swords: **PVP ALERT** :crossed_swords:\nRESETS IN ONE HOUR";
            beaver.createMessage("137807564028116993", msg);
            console.log("[" + moment().format() + "]" + "pvp alert sent")
        });
    }
    pvpTimer(); // start
    
    
    // alert for pvp, not currently used
    function pvpAlert(msg) {
        var pvpMembers = ["105167204500123648",
            "175012017290084352"];
        var notify = "DO YOUR GODDAMN PVP: ";
        for (var i = 0; i < pvpMembers.length; i++) {
            var user = beaver.users.find(function (u) {
                return u.id === pvpMembers[i]
            });
            notify += user.mention + " ";
        }
        beaver.createMessage(msg.channel.id, notify);
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
        kcWikia: kcWikia
    }

};