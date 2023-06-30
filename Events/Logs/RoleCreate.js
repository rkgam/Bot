const { Client, Role, EmbedBuilder } = require("discord.js");
const DB = require("../../Structures/Schemas/LogsChannel");
const SwitchDB = require("../../Structures/Schemas/GenralLogs");

module.exports = {
    name: "roleCreate",


    /**
     * @param {Role} role
     * @param {Client} client
     */

    async execute(role, client) {

        const { guild, name } = role;

        const data = await DB.findOne({Guild: guild.id}).catch(err => { })
        const Data = await SwitchDB.findOne({Guild: guild.id}).catch(err => { })

        if(!Data) return
        if(Data.RoleStatus === false) return
        if(!data) return

        const logsChannel = data.Channel

        const Channel = await guild.channels.cache.get(logsChannel)
        if(!Channel) return

        return Channel.send({ 
            embeds: [
                new EmbedBuilder()
                .setColor("Blue")
                .setTitle(`⚠️ | Role Created`)
                .setDescription(`A Role has been created named: ${role}, \`${role.name}\``)
                .setThumbnail(guild.iconURL())
                .setFooter({text: `Made by ~ karan_xD`})
                .setTimestamp()
            ]
        })
    }
}