var moment = require("moment");

module.exports = function(beaver) {



    var startTime = "[" + moment().format() + "]";
    var adminRoleID = "107984947930771456";
    var founderRoleID = "107920385122553856";

    // main channels object
    var mainChannels = {
        "107915021203304448": {name: "general", count: 0},
        "112533065837862912": {name: "miscellaneous", count: 0},
        "127209816207785984": {name: "advice-serious", count: 0},
        "107926606336507904": {name: "meta", count: 0},
        "108002239905284096": {name: "games-sports", count: 0},
        "107963990071603200": {name: "anime-manga", count: 0},
        "137807564028116993": {name: "kancolle", count: 0},
        "109467169867194368": {name: "idol-heaven", count: 0},
        "110073065035026432": {name: "fanart", count: 0},
        "140191247586295808": {name: "skynet", count: 0}
    };

    // temp/opt-in channels object
    var otherChannels = {
        // testchannel
        "180542031616147456": {name: "testgeneral", count: 0}
    };




    function count() {
        beaver.on("messageCreate", (msg) => {

            if (msg.channel.guild === 'undefined') return;

            if (msg.channel.id in mainChannels) {
                mainChannels[msg.channel.id].count++;
                //console.log("["+mainChannels[msg.channel.id].name+"]:"+ msg.author.username);
            }
            else if (msg.channel.id in otherChannels) {
                otherChannels[msg.channel.id].count++;
                //console.log("["+otherChannels[msg.channel.id].name+"]::"+ msg.author.username);
            }
            else { // channel not added yet
                otherChannels[msg.channel.id] = {
                    name: msg.channel.name,
                    count: 1
                };
                //console.log(otherChannels[msg.channel.id].name + " CREATED");
            }

            var roles = msg.member.roles;

            if (msg.author.id === "105167204500123648" ||
                msg.member.roles.indexOf(founderRoleID) != -1 ||
                msg.member.roles.indexOf(adminRoleID) != -1) {
                if (msg.content === "~counts") {
                    var response = createUpdate();
                    beaver.createMessage(msg.channel.id, response);
                }
            }
        });
    }

    /*
    *   Create the update message with channel names and log counts
    *   TODO: make nicer table
     */
    function createUpdate() {
        var updateMsg = "```Logging started " + startTime + "\n\n"
            + "MAIN CHANNELS\n=============\n";

        for (var channel in mainChannels) {
            updateMsg += mainChannels[channel].name + ": " + mainChannels[channel].count + "\n";
        }

        updateMsg += "\nOPT-IN/TEMP CHANNELS\n====================\n"

        for (var channel in otherChannels) {
            updateMsg += otherChannels[channel].name + ": " + otherChannels[channel].count + "\n";
        }

        return updateMsg + "```";
    }

    return {
        count: count
    }

};