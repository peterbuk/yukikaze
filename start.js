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

beaver.on("ready", () => { // When the bot is ready
    var date = moment().format();
    console.log("[" + date + "]" + " On duty!");
});



beaver.connect();

kancolle.commands();
kancolle.pvpTimer();



