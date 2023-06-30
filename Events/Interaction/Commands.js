const { InteractionType, Client, CommandInteraction, EmbedBuilder } = require("discord.js");
const {ApplicationCommand} = InteractionType;
const BlackListGuildDB = require("../../Structures/Schemas/BlacklistG");
const BlackListUserDB = require("../../Structures/Schemas/BlacklistU");
const Reply = require("../../Systems/Reply")

module.exports = {
    name: 'interactionCreate',

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const {user, guild, commandName, member, type} = interaction;

        if(!guild || user.bot) return
        if(type !== ApplicationCommand) return

        const BlackListGuildData = await BlackListGuildDB.findOne({Guild: guild.id}).catch(err => { })
        const BlackListUserData = await BlackListUserDB.findOne({User: user.id}).catch(err => { })

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setThumbnail(guild.iconURL())
        .setTimestamp()
        .setFooter({text: `Made By ~ karan_xD`})

        const command = client.commands.get(commandName)

        if(!command) return Reply(interaction, "❌", `An error occured while running the command!`, true) && client.commands.delete(commandName);

        if(BlackListGuildData) return interaction.reply({
            embeds: [
                embed.setTitle("Server BlackListed")
                .setDescription(`Your server has been blacklisted from using this bot on <t:${parseInt(BlackListGuildData.Time / 1000)}:R>\n\n for the reason: **${BlackListGuildData.Reason}**`)
            ],
            ephemeral: true
        })

        if(BlackListUserData) return interaction.reply({
            embeds: [
                embed.setTitle("User BlackListed")
                .setDescription(`Your have  been blacklisted from using this bot on <t:${parseInt(BlackListUserData.Time / 1000)}:R>\n\n for the reason: **${BlackListUserData.Reason}**`)
            ],
            ephemeral: true
        })

        if(command.UserPerms && command.UserPerms.length !== 0) if(!member.permissions.has(command.UserPerms)) return Reply(interaction, "❌", `You need \`${command.UserPerms.join(", ")}\` permission(s) to execute this command`, true)
        if(command.BotPerms && command.BotPerms.length !== 0) if(!member.permissions.has(command.BotPerms)) return Reply(interaction, "❌", `I need \`${command.UserPerms.join(", ")}\` permission(s) to execute this command`, true)

        command.execute(interaction, client);
    }
}