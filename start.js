var Eris = require("eris");

var beaver = new Eris("MTc1MDEyMDE3MjkwMDg0MzUy.CmW86w.sd_RFxhnTnQU7s5_Sueczz-vcgM");


beaver.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
});

beaver.on("messageCreate", (msg) => {
    if(msg.content === "!ping") {
        beaver.createMessage(msg.channel.id, "Pangcake!");
    }
});

beaver.connect();