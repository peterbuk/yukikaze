/*
 * YUKIKAZE KAI
 * a beaver for various things
 * Author: Eternith
 */

var Eris = require('eris');
var beaver = new Eris("MTc1MDEyMDE3MjkwMDg0MzUy.CmW86w.sd_RFxhnTnQU7s5_Sueczz-vcgM");

// modules
var schedule = require("node-schedule");
var moment = require("moment");
var jsonfile = require("jsonfile");

// Load database
var filePath = "./db.json";
if (process.env.OPENSHIFT_DATA_DIR != undefined)
    filePath = process.env.OPENSHIFT_DATA_DIR + "db.json";

var db = jsonfile.readFileSync(filePath);
console.log(getTimestamp() + " Loaded db from " + filePath);

// custom modules
var kancolle = require("./kancolle.js")(beaver, db);
var msgCounting = require("./msgCounting.js")(beaver, db);
var fun = require("./fun.js")(beaver, db);
var internal = require("./internal.js")(beaver, db, filePath);



beaver.on("ready", () => { // When the bot is ready
    console.log(getTimestamp() + " On duty!");
    fun.play("with logs~", false); // set default play message
});
beaver.on("error", (err) => {
   console.log(getTimestamp() + " Error: " + err + err.message);
});
beaver.on("connect", () => {
    console.log(getTimestamp() + " Connected.");
});
beaver.on("disconnect", () => {
    console.log(getTimestamp() + " Disconnected.");
});

// on new member join
beaver.on("guildMemberAdd", (guild, member) => {
    fun.memberJoinLeave(guild, member, "j");
});
beaver.on("guildMemberRemove", (guild, member) => {
    fun.memberJoinLeave(guild, member, "l");
});


beaver.connect();


beaver.on("messageCreate", (msg) => {

    // ignore PMs for now
    if (msg.channel.guild === undefined) return;

    // Message Count
    msgCounting.count(msg);

    // ignore ~~slash~~
    if (msg.content.startsWith("~~")) return;

    // ~ Commands
    if (msg.content.startsWith('~')) {
        var legitCommand = false;

        /*****************
         ETER ONLY COMMANDS
         ******************/
        if (msg.author.id === "105167204500123648") {
            
        // msgCounting commands
            if (msg.content === "~resetcounts") {
                msgCounting.resetCounts(msg);
                legitCommand = true;
            }
            else if (msg.content.startsWith("~optin")) {
                msgCounting.newOptin(msg);
                legitCommand = true;
            }
            else if (msg.content.startsWith("~deleteoptin")) {
                msgCounting.deleteOptin(msg);
                legitCommand = true;
            }
                
        // internal commands
            else if (msg.content === "~savedb") {
                internal.saveDB();
                legitCommand = true;
            }
            else if (msg.content === "~loaddb") {
                internal.loadDB();
                legitCommand = true;
            }
            else if (msg.content === "~test") {
                internal.playground(msg);
                legitCommand = true;
            }
                
        // fun commands
            else if (msg.content.startsWith("~say")) {
                fun.say(msg);
                legitCommand = true;
            }
            else if (msg.content.startsWith("~play")) {
                fun.play(msg, true);
                legitCommand = true;
            }

        // kancolle comamnds
            else if (msg.content === "~waopvp") {
                kancolle.pvpAlert(msg);
                legitCommand = true;
            }
        }

        /*********************
         ADMIN/FOUNDER COMMANDS
         *********************/
        // COMMAND: Count update
        if (msg.author.id === "105167204500123648" || isAdminFounder(msg.member.roles)) {
            if (msg.content === "~counts") {
                msgCounting.requestCounts(msg.channel.id);
                legitCommand = true;
            }
        }


        /*****************
         PUBLIC COMMANDS
         *****************/
        if (msg.content.startsWith("~kc ")) {
            kancolle.kcWikia(msg);
            legitCommand = true;
        }
        else if (msg.content === "~beaver" || msg.content === "~ping") {
            fun.beaverCheck(msg);
            legitCommand = true;
        }
        else if (msg.content === "~poi") {
            fun.poi(msg);
            legitCommand = true;
        }

        // log command usage after
        if (legitCommand) {
            var command = msg.channel.name + " -> " + msg.author.username + " used " + msg.content;
            console.log(getTimestamp() + " " + command);
        }
    }

});




/*
***************************
* HELPER FUNCTIONS
* **************************
 */

// get the current timestamp for logging
function getTimestamp() {
    return "[" + moment().format() + "]";
}


// helper function to check if a member is an admin or founder
function isAdminFounder(roles) {
    if (roles.indexOf(db.etc.adminRoleID) != -1 ||
        roles.indexOf(db.etc.founderRoleID) != -1)
        return true;
    else
        return false;
}



