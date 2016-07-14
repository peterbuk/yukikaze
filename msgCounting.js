var moment = require("moment");
var schedule = require("node-schedule");

module.exports = function(beaver, db) {

    var dbObj = db.msgCounting;

    dbObj.startTime = "[" + moment().format() + "]";

    /*
        Function: Reset Counts
        Type: Internal
        Reset the counts of each channel
        TODO make this run at midnight
     */
    function resetCounts() {
        for (var channel in dbObj.mainChannels) {
            dbObj.mainChannels[channel].count = 0;
        }
        for (var channel in dbObj.optinChannels) {
            dbObj.optinChannels[channel].count = 0;
        }
        dbObj.otherChannels = {};
    }

    /*
        Function: Count Message
        Type: Passive
        Counts each message sent from every channel.
     */
    function count(msg) {
        //console.log("["+msg.channel.name+"]:"+ msg.author.username);

        // filtered channels
        if (dbObj.channelFilter.indexOf(msg.channel.id) != -1)
            return;

        // main channel message
        if (msg.channel.id in dbObj.mainChannels) {
            dbObj.mainChannels[msg.channel.id].count++;
        }
        // optin channel message
        else if (msg.channel.id in dbObj.optinChannels) {
            dbObj.optinChannels[msg.channel.id].count++;
        }
        else if (msg.channel.id in dbObj.otherChannels) {
            dbObj.otherChannels[msg.channel.id].count++;
        }
        else { // new temp channel not in db
            dbObj.otherChannels[msg.channel.id] = {
                name: msg.channel.name,
                count: 1
            };
        }
    }
    
    
    /*
        Function: Counts Request
        Type: Command
        Create an update message and send to channel
     */
    function requestCounts(chanID, response = "") {
        response += createUpdate();
        beaver.createMessage(chanID, response);
    }

    /*
    *   Create the update message with channel names and log counts
    *   TODO: make nicer table
     */
    function createUpdate() {
        var mainTotal = 0, otherTotal = 0, optinTotal= 0, tempTotal = 0;
        var mainMsg = "", optInMsg = "", tempMsg = "";

        // calculate totals and messages
        for (var channel in dbObj.mainChannels) {
            mainTotal += dbObj.mainChannels[channel].count;
            mainMsg += dbObj.mainChannels[channel].name + ": " + dbObj.mainChannels[channel].count + "\n";
        }

        for (var channel in dbObj.optinChannels) {
            otherTotal += dbObj.optinChannels[channel].count;
            optinTotal += dbObj.optinChannels[channel].count;
            optInMsg += dbObj.optinChannels[channel].name + ": " + dbObj.optinChannels[channel].count + "\n";
        }

        for (var channel in dbObj.otherChannels) {
            otherTotal += dbObj.otherChannels[channel].count;
            tempTotal += dbObj.otherChannels[channel].count;
            tempMsg += dbObj.otherChannels[channel].name + ": " + dbObj.otherChannels[channel].count + "\n";
        }

        var updateMsg = "```Logging started " + dbObj.startTime + "\n\n"
            + "MAIN CHANNELS\n=============\n";

        updateMsg += "TOTAL: " + mainTotal + "\n-------------\n" + mainMsg;
        updateMsg += "others: " + otherTotal + "\n";

        updateMsg += "\nOPT-IN CHANNELS\n===============\n"
        updateMsg += "TOTAL: " + optinTotal + "\n---------------\n" + optInMsg;

        updateMsg += "\nTEMP CHANNELS\n==============\n"
        updateMsg += "TOTAL: " + tempTotal + "\n--------------\n" + tempMsg;

        return updateMsg + "```";
    }


    /*
        Reset and send daily update on midnight refresh
     */
    var dailyUpdateRule = new schedule.RecurrenceRule();
    dailyUpdateRule.hour = 0;
    dailyUpdateRule.minute = 0;
    schedule.scheduleJob(dailyUpdateRule, function() {
        console.log("[" + moment().format() + "] Sending Daily Update");
        requestCounts("180542031616147456",
            ":calendar_spiral: **`DAILY UPDATE for "+ moment().subtract(1, 'days').format('MMMM D')
            + "`** :calendar_spiral: ");    // send update
        resetCounts();
    });

    return {
        count: count,
        requestCounts: requestCounts
    }

};