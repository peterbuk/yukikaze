/*
 *  Msg Counting functionality
 *  ----------------------
 */

var moment = require("moment");
var schedule = require("node-schedule");
var fs = require("fs");

var archiveFilePath = "./archive.csv"
if (process.env.OPENSHIFT_DATA_DIR != undefined)
    archiveFilePath = process.env.OPENSHIFT_DATA_DIR + "archive.csv";

module.exports = function(beaver, db) {

    var dbObj = db.msgCounting;

    dbObj.startTime = "[" + moment().format() + "]";

    /*
        Function: Reset Counts
        Type: Internal
        Description: Reset the counts of each channel
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
        Description: Counts each message sent from every channel.
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
     Function: New Optin
     Type: Command
     Usage: ~optin [channel-id]
     Description: Move a channel from temp channel to optin channel
     */
    function newOptin(msg) {
        var chanID = msg.content.split(' ')[1];
        if (chanID != undefined && dbObj.otherChannels[chanID] != undefined) {

            dbObj.optinChannels[chanID] = {};     // create channel obj
            dbObj.optinChannels[chanID].name = dbObj.otherChannels[chanID].name;
            dbObj.optinChannels[chanID].count = dbObj.otherChannels[chanID].count;
            dbObj.optinChannels[chanID].total = dbObj.otherChannels[chanID].total;

            // fix total numbers
            dbObj.totals.optinTotal.count += dbObj.optinChannels[chanID].count;
            dbObj.totals.optinTotal.total += dbObj.optinChannels[chanID].total;
            dbObj.totals.tempTotal.count -= dbObj.otherChannels[chanID].count;
            dbObj.totals.tempTotal.count -= dbObj.otherChannels[chanID].total;

            delete dbObj.otherChannels[chanID]; // clean up temp channel
            beaver.createMessage(msg.channel.id,
                dbObj.optinChannels[chanID].name + " moved to optin channels.");
        }
        else
            beaver.createMessage(msg.channel.id, "Error: usage `~optin [channel-id]`");

    }


    /*
     Function: Delete Optin
     Type: Command
     Usage: ~deleteoptin [channel-id]
     Description: Delete a channel from optin channels
     */
    function deleteOptin(msg) {
        var chanID = msg.content.split(' ')[1];
        if (chanID != undefined && dbObj.optinChannels[chanID] != undefined) {
            var name = dbObj.optinChannels[chanID].name;
            delete dbObj.optinChannels[chanID];
            beaver.createMessage(msg.channel.id, name + " deleted.");
        }
        else {
            beaver.createMessage(msg.channel.id, "Error: usage `~deleteoptin [channel-id]`");
        }
    }



    /*
        Function: Counts Request
        Type: Command
        Usage: ~counts
        Description: Create an update message and send to channel
     */
    function requestCounts(chanID, response = "") {
        response += createUpdate();
        beaver.createMessage(chanID, response);

        return response;
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

        var updateMsg = "```xl\nSession started " + dbObj.startTime + "\n\n";

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
        var update = requestCounts(db.etc.botlogID,
            ":calendar_spiral: **`DAILY UPDATE for "+ moment().subtract(1, 'days').format('MMMM D')
            + "`** :calendar_spiral: ");    // send update

        // archive update
        fs.appendFile(archiveFilePath, update, (err) => {
            if (err) throw err;
            console.log(getTimestamp() + " Update archived.");
        });

        resetCounts();
    });

    return {
        count: count,
        newOptin: newOptin,
        deleteOptin: deleteOptin,
        resetCounts: resetCounts,
        requestCounts: requestCounts
    }

    // get the current timestamp for logging
    function getTimestamp() {
        return "[" + moment().format() + "]";
    }

};