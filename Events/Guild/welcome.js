const { Client, GuildMember, EmbedBuilder } = require("discord.js");
const DB = require("../../Structures/Schemas/welcome");

module.exports = {
    name: 'guildMemberAdd',

    /**
     * @param {Client} client
     * @param {GuildMember} member
     */
    async execute(member) {

        const { user, guild } = member;

        const Data = await DB.findOne({ Guild: member.guild.id }).catch(err => { err })
        if (!Data) return

        const Message = `Hey ${user}, welcome to **${guild.name}**`;

        let dmMsg;

        if (Data.Channel !== null) {

            let dmMessage = Data.DMMessage.content

            if (dmMessage.length !== 0) dmMsg = dmMessage
            else dmMsg = Message

            const channel = guild.channels.cache.get(Data.Channel)
            if (!channel) return

            const Embed = new EmbedBuilder()
                .setColor("Blue")
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setDescription(`welcome ${member} to the server!\n\nAccount Created: <t:${parseInt(user.createdTimestamp / 1000)}:R>\nMember Count: \`${guild.memberCount}\``)
                .setThumbnail(user.displayAvatarURL())
                .setFooter({ text: "welcome by ~ karan_xD" })
                .setTimestamp()

            channel.send({ embeds: [Embed] });
        }

        if (Data.DM === true) {

            const Embed = Data.DMMessage.embed

            if (Data.Content === true && Data.Embed === true) {

                const Sent = await member.send({ content: `${dmMsg}` }).catch(err => {

                    if (err.code !== 50007) return console.log(err)
                })

                if (!Sent) return
                if (Embed) Sent.edit({ embeds: [Embed] })

            } else if (Data.Content === true && Data.Embed !== true) {

                const Sent = await member.send({ content: `${dmMsg}` }).catch(err => {

                    if (err.code !== 50007) return console.log(err)
                })


            } else if (Data.Content === true && Data.Embed === true) {

                const Sent = await member.send({ embeds: [Embed] }).catch(err => {

                    if (err.code !== 50007) return console.log(err)
                })
            } else return
        }
    }
}