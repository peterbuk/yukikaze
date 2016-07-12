var Eris = require('eris');
var schedule = require("node-schedule");

var beaver = new Eris("MTc1MDEyMDE3MjkwMDg0MzUy.CmW86w.sd_RFxhnTnQU7s5_Sueczz-vcgM");


beaver.on("ready", () => { // When the bot is ready

    var date = new Date();
    var msg = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    console.log("[" + msg + "]" + " On duty!"); // Log "Ready!"
});

beaver.on("messageCreate", (msg) => {
    /*
    if(msg.content === "!ping") {
        beaver.createMessage(msg.channel.id, "Pangcake!");
		console.log(msg.content);
    }
    */
    if (msg.id === "105167204500123648") {
        console.log ("eter message");
        if (msg.content === "~ping") {
            beaver.createMessage(msg.channel.id, "Yukikaze改 on duty!");
        }
    }
});

beaver.connect();

var timerRule = new schedule.RecurrenceRule();
//timerRule.second = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

var job = schedule.scheduleJob(timerRule, function() {
    var date = new Date();
    var msg = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    beaver.createMessage("202272875447582729", msg);
})

/*
* KC FUNCTIONS
* */

var pvpTimer = new schedule.RecurrenceRule();
pvpTimer.hour = 1, 13;
pvpTimer.minute = 0;

var pvp = schedule.scheduleJob(pvpTimer, function() {
    var msg = "**PVP ALERT**\nRESETS IN ONE HOUR";

    beaver.createMessage("137807564028116993", msg);
})
