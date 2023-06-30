const { Client, Guild, User, EmbedBuilder } = require("discord.js");
const DB = require("../../Structures/Schemas/LogsChannel");
const SwitchDB = require("../../Structures/Schemas/GenralLogs");

module.exports = {
    name: "guildBanRemove",


    /**
     * @param {Guild} guild
     * @param {User} user
     * @param {Client} client
     */

    async execute(guild, user, client) {

        const { id, username, discriminator } = user;

        const data = await DB.findOne({Guild: guild.id}).catch(err => console.log(err))
        const Data = await SwitchDB.findOne({Guild: guild.id}).catch(err => console.log(err))

        if(!Data) return
        if(Data.MemberBan === false) return
        if(!data) return

        const logsChannel = data.Channel

        const Channel = await guild.channels.cache.get(logsChannel)
        if(!Channel) return

        return Channel.send({ 
            embeds: [
                new EmbedBuilder()
                .setColor("Blue")
                .setTitle(`⚠️ | Member Ban`)
                .setDescription(`**${username}#${discriminator}** (${id}) has been unbanned from the server!!`)
                .setThumbnail(guild.iconURL())
                .setFooter({text: `Made by ~ karan_xD`})
                .setTimestamp()
            ]
        })
    }
}