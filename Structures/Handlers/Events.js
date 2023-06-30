const { Events } = require("../Validation/EventNames");
const fs = require("fs")
// const Ascii = require("ascii-table")


module.exports = async (client, PG, Ascii) => {

    const Table = new Ascii("Events Loaded");

    const eventfile = await PG(`${process.cwd()}/Events/*/*.js`)

    eventfile.map(async file => {
        const event = require(file)

        if (!Events.includes(event.name) || !event.name) {
            const L = file.split("/")

            await Table.addRow(`${event.name || "MISSING"}`, `Event Name is either invalid or missing: ${L[6] + '/' + L[7]}`)
            return
        }

        if (event.once) client.once(event.name, (...args) => event.execute(...args, client))
        else client.on(event.name, (...args) => event.execute(...args, client))

        await Table.addRow(event.name, "SUCCESS")
    })

    
console.log(Table.toString());
}



