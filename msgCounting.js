var moment = require("moment");
var schedule = require("node-schedule");

module.exports = function(beaver, db) {

    var dbObj = db.msgCounting;

    dbObj.startTime = "[" + moment().format() + "]";

    /*
        Function: Reset Counts
        Type: Internal
        Reset the counts of each channel
     */
    function resetCounts(caller = undefined) {
        for (var channel in dbObj.mainChannels) {
            dbObj.mainChannels[channel].count = 0;
        }
        for (var channel in dbObj.optinChannels) {
            dbObj.optinChannels[channel].count = 0;
        }
        dbObj.otherChannels = {};

        dbObj.totals.mainTotal.count = 0;
        dbObj.totals.optinTotal.count = 0;
        dbObj.totals.tempTotal.count = 0;

        console.log(getTimestamp() + " Counts reset.");

        if (caller != undefined) {
            beaver.createMessage(caller.channel.id, "Counts reset.");
        }
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
            dbObj.mainChannels[msg.channel.id].total++;
            dbObj.totals.mainTotal.count++;
            dbObj.totals.mainTotal.total++;
        }
        // optin channel message
        else if (msg.channel.id in dbObj.optinChannels) {
            dbObj.optinChannels[msg.channel.id].count++;
            dbObj.optinChannels[msg.channel.id].total++;
            dbObj.totals.optinTotal.count++;
            dbObj.totals.optinTotal.total++;
        }
        // temp channel message
        else if (msg.channel.id in dbObj.otherChannels) {
            dbObj.otherChannels[msg.channel.id].count++;
            dbObj.otherChannels[msg.channel.id].total++;
            dbObj.totals.tempTotal.count++;
            dbObj.totals.tempTotal.total++;
        }
        else { // new temp channel not in db
            dbObj.otherChannels[msg.channel.id] = {
                name: msg.channel.name,
                count: 1,
                total: 1
            };
            dbObj.totals.tempTotal.count++;
            dbObj.totals.tempTotal.total++;
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
        var mainMsg = "", optInMsg = "", tempMsg = "";

        // calculate totals and messages
        for (var channel in dbObj.mainChannels) {
            mainMsg += dbObj.mainChannels[channel].name + ": " + dbObj.mainChannels[channel].count +
                " | " + dbObj.mainChannels[channel].total + "\n";
        }

        for (var channel in dbObj.optinChannels) {
            optInMsg += dbObj.optinChannels[channel].name + ": " + dbObj.optinChannels[channel].count +
                " | " + dbObj.optinChannels[channel].total + "\n";
        }

        for (var channel in dbObj.otherChannels) {
            tempMsg += dbObj.otherChannels[channel].name + ": " + dbObj.otherChannels[channel].count +
                " | " + dbObj.otherChannels[channel].total + "\n";
        }

        var otherCount = dbObj.totals.optinTotal.count + dbObj.totals.tempTotal.count;
        var otherTotal = dbObj.totals.optinTotal.total + dbObj.totals.tempTotal.total;
        var grandCount = dbObj.totals.mainTotal.count + otherCount;
        var grandTotal = dbObj.totals.mainTotal.total + otherTotal;

        var updateMsg = "```Session started " + dbObj.startTime + "\n\n";

        updateMsg += "GRAND TOTAL: " + grandCount + " | " + grandTotal + "\n\n";

        updateMsg += "MAIN CHANNELS\n=============\n";

        updateMsg += "TOTAL: " + dbObj.totals.mainTotal.count + " | " + dbObj.totals.mainTotal.total +
            "\n-------------\n" + mainMsg;
        updateMsg += "\n(others): " + otherCount + " | " + otherTotal + "\n";

        updateMsg += "\nOPT-IN CHANNELS\n===============\n"
        updateMsg += "TOTAL: " + dbObj.totals.optinTotal.count + " | " + dbObj.totals.optinTotal.total +
            "\n---------------\n" + optInMsg;

        updateMsg += "\nTEMP CHANNELS\n==============\n"
        updateMsg += "TOTAL: " + dbObj.totals.tempTotal.count + " | " + dbObj.totals.tempTotal.total +
            "\n--------------\n" + tempMsg;

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
        resetCounts: resetCounts,
        requestCounts: requestCounts
    }

    // get the current timestamp for logging
    function getTimestamp() {
        return "[" + moment().format() + "]";
    }

};