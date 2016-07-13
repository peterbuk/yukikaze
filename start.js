/*
 * YUKIKAZE KAI
 */

var Eris = require('eris');
var beaver = new Eris("MTc1MDEyMDE3MjkwMDg0MzUy.CmW86w.sd_RFxhnTnQU7s5_Sueczz-vcgM");

// modules
var schedule = require("node-schedule");
var moment = require("moment");

// custom modules
var kancolle = require("./kancolle.js")(beaver);
var msgCounting = require("./msgCounting")(beaver);

beaver.on("ready", () => { // When the bot is ready
    console.log("[" + moment().format() + "]" + " On duty!");
});

beaver.connect();

// test function
beaver.on("messageCreate", (msg) => {

     if(msg.content === "~beaver") {
     beaver.createMessage(msg.channel.id, "Pangcake!");
     console.log(msg.content);
     }
});

kancolle.commands();
kancolle.pvpTimer();

msgCounting.count();

