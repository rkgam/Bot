const {ShardingManager} = require("discord.js");
require("dotenv").config()
const config = require("../config.json")

let manager = new ShardingManager('./Structures/index.js', {
    token: config.discord.token,
    totalShards: "auto",
});

manager.on("shardCreate", shard => {
    console.log(`[SHARD]: Lunched shard ${shard.id}`)
});



manager.spawn();