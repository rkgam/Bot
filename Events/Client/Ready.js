const {Client, ActivityType} = require("discord.js");
const ms = require("ms");
const mongoose = require("mongoose");
const mongo = process.env.MONGODB

// module.exports = {
//     name: 'ready',

//     /**
//      * @param {Client} client
//      */
//     async execute(client) {
//         const {user} = client;

//         console.log(`${user.tag} is now online`);

//         setInterval(() => {

//             user.setActivity({
//                 name: `${client.guilds.cache.size} servers!!`,
//                 type: ActivityType.Competing,
//             }, ms("5s"))
//         })
//     }
// }

module.exports = {
    name: 'ready',
    async execute(client) {
        const {user} = client;

        console.log(`${user.tag} is now on`);


        user.setActivity({
            name: `${client.guilds.cache.size} server`,
            type: ActivityType.Competing,
        }, ms("5s"));

        if(!mongo) return;

        mongoose.connect(mongo).then(() => {
            console.log("CONNECTED TO MONGODB")
        }).catch((e) => {
            console.log(e);
        })
    }
}