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
var msgCounting = require("./msgCounting")(beaver, db);



beaver.on("ready", () => { // When the bot is ready
    console.log(getTimestamp() + " On duty!");
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

beaver.connect();


beaver.on("messageCreate", (msg) => {

    // ignore PMs for now
    if (msg.channel.guild === undefined) return;

    // Message Count
    msgCounting.count(msg);


    // ~ Commands
    if (msg.content.startsWith('~')) {
        var command = msg.author.username + " used " + msg.content;
        console.log(getTimestamp() + command);
        
        /*****************
         ETER ONLY COMMANDS
         ******************/
        if (msg.author.id === "105167204500123648") {
            if (msg.content === "~resetcounts") {
                msgCounting.resetCounts(msg);
            }
            else if (msg.content === "~savedb") {
                saveDB();
            }

            // under testing
            if (msg.content === "~waopvp") {
                var pvpMembers = ["105167204500123648",
                    "175012017290084352"];
                var notify = "DO YOUR GODDAMN PVP: ";
                for (var i = 0; i < pvpMembers.length; i++) {
                    var user = beaver.users.find(function (u) {
                        return u.id === pvpMembers[i]
                    });
                    notify += user.mention + " ";
                }
                beaver.createMessage(msg.channel.id, notify);
            }

            if (msg.content === "~test") {
                /*var server = beaver.guilds.find(function(g) {return g.id === "107915021203304448"});
                 var adminrole = server.roles.find(function (r) {return r.name === "Admin"})
                 console.log(adminrole);
                 */
            }
        }

        /*********************
         ADMIN/FOUNDER COMMANDS
         *********************/
        // COMMAND: Count update
        else if (msg.author.id === "105167204500123648" || isAdminFounder(msg.member.roles)) {
            if (msg.content === "~counts") {
                msgCounting.requestCounts(msg.channel.id);
            }
        }

        /*****************
         PUBLIC COMMANDS
         *****************/
        // COMMAND: KC Wikia Search
        else if (msg.content.startsWith("~kc")) {
            kancolle.kcWikia(msg);
        }
        else if (msg.content === "~beaver") {
            beaver.createMessage(msg.channel.id, "Yukikaze改 on duty!");
        }
    }

});

// Save db to json file every 5 mins
var dbSaveRule = new schedule.RecurrenceRule();
dbSaveRule.minute = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 59];
schedule.scheduleJob(dbSaveRule, saveDB);

function saveDB() {
    jsonfile.writeFileSync(filePath, db, {spaces: 2});
}


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



