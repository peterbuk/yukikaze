module.exports = function(beaver) {
    var abc = 1;



    // main channels object
    var mainChannels = {
        "107915021203304448": {name: "general", count: 0},
        "112533065837862912": {name: "miscellaneous", count: 0},
        "127209816207785984": {name: "advice-serious", count: 0},
        "107926606336507904": {name: "meta", count: 0},
        "108002239905284096": {name: "games-sports", count: 0},
        "107963990071603200": {name: "anime-manga", count: 0},
        "137807564028116993": {name: "kancolle", count: 0},
        "109467169867194368": {name: "idol-heaven", count: 0},
        "110073065035026432": {name: "fanart", count: 0},
        "140191247586295808": {name: "skynet", count: 0},
        // test
        "180542031616147456": {name: "testgeneral", count: 0}
    };

    // temp/opt-in channels object
    var otherChannels = {};




    function count() {

        beaver.on("messageCreate", (msg) => {

            if (msg.channel.id in mainChannels) {
                mainChannels[msg.channel.id].count++;
                console.log("["+mainChannels[msg.channel.id].name+"]:"+ msg.author.username);
            }
            else if (msg.channel.id in otherChannels) {
                otherChannels[msg.channel.id].count++;
                console.log("["+otherChannels[msg.channel.id].name+"]::"+ msg.author.username);
            }
            else { // channel not added yet
                otherChannels[msg.channel.id] = {
                    name: msg.channel.name,
                    count: 1
                };
                console.log(otherChannels[msg.channel.id].name + " CREATED");
            }
        });

    }

    return {
        count: count,
        abc: abc
    }

};