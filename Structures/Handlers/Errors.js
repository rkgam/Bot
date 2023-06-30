const { Client, EmbedBuilder } = require("discord.js")
const channelID = process.env.LOGS;

/**
 * @param {Client} client
 */

module.exports = async (client) => {

    const embed = new EmbedBuilder()
    .setColor("Blue")
    .setTimestamp()
    .setFooter({text: "Anti-crash by karan_xD"})
    .setTitle(`⚠️ | Error Encountered`)

    process.on("unhandledRejection", (reason , p) => {
        const channel = client.channels.cache.get(channelID);

        if(!channel) return;
        channel.send({
            embeds: [
                embed.setDescription("**unhandled Rejection/catch:\n\n** ```" + reason + "```")
            ]
        })
    });

    process.on("uncaughtException", (err, origin) => {
        const channel = client.channels.cache.get(channelID);

        if(!channel) return;
        channel.send({
            embeds: [
                embed.setDescription("**Uncaught Exception/catch:\n\n** ```" + err + "\n\n" + origin.toString() + "```")
            ]
        })
    })

    process.on("uncaughtExceptionMonitor", (err, origin) => {
        const channel = client.channels.cache.get(channelID);

        if(!channel) return;
        channel.send({
            embeds: [
                embed.setDescription("**Uncaught Exception/catch (MONITOR):\n\n** ```" + err + "\n\n" + origin.toString() + "```")
            ]
        })
    })
}