const {Schema, model} = require("mongoose");

module.exports = model("loggerChannel", new Schema({
    Guild: String,
    Channel: String
}))
