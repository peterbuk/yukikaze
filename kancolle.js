/*
 *  Kancolle functionality
 *  ----------------------
 *  PVP Timer
 */

var schedule = require("node-schedule");

/*
 *  PVP TIMER
 */

var pvpTimer = new schedule.RecurrenceRule();
pvpTimer.hour = [1, 13];
pvpTimer.minute = 0;

var pvp = schedule.scheduleJob(pvpTimer, function() {
    var msg = "**PVP ALERT**\nRESETS IN ONE HOUR";

    beaver.createMessage("137807564028116993", msg);
});

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