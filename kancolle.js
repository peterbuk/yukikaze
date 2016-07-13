/*
 *  Kancolle functionality
 *  ----------------------
 *  PVP Timer
 */

var schedule = require("node-schedule");


module.exports = function(beaver) {
    return {
        pvpTimer: pvpTimer,
        commands: commands
    }

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
        });

        var timerRule = new schedule.RecurrenceRule();
        timerRule.second = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

        var job = schedule.scheduleJob(timerRule, function() {
            var date = new Date();
            var msg = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

            beaver.createMessage("202272875447582729", msg);
        })
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
                }
            }
        });
    }

};