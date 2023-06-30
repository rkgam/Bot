const {Client, Partials, Collection, GatewayIntentBits, ShardingManager} = require("discord.js");
const ms = require("ms");
require("dotenv").config();
const {glob} = require("glob")
const {promisify} = require("util");
const PG = promisify(glob);
const Ascii = require("ascii-table");
const { EventEmitter } = require("events");
const { emit, emitWarning } = require("process");
const {Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent} = Partials;

const client = new Client({
    intents: 131071,
    partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent],
    allowedMentions: {parse: ["everyone", "roles", "users"]},
    rest: {timeout: ms("1m")}
});


process.on("warning", (e) => {
    console.warn(e.stack)
});
process.setMaxListeners(1);

client.setMaxListeners(50);


client.events = new Collection();
client.commands = new Collection();

const Handlers = ["Events", "Commands", "EventStack", ];

Handlers.forEach(handler => {
    require(`./Handlers/${handler}`)(client, PG, Ascii)
})



module.exports = client



client.login(process.env.TOKEN); 