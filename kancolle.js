/*
 *  Kancolle functionality
 *  ----------------------
 *  PVP Timer
 */

var schedule = require("node-schedule");
var moment = require("moment");

module.exports = function(beaver) {

    var pvpMembers = ["105167204500123648",
        "175012017290084352"];

    /*
     *  PVP TIMER
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

        /*
        var timerRule = new schedule.RecurrenceRule();
        timerRule.second = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        var job = schedule.scheduleJob(timerRule, function() {
            var date = new Date();
            var msg = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

            beaver.createMessage("202272875447582729", msg);
        })
        */
    }

    function commands() {
        beaver.on("messageCreate", (msg) => {
            /*
             if(msg.content === "!ping") {
             beaver.createMessage(msg.channel.id, "Pangcake!");
             console.log(msg.content);
             }
             */
            if (msg.author.id === "105167204500123648") {
                if (msg.content === "~beaver") {
                    beaver.createMessage(msg.channel.id, "Yukikaze改 on duty!");
                    var logmsg = msg.author.username + " used " + msg.content;
                    console.log("[" + moment().format() + "]" + logmsg);
                }

                if (msg.content === "~waopvp") {
                    var notify = "DO YOUR GODDAMN PVP: ";
                    for (var i = 0; i < pvpMembers.length; i++) {
                        var user = beaver.users.find(function(u) {return u.id === pvpMembers[i]});
                        notify += user.mention + " ";
                    }

                    beaver.createMessage(msg.channel.id, notify);
                }

                if (msg.content.startsWith("~kc")) {
                    var url = "http://kancolle.wikia.com/wiki/";
                    var search = msg.content.split(' ');
                    if (search.length > 1)
                        beaver.createMessage(msg.channel.id, url + search[1]);
                }

                if (msg.content === "~test") {
                    /*var server = beaver.guilds.find(function(g) {return g.id === "107915021203304448"});
                    var adminrole = server.roles.find(function (r) {return r.name === "Admin"})
                    console.log(adminrole);
                    */
                    console.log(msg.member.roles);
                }
            }

        });
    }

    return {
        pvpTimer: pvpTimer,
        commands: commands
    }

};