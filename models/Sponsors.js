const mongoose = require("mongoose")

const SponsorSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    partnerType: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Sponsors", SponsorSchema)