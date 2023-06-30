const { Client, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const EditReply = require("../../Systems/EditReply");

module.exports = {
    name: 'simulate',
    description: 'simulate the join event',
    UserPerms: ["Administrator"],
    BotPerms: ["Administrator"],
    categoty: "Owner",
    options: [
        {
            name: "options",
            description: "Choose an option",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Join",
                    value: 'join'
                },
                {
                    name: "Leave",
                    value: 'leave',
                }

            ]
        }
    ],

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {

        await interaction.deferReply({ephemeral: true})

        const {options, user, member} = interaction;

        const Options = options.getString("options")

        if(user.id !== "931189125833453608") return EditReply(interaction, "<a:wrong:1123202831537668216>", 'This command is only for owner!!')

        switch(Options) {

            case "join": {

                EditReply(interaction, "<a:SG_RightTick:1122813133631782992>", `Simulated join event`)

                client.emit("guildMemberAdd", member)
            }
            break;

            case "leave": {

                EditReply(interaction, "a:SG_RightTick:1122813133631782992", `simulated leave event`)

                client.emit("guildMemberRemove", member)
            }
             break;
        }
    }
}