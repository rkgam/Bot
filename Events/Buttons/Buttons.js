const {Client, MessageComponentInteraction, InteractionType} = require("discord.js");
const DB = require("../../Structures/Schemas/Verification");
const EditReply = require("../../Systems/EditReply");

module.exports = {
    name: 'interactionCreate',

    /**
     * @param {Client} client
     * @param {MessageComponentInteraction} interaction
     */
    async execute(interaction, client) {

        const {guild, customId, member, type} = interaction;

        if(type !== InteractionType.MessageComponent) return

        const CustomId = ["verify"]
        if(!CustomId.includes(customId)) return

        await interaction.deferReply({ephemeral: true})

        const Data = await DB.findOne({Guild: guild.id}).catch((err) => { })
        if(!Data) return EditReply(interaction, "<a:wrong:1123202831537668216>", `Couldn't find any data!`)

        const Role = guild.roles.cache.get(Data.Role)

        if(member.roles.cache.has(Role.id)) return EditReply(interaction, "<a:wrong:1123202831537668216>", "You're already verified as a member")

        await member.roles.add(Role)

        EditReply(interaction, "<a:SG_RightTick:1122813133631782992>", "You're now verified as a member")
    }
}