const {Schema, model} = require("mongoose");

module.exports = model("genrallogs", new Schema({
    Guild: String,
    MemberRole: Boolean,
    ChannelTopic: Boolean,
    ChannelStatus: Boolean,
    MemberNick: Boolean,
    MemberBoost: Boolean,
    RoleStatus: Boolean,
    EmojiStatus: Boolean,
    MemberBan: Boolean,
}))
