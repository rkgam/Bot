const { Client, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const Reply = require("../../Systems/Reply");
const EditReply = require("../../Systems/EditReply");
const ms = require("ms");

module.exports = {
    name: 'ban',
    description: 'ban member from the server',
    UserPerms: ["BanMembers"],
    BotPerms: ["BanMembers"],
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

        if (member.id === user.id) return EditReply(interaction, "<a:wrong:1123202831537668216>", "You can't ban yourself!")
        if (guild.ownerId === member.id) return EditReply(interaction, "<a:wrong:1123202831537668216>", `You can't ban the server owner`)
        if (guild.members.me.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, "<a:wrong:1123202831537668216>", `You can't ban a member of your same level or higher!`)
        if (interaction.member.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, "<a:wrong:1123202831537668216>", `I can't ban a member of your same level or higher!`)

        const embed = new EmbedBuilder()
            .setColor("Blue")

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("ban-yes")
                .setLabel("Yes"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("ban-no")
                .setLabel("No")

        )

        const Page = await interaction.editReply({

            embeds: [
                embed.setDescription(`**<a:yellow_warning_animated:1122813038383353926> | Do you really want to ban this member?**`)
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
                case "ban-yes": {
                    member.ban({ reason })

                    interaction.editReply({
                        embeds: [
                            embed.setDescription(`<a:SG_RightTick:1122813133631782992> | ${member} has been banned for : **${reason}**`)
                        ],
                        components: []
                    })

                    member.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Blue")
                                .setDescription(` You've been banned from **${guild.name}**`)
                        ]
                    }).catch(err => {

                        if (err.code !== 50007) return console.log(err)

                    })
                }

                    break;

                case "ban-no": {
                    interaction.editReply({
                        embeds: [
                            embed.setDescription(`<a:SG_RightTick:1122813133631782992> | ban request cancelled`)
                        ],
                        components: []
                    })
                }

                    break;
            }
        })

        col.on("end", (collected) => {

            if (collected.size > 0) return

            interaction.editReply({
                embeds: [
                    embed.setDescription(`<a:wrong:1123202831537668216> | you didn't provide a valid response in time!`)
                ],
                components: []
            })
        })
    }
}