const {Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const ms = require("ms");

module.exports = {
    name: 'messageCreate',

    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {

        const {author, guild, content} = message;
        const {user} = client;

        if(!guild || author.bot) return
        if(content.includes("@here") || content.includes("@everyone")) return
        if(!content.includes(user.id)) return

        return message.reply({

            embeds: [
                new EmbedBuilder()
                .setColor("Blue")
                .setAuthor({name: user.username, iconURL: user.displayAvatarURL()})
                .setDescription(`Het, you called me? I'm ${client.user.username}! Nice to meet you. Type \`/\` & click on my logo to see all my commands!\n\n*This message will be deleted in \`10 seconds\`!*`)
                .setThumbnail(user.displayAvatarURL())
                .setFooter({text: `Introduction to ${client.user.username}`})
                .setTimestamp()
            ],

            components: [
                new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://discord.com/api/oauth2/authorize?client_id=1122488425552031824&permissions=8&scope=bot%20applications.commands")
                    .setLabel("Invite Me"),

                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL("http://localhost/")
                    .setLabel("Dashboard"),
                ),
            ]
        }).then(msg => {

            setTimeout(() => {

                msg.delete().catch(e => {
                    if(e.code !== 10008) return console.log(e)
                })
            }, ms("10s"));
        })

    }
}