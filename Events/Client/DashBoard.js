// Define Packages
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const SoftUI = require('dbd-soft-ui');
const config = require('../../config.json');
let DBD = require('discord-dashboard');
let WelcomeDB = require("../../Structures/Schemas/welcome");
const GenralLogsDB = require("../../Structures/Schemas/LogsChannel");
const LogsSwitchDB = require("../../Structures/Schemas/GenralLogs")

// const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// client.login(config.discord.token);

module.exports = {
    name: 'ready',

    /**
     * @param {Client} client
     */

    async execute(client) {

        const { user } = client

        let Information = []
        let Modreation = []

        const Info = client.commands.filter(x => x.category === "Information");
        const mod = client.commands.filter(x => x.category === "Modreation");

        CommandPush(Info, Information)
        CommandPush(mod, Modreation)

        await DBD.useLicense("a77d2aa8-03cd-4565-88a5-6323369c2341");
        DBD.Dashboard = DBD.UpdatedClass();

        const Dashboard = new DBD.Dashboard({
            port: config.dbd.port,
            client: config.discord.client,
            redirectUri: `http://localhost:80/discord/callback`,
            domain: config.dbd.domain,
            ownerIDs: config.dbd.ownerIDs,
            useThemeMaintenance: true,
            useTheme404: true,
            bot: client,
            theme: SoftUI({
                customThemeOptions: {
                    index: async ({ req, res, config }) => {
                        return {
                            values: [],
                            graph: {},
                            cards: [],
                        }
                    },
                },
                websiteName: "Assistants",
                colorScheme: "pink",
                supporteMail: "support@support.com",
                icons: {
                    favicon: 'https://assistantscenter.com/wp-content/uploads/2021/11/cropped-cropped-logov6.png',
                    noGuildIcon: "https://pnggrid.com/wp-content/uploads/2021/05/Discord-Logo-Circle-1024x1024.png",
                    sidebar: {
                        darkUrl: 'https://assistantscenter.com/img/logo.png',
                        lightUrl: 'https://assistanscenter.com/img/logo.png',
                        hideName: true,
                        borderRadius: false,
                        alignCenter: true
                    },
                },
                index: {
                    card: {
                        category: "Soft UI",
                        title: "Assistants - The center of everything",
                        description: "Assistants Discord Bot management panel. <b><i>Feel free to use HTML</i></b>",
                        image: "/img/soft-ui.webp",
                        link: {
                            enabled: true,
                            url: "https://google.com"
                        }
                    },
                    graph: {
                        enabled: true,
                        lineGraph: false,
                        title: 'Memory Usage',
                        tag: 'Memory (MB)',
                        max: 100,
                    },
                },
                sweetalert: {
                    errors: {},
                    success: {
                        login: "Successfully logged in.",
                    }
                },
                preloader: {
                    image: "/img/soft-ui.webp",
                    spinner: false,
                    text: "Page is loading",
                },
                commands: [
                    {
                        category: "Information",
                        subTitle: "Information Commands",
                        aliasesDisabled: false,
                        list: Information
                    },
                    {
                        category: "Modreation",
                        subTitle: "Modreation Commands",
                        aliasesDisabled: false,
                        list: Modreation
                    }
                ],
            }),
            settings: [

                //welcome system

                {
                    categoryId: "welcome",
                    categoryName: "welcome system",
                    categoryDescription: "setup the welcome channel",
                    categoryOptionsList: [
                        {
                            optionId: "welch",
                            optionName: 'welcome system',
                            optionDescription: "setup the welcome channel",
                            optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildText]),
                            getActualSet: async ({ guild }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Channel
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = null

                                if (!data) {

                                    data = new WelcomeDB({
                                        Guild: guild.id,
                                        Channel: newData,
                                        DM: false,
                                        DMMessage: null,
                                        Content: false,
                                        Embed: false
                                    })

                                    await data.save();

                                } else {

                                    data.Channel = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "weldm",
                            optionName: 'welcome DM',
                            optionDescription: "Enable or Disable Welcome Messages (in DM)",
                            optionType: DBD.formTypes.switch(false),
                            getActualSet: async ({ guild }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.DM
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new WelcomeDB({
                                        Guild: guild.id,
                                        Channel: null,
                                        DM: newData,
                                        DMMessage: null,
                                        Content: false,
                                        Embed: false
                                    })

                                    await data.save();

                                } else {

                                    data.DM = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "weldmopt",
                            optionName: 'welcome DM Option',
                            optionDescription: "Send Content",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    first: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Content
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new WelcomeDB({
                                        Guild: guild.id,
                                        Channel: null,
                                        DM: false,
                                        DMMessage: null,
                                        Content: newData,
                                        Embed: false
                                    })

                                    await data.save();

                                } else {

                                    data.Content = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "welcembed",
                            optionName: '',
                            optionDescription: "Send Embed",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    last: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Embed
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new WelcomeDB({
                                        Guild: guild.id,
                                        Channel: null,
                                        DM: false,
                                        DMMessage: null,
                                        Content: false,
                                        Embed: newData
                                    })

                                    await data.save();

                                } else {

                                    data.Embed = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "weldmsg",
                            optionName: 'welcome message (In DM)',
                            optionDescription: "Send a message to DM of newly joined member!",
                            optionType: DBD.formTypes.embedBuilder({
                                username: user.username,
                                avatarURL: user.avatarURL(),
                                defaultJson: {
                                    content: "welcome ",
                                    embed: {
                                        description: "Welcome "
                                    }
                                }
                            }),

                            getActualSet: async ({ guild }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.DMMessage
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new WelcomeDB({
                                        Guild: guild.id,
                                        Channel: null,
                                        DM: false,
                                        DMMessage: newData,
                                        Content: false,
                                        Embed: false
                                    })

                                    await data.save();

                                } else {

                                    data.DMMessage = newData
                                    await data.save()
                                }

                                return
                            }
                        },

                    ]
                },
                {
                    categoryId: "logs",
                    categoryName: "logs system",
                    categoryDescription: "setup hannel for genral & invite logger",
                    categoryOptionsList: [
                        {
                            optionId: "gench",
                            optionName: 'genral logger system',
                            optionDescription: "set or reset the server's logger channel",
                            optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildText]),
                            getActualSet: async ({ guild }) => {
                                let data = await GenralLogsDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.Channel
                                else return null
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await GenralLogsDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = null

                                if (!data) {

                                    data = new GenralLogsDB({
                                        Guild: guild.id,
                                        Channel: newData,
                                    })

                                    await data.save();

                                } else {

                                    data.Channel = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "memrole",
                            optionName: 'configure logger system',
                            optionDescription: "Member Role",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    first: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.MemberRole
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        MemberRole: newData
                                    })

                                    await data.save();

                                } else {

                                    data.MemberRole = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "memnick",
                            optionName: '',
                            optionDescription: "Member Nickname",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.MemberNick
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        MemberNick: newData
                                    })

                                    await data.save();

                                } else {

                                    data.MemberNick = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "chtp",
                            optionName: '',
                            optionDescription: "Channel Tpoic",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.ChannelTopic
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        ChannelTopic: newData
                                    })

                                    await data.save();

                                } else {

                                    data.ChannelTopic = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "membst",
                            optionName: '',
                            optionDescription: "Member Boost",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    last: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.MemberBoost
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        MemberBoost: newData
                                    })

                                    await data.save();

                                } else {

                                    data.MemberBoost = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "memban",
                            optionName: '',
                            optionDescription: "Member Ban",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    last: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.MemberBan
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        MemberBan: newData
                                    })

                                    await data.save();

                                } else {

                                    data.MemberBan = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "emjst",
                            optionName: '',
                            optionDescription: "Emoji Status",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.EmojiStatus
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        EmojiStatus: newData
                                    })

                                    await data.save();

                                } else {

                                    data.EmojiStatus = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "rolest",
                            optionName: '',
                            optionDescription: "Role Status",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.RoleStatus
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        RoleStatus: newData
                                    })

                                    await data.save();

                                } else {

                                    data.RoleStatus = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                        {
                            optionId: "chnst",
                            optionName: '',
                            optionDescription: "channel status",
                            optionType: DBD.formTypes.switch(false),
                            themeOptions: {
                                minimalbutton: {
                                    minimalbutton: true
                                }
                            },
                            getActualSet: async ({ guild }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })
                                if (data) return data.ChannelStatus
                                else return false
                            },
                            setNew: async ({ guild, newData }) => {
                                let data = await LogsSwitchDB.findOne({ Guild: guild.id }).catch(err => { })

                                if (!newData) newData = false

                                if (!data) {

                                    data = new LogsSwitchDB({
                                        Guild: guild.id,
                                        ChannelStatus: newData
                                    })

                                    await data.save();

                                } else {

                                    data.ChannelStatus = newData
                                    await data.save()
                                }

                                return
                            }
                        },
                    ]
                },

            ],
        })
        Dashboard.init();

    }
}



function CommandPush(filterArray, categoryArray) {

    filterArray.forEach(obj => {

        let cmdObject = {
            commandName: obj.name,
            commandUsage: "/" + obj.name,
            commandDescription: obj.description,
            commandAlias: "None"
        }

        categoryArray.push(cmdObject)
    })
};
