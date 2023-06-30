const {Client, ContextMenuCommandInteraction, ApplicationCommandType, EmbedBuilder} = require("discord.js")
const translate = require("@iamtraction/google-translate")

module.exports = {
    name:"Translate Message",
    type:ApplicationCommandType.Message,
    context: true,
    category: "context",

    /**
     * @param {ContextMenuCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {

        await interaction.deferReply({ephemeral: true})

        const { channel, targetId } = interaction

        const query = await channel.messages.fetch({message: targetId})
        const raw = query.content

        const translated = await translate(query, {to: "en"})

        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setColor("Blue")
                .setTitle("Translate")
                .addFields([
                    {name: "Raw", value: "```" + raw + "```"},
                    {name: 'translated', value:"```" + translated.text + "```"}
                ])
                .setFooter({text: 'made by ~ karan_xD'})
                .setTimestamp()
            ]
        })
    }
}