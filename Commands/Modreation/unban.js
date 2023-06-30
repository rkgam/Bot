const { Client, ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const Reply = require("../../Systems/Reply");
const EditReply = require("../../Systems/EditReply");
const ms = require("ms");

module.exports = {
    name: 'unban',
    description: 'unban member from the server',
    UserPerms: ["BanMembers"],
    BotPerms: ["BanMembers"],
    category: "Modreation",
    options: [
        {
            name: "user-id",
            description: "provide the user-id",
            type: 3,
            required: true
        },
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })

        const { options, user, guild } = interaction;

        const id = options.getString("user-id");
        if(isNaN(id)) return EditReply(interaction, "<a:wrong:1123202831537668216>", `please provide a valid id in members!`)

        const banmembers = await guild.bans.fetch()
        if(!banmembers.find(x => x.user.id === id)) return EditReply(interaction,  "<a:wrong:1123202831537668216>", `The user is not banned yet!`);
        const embed = new EmbedBuilder()
            .setColor("Blue")

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("unban-yes")
                .setLabel("Yes"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("unban-no")
                .setLabel("No")

        )

        const Page = await interaction.editReply({

            embeds: [
                embed.setDescription(`**<a:yellow_warning_animated:1122813038383353926> | Do you really want to unban this member?**`)
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
                case "unban-yes": {
                   guild.members.unban(id)

                    interaction.editReply({
                        embeds: [
                            embed.setDescription(`<a:SG_RightTick:1122813133631782992> | user is now unbanned`)
                        ],
                        components: []
                    })

                    
                }

                    break;

                case "unban-no": {
                    interaction.editReply({
                        embeds: [
                            embed.setDescription(`<a:SG_RightTick:1122813133631782992> | unban request cancelled`)
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