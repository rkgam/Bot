const {Client, ChatInputCommandInteraction, EmbedBuilder} = require("discord.js");
const Reply = require("../../Systems/Reply");

module.exports = {
    name: 'ping',
    description: 'disply bot ping',
    category: "Information",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction, client) {
        // const s = new Date();
        return Reply(interaction, "<a:Online:1122545371185422356>", `The current websocket is : \`${client.ws.ping} ms\``, true)
    //     const s = new Date();
    //   await interaction.reply({content: 'pinging...', ephemeral: true, fetchReply: true}).then(async (m) => {
    //     const e = new Date()
    //     const p = e-s;
    //     // const g = message.guild;
    //     const ping = `\`${p} ms\``;

    //     const embed = new EmbedBuilder()
    //     .setTitle('Bot ping')
    //     .setDescription(`<a:Online:1122545371185422356> | Bot ping is: ${ping}`)
    //     .setFooter({text: 'Made by ~ karan_xD', iconURL: interaction.user.displayAvatarURL()})
    //     .setTimestamp();
    //     await interaction.editReply({embeds: [embed]});
        
    //   })
    }
}