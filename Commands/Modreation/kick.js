const { Client, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const Reply = require("../../Systems/Reply");
const EditReply = require("../../Systems/EditReply");
const ms = require("ms");

module.exports = {
    name: 'kick',
    description: 'kick member from the server',
    UserPerms: ["KickMembers"],
    BotPerms: ["KickMembers"],
    category: "Modreation",
    options: [
        { 
            name: "user",
            description: "select the user",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "reason",
            description: "provide a reason",
            type: 3,
            required: false
        },
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        const { options, user, guild } = interaction;

        const member = options.getMember("user");
        const reason = options.getString("reason") || "no reason provided";

        if (member.id === user.id) return EditReply(interaction, "<a:wrong:1123202831537668216>", "You can't kick yourself!")
        if (guild.ownerId === member.id) return EditReply(interaction, "<a:wrong:1123202831537668216>", `You can't kick the server owner`)
        if (guild.members.me.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, "<a:wrong:1123202831537668216>", `You can't kick a member of your same level or higher!`)
        // if (interaction.member.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, "<a:wrong:1123202831537668216>", `I can't kick a member of your same level or higher!`)

        const embed = new EmbedBuilder()
            .setColor("Blue")

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("kick-yes")
                .setLabel("Yes"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("kick-no")
                .setLabel("No")

        )

        const Page = await interaction.editReply({

            embeds: [
                embed.setDescription(`**<a:yellow_warning_animated:1122813038383353926> | Do you really want to kick this member?**`)
            ],
            components: [row]

        })

        const col = await Page.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: ms("15s")
        })

        col.on("collect", i => {

            if (i.user.id !== user.id) return

            switch (i.customId) {
                case "kick-yes": {
                    member.kick({ reason })

                    interaction.editReply({
                        embeds: [
                            embed.setDescription(`<a:SG_RightTick:1122813133631782992> | ${member} has been kicked for : **${reason}**`)
                        ],
                        components: []
                    })

                    // member.createDM();

                    member.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Blue")
                                .setDescription(` You've been kicked from **${guild.name}**`)
                        ]
                    }).catch(err => {

                        if (err.code !== 50007) return console.log(err)

                    })
                }

                    break;

                case "kick-no": {
                    interaction.editReply({
                        embeds: [
                            embed.setDescription(`<a:SG_RightTick:1122813133631782992> | kick request cancelled`)
                        ],
                        components: []
                    })
                }

                break;
            }
        })

        col.on("end", (collected) => {

            if(collected.size > 0) return 

            interaction.editReply({
                embeds: [
                    embed.setDescription(`<a:wrong:1123202831537668216> | you didn't provide a valid response in time!`)
                ],
                components: []
            })
        })
    }
}