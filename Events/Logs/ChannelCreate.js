const { Client, GuildChannel, EmbedBuilder } = require("discord.js");
const DB = require("../../Structures/Schemas/LogsChannel");
const SwitchDB = require("../../Structures/Schemas/GenralLogs");

module.exports = {
    name: "channelCreate",


    /**
     * @param {GuildChannel} channel
     * @param {Client} client
     */

    async execute(channel, client) {

        const { guild, name } = channel;

        const data = await DB.findOne({Guild: guild.id}).catch(err => { })
        const Data = await SwitchDB.findOne({Guild: guild.id}).catch(err => { })

        if(!Data) return
        if(Data.ChannelStatus === false) return
        if(!data) return

        const logsChannel = data.Channel

        const Channel = await guild.channels.cache.get(logsChannel)
        if(!Channel) return

        return Channel.send({ 
            embeds: [
                new EmbedBuilder()
                .setColor("Blue")
                .setTitle(`⚠️ | Channel Created`)
                .setDescription(`A channel has been created named: ${channel}, **${channel.name}**`)
                .setThumbnail(guild.iconURL())
                .setFooter({text: `Made by ~ karan_xD`})
                .setTimestamp()
            ]
        })
    }
}