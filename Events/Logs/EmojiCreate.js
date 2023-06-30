const { Client, GuildEmoji, EmbedBuilder } = require("discord.js");
const DB = require("../../Structures/Schemas/LogsChannel");
const SwitchDB = require("../../Structures/Schemas/GenralLogs");

module.exports = {
    name: "emojiCreate",


    /**
     * @param {GuildEmoji} emoji
     * @param {Client} client
     */

    async execute(emoji, client) {

        const { guild, id } = emoji;

        const data = await DB.findOne({Guild: guild.id}).catch(err => console.log(err))
        const Data = await SwitchDB.findOne({Guild: guild.id}).catch(err => console.log(err))

        if(!Data) return
        if(Data.EmojiStatus === false) return
        if(!data) return

        const logsChannel = data.Channel

        const Channel = await guild.channels.cache.get(logsChannel)
        if(!Channel) return

        return Channel.send({ 
            embeds: [
                new EmbedBuilder()
                .setColor("Blue")
                .setTitle(`⚠️ | Emoji Created`)
                .setDescription(`An  Emoji  has been added to the server: ${emoji}, **${id}**`)
                .setThumbnail(guild.iconURL())
                .setFooter({text: `Made by ~ karan_xD`})
                .setTimestamp()
            ]
        })
    }
}