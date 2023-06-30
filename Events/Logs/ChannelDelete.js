const { Client, GuildChannel, EmbedBuilder } = require("discord.js");
const DB = require("../../Structures/Schemas/LogsChannel");
const SwitchDB = require("../../Structures/Schemas/GenralLogs");

module.exports = {
    name: "channelDelete",


    /**
     * @param {GuildChannel} channel
     * @param {Client} client
     */

    async execute(channel, client) {

        const { guild, name } = channel;

        const data = await DB.findOne({Guild: guild.id}).catch(err => console.log(err))
        const Data = await SwitchDB.findOne({Guild: guild.id}).catch(err => console.log(err))

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
                .setTitle(`⚠️ | Channel Deleted`)
                .setDescription(`A channel has been deleted named:  **${name}**`)
                .setThumbnail(guild.iconURL())
                .setFooter({text: `Made by ~ karan_xD`})
                .setTimestamp()
            ]
        })
    }
}