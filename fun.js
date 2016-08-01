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
    function play(msg) {
        var m = msg.content.split(' ');

        var game = {
            type: 0,
            url: ""
        };

        if (m.length > 1) {
            game.name = msg.content.substring(6);
        }
        else {
            game = null;
        }
        beaver.editGame(game);

        console.log(getTimestamp() + " Game changed to " + msg.content.substring(6));
    }

    return {
        say: say,
        poi: poi,
        beaverCheck, beaverCheck,
        play: play
    }

    // get the current timestamp for logging
    function getTimestamp() {
        return "[" + moment().format() + "]";
    }

};