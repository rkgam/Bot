const {Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const DB = require("../../Structures/Schemas/Verification");
const EditReply = require("../../Systems/EditReply");

module.exports = {
    name: "verify",
    description: "Inbuild verification system",
    UserPerms: ["ManageGuild"],
    category: "Modreation",
    options: [
        {
            name: "role",
            description: "select the verified members role",
            type: 8,
            required: true
        },
        {
            name: "channel",
            description: "select the channel where the system will be sent",
            type: 7,
            required: false
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ephemeral: true})

        const {options, guild, channel} = interaction;

        const role = options.getRole("role");
        const Channel = options.getChannel("channel") || channel

        let Data = await DB.findOne({Guild: guild.id}).catch(err => {  })

        if(!Data) {

            Data = new DB({
                Guild: guild.id,
                Role: role.id
            })

            await Data.save()
        } else {

            Data.Role = role.id
            await Data.save();
        }

        Channel.send({

            embeds: [
                new EmbedBuilder()
                .setColor("Blue")
                .setTitle(` ✅ | Verificaction`)
                .setDescription("Click the button to verify")
            ],
            components: [
                new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                    .setCustomId("verify")
                    .setLabel("Verify")
                    .setStyle(ButtonStyle.Secondary)
                )
            ]
        })

        return EditReply(interaction, '<a:SG_RightTick:1122813133631782992>', `Successfully sent verification panel in ${Channel}`)
    }
}