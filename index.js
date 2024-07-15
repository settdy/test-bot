const {
    Client,
    GatewayIntentBits,
    Collection,
} = require(`discord.js`);
const fs = require("fs");
require("dotenv").config();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
});
client.commands = new Collection();
const functions = fs
    .readdirSync("./functions")
    .filter((file) => file.endsWith(".js"));
const eventFiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./commands");
(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./events");
    client.handleCommands(commandFolders, "./commands");
    client.login(process.env.token);
})();