var Eris = require('eris');
var schedule = require("node-schedule");

var beaver = new Eris("MTc1MDEyMDE3MjkwMDg0MzUy.CmW86w.sd_RFxhnTnQU7s5_Sueczz-vcgM");


beaver.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
});

beaver.on("messageCreate", (msg) => {
    if(msg.content === "!ping") {
        beaver.createMessage(msg.channel.id, "Pangcake!");
		console.log(msg.content);
    }
});

beaver.connect();

var timerRule = new schedule.RecurrenceRule();

var job = schedule.scheduleJob(timerRule, function() {
    var msg = new Date();

    beaver.createMessage("202272875447582729", msg);
})