const { Perms } = require("../Validation/Permissions");
const { Client } = require("discord.js");
// const Ascii = require("ascii-table")
const ms = require("ms");
// const { guilds } = require("..");
const fs = require("fs")

/**
 * @param {Client} client
 */

module.exports = async (client, PG, Ascii) => {

    const Table = new Ascii("Commands Loaded")

    let commandsArray = [];

    const commandFile = await PG(`${process.cwd()}/Commands/*/*.js`);

    commandFile.map(async (file) => {

        const command = require(file);

        if (!command.name) return Table.addRow(file.split("/")[7], "FAILED", "Missing a Name")
        if (!command.context && !command.description) return Table.addRow(command.name, "FAILED", "Missing a description");
        if (command.UserPerms)
            if (command.UserPerms.every(Perms => Perms.includes(Perms))) command.default_member_permissions = false
            else return Table.addRow(command.name, "FAILED", "User permission is invalid")

        client.commands.set(command.name, command)
        commandsArray.push(command)

        await Table.addRow(command.name, "SUCCESS")
    })

    console.log(Table.toString())


    client.on("ready", () => {

        setInterval(() => {
            client.guilds.cache.forEach(guild => {
                guild.commands.set(commandsArray)
            })
        }, ms("5s"))
    })

}
// const CommandFiles = await fs.readdirSync(`${process.cwd()}/Commands/*/*.js`);



