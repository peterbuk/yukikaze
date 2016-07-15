/*
 *  Kancolle functionality
 *  ----------------------
 *  PVP Daily Timer
 *  KC Wikia Search
 */

var schedule = require("node-schedule");
var moment = require("moment");

module.exports = function(beaver, obj) {

    

    /*
        Function: PVP Daily Timer
        Type: Passive
        Sends a message one hour before each PVP set expires.
        Alerts a list of registered users.
     */
    function pvpTimer() {
        var pvpRule = new schedule.RecurrenceRule();
        pvpRule.hour = [1, 13];
        pvpRule.minute = 0;
        
        var pvp = schedule.scheduleJob(pvpRule, function() {
            var msg = "**PVP ALERT**\nRESETS IN ONE HOUR";
            beaver.createMessage("137807564028116993", msg);
            console.log("[" + moment().format() + "]" + "pvp alert sent")
        });
    }
    pvpTimer(); // start


    /*
        Functionality: KC Wikia Search
        Type: Command
        Returns the url for the wikia page with the search term appended
     */
    function kcWikia(msg) {
        var url = "http://kancolle.wikia.com/wiki/";
        var search = msg.content.split(' ');
        if (search.length > 1)
            beaver.createMessage(msg.channel.id, url + search[1]);
        else
            beaver.createMessage(msg.channel.id, "Error: Please enter one search term with no spaces.");
    }

    return {
        pvpTimer: pvpTimer,
        kcWikia: kcWikia
    }

};