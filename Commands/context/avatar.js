const {Client, ContextMenuCommandInteraction, ApplicationCommandType, EmbedBuilder} = require("discord.js")

module.exports = {
    name: 'avatar',
    type: ApplicationCommandType.User,
    context: true,
    category: "context", 

    /**
     * @param {ContextMenuCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {

        await interaction.deferReply();

        const { guild, targetId } = interaction;

        const target = await guild.members.cache.get(targetId)

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setAuthor({name: `${target.user.username}'s Avatar`, iconURL: target.user.displayAvatarURL()})
        .setImage(target.user.displayAvatarURL({size: 512, extension:"png"}))
        .setFooter({text: "Avatar by ~ karan_xD"})
        .setTimestamp()

        return interaction.editReply({embeds: [embed]})
    }
}

