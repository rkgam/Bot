const {Client, Guild, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const ms = require("ms");

module.exports = {
    name: 'guildCreate',

    /**
     * @param {Client} client
     * @param {Guild} guild
     */

    async execute(guild, client) {
        const {name, members, channels} = guild;

        let channelToSend;

        channels.cache.forEach(channel => {

            if(channel.type === ChannelType.GuildText && !channelToSend && channel.permissionsFor(members.me).has(PermissionFlagsBits.SendMessages)) channelToSend = channel
        })

        if(!channelToSend) return

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setAuthor({name: name, iconURL: guild.iconURL()})
        .setDescription(`Hey, This is **${client.user.username}**! Thanks for inviting me to your server!`)
        .setFooter({text: 'Devloped by ~ Karan_xD'})
        .setTimestamp()

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.com/api/oauth2/authorize?client_id=1122488425552031824&permissions=8&scope=bot%20applications.commands")
            .setLabel("Invite Me")
        )

        channelToSend.send({embeds: [embed], components: [row]})
    }
}