/*
 *  Fun functionality
 *  ----------------------
 */

var schedule = require("node-schedule");
var moment = require("moment");

module.exports = function(beaver, db) {


    /*
     Function: Say
     Type: Command
     Usage: ~say [channel-id] [message]
     Description: Make Yukikaze say something in a given channel
     */
    function say(msg) {
        var m = msg.content.split(' ');
        var message = msg.content.substring(6+m[1].length);
        beaver.createMessage(m[1], message);
    }


    /*
     Function: Poi
     Type: Command
     Usage: ~poi
     Description: Poi
     */
    function poi(msg) {
        beaver.createMessage(msg.channel.id, "I think you are looking for my friend, Yuudachi-poi?");
        beaver.createMessage(msg.channel.id, "?poi");
    }

    /*
     Function: Beaver check
     Type: Command
     Usage: ~beaver or ~ping
     Description: Check if beaver is alive
     */
    function beaverCheck(msg) {
        beaver.createMessage(msg.channel.id, "Yukikaze改 on duty!");

    }
    
    
    /*
     Function: Play
     Type: Command
     Usage: ~play [game message] or ~play to clear
     Description: Set the game that Yukikaze is currently playing
     */
    function play(msg, fromCommand=true) {
        var game = {
            type: 0,
            url: ""
        };

        // source from command, have msg to parse
        if (fromCommand) {
            var m = msg.content.split(' ');

            if (m.length > 1) {
                game.name = msg.content.substring(6);
            }
            else {
                game = null;
            }
        }
        else {
            game.name = msg;
        }
        beaver.editGame(game);

        console.log(getTimestamp() + " Game changed.");
    }

    /*
     Function: Member Join Leave
     Type: Event
     Description: Send a message when a new member joins or leaves
     */
    function memberJoinLeave(guild, member, event) {
        if (guild.id === db.etc.rAnimeServerID) {

            var time = "[" + moment().format('YYYY MMM D  HH:mm:ss ZZ') + "]";
            var user = member.user.username + member.user.discriminator;
            var msg = "";

            if (event === "j") {
                msg = time + " :white_check_mark: **" + user + "** has joined the server (" +
                    member.id + ") :white_check_mark:";
                console.log(getTimestamp() + " " + user + "has joined.")
            }
            else { // leave
                msg = time + " :x: **" + user + "** has left the server (" +
                    member.id + ") :x:";
                console.log(getTimestamp() + " " + user + "has left.")
            }
            beaver.createMessage(db.etc.botlogID, msg);
        }
    }

    return {
        say: say,
        poi: poi,
        beaverCheck, beaverCheck,
        play: play,
        memberJoinLeave: memberJoinLeave
    }

    // get the current timestamp for logging
    function getTimestamp() {
        return "[" + moment().format() + "]";
    }

};