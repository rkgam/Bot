const { Client, ChatInputCommandInteraction } = require("discord.js");

const DBG = require("../../Structures/Schemas/BlacklistG")
const DBU = require("../../Structures/Schemas/BlacklistU");
const EditReply = require("../../Systems/EditReply");

module.exports = {
    name: "blacklist",
    description: "Blacklists a server or member from using the bot",
    UserPerms: ["Administrator"],
    BotPerms: ["Administrator"],
    category: "Owner",
    options: [
        {
            name: "options",
            description: "Choose an option",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Server",
                    value: "server",
                },
                {
                    name: "Member",
                    value: "member"
                }
            ]
        },
        {
            name: "id",
            description: "Provids the ID of the user or the server!",
            type: 3,
            required: true
        },
        {
            name: "reason",
            description: 'provide a reason',
            type: 3,
            required: false
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute( interaction, client) {

        await interaction.deferReply({ ephemeral: true })


        const { user, options } = interaction

        if (user.id !== "931189125833453608") return EditReply(interaction, "<a:wrong:1123202831537668216>", `This command is classified!`)

        const Options = options.getString("options")
        const ID = options.getString("id")
        const Reason = options.getString("reason") || "No reason provided"


        if (isNaN(ID)) return EditReply(interaction, "<a:error:1124222961856036885>", `Id is supposed to be a number!`)

        switch (Options) {
            case "server": {

                const Guild = client.guilds.cache.get(ID)

                let Gname;
                let GID;

                if (Guild) {

                    Gname = Guild.name
                    GID = Guild.id

                } else {

                    Gname = "Unkown"
                    GID = ID

                }

                let Data = await DBG.findOne({ Guild: GID }).catch(err => { })

                if (!Data) {

                    Data = new DBG({
                        Guild: GID,
                        Reason,
                        Time: Date.now()
                    })

                    await Data.save()

                    EditReply(interaction, "<a:SG_RightTick:1122813133631782992>", `Successfully added **${Gname} (${GID})** in Blacklisted servers, \n\n For the reason is: **${Reason}**`)

                } else {

                    await Data.deleteOne()

                    EditReply(interaction, "<a:SG_RightTick:1122813133631782992>", `Successfully removed **${Gname} (${GID})** from the blacklisted server`)
                }
            }
                break;  

            case "member": {

                let Member
                let mName
                let MID

                const User = client.users.cache.get(ID)

                if(User) {

                    Member = User
                    mName = User.tag
                    MID = User.id

                } else {

                    Member = "Unknown User #0000"
                    mName =  "Unknown User #0000"
                    MID = ID

                }

                let Data = await DBU.findOne({User: MID}).catch(err => { })

                if(!Data){

                    Data = new DBU({

                        User: MID,
                        Reason,
                        Time: Date.now()
                    })

                    await Data.save()

                    EditReply(interaction, "<a:SG_RightTick:1122813133631782992>", `Successfully added **${Member} (${mName} | ${MID})** in blacklisted members \n\n for the reason: **${Reason}`)

                } else {

                    await Data.deleteOne()

                    EditReply(interaction, "<a:SG_RightTick:1122813133631782992>", `Successfully removed **${Member} (${mName} | ${MID})** from the blacklisted member`)
                }

            }

            break;
        }
    }
}