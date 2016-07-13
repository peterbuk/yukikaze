var Eris = require('eris');
var schedule = require("node-schedule");
var kancolle = require("./kancolle.js");

global.beaver = new Eris("MTc1MDEyMDE3MjkwMDg0MzUy.CmW86w.sd_RFxhnTnQU7s5_Sueczz-vcgM");

beaver.on("ready", () => { // When the bot is ready
    var date = new Date();
    var msg = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    console.log("[" + msg + "]" + " On duty!");
});



beaver.connect();

var timerRule = new schedule.RecurrenceRule();
//timerRule.second = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

var job = schedule.scheduleJob(timerRule, function() {
    var date = new Date();
    var msg = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    beaver.createMessage("202272875447582729", msg);
})


