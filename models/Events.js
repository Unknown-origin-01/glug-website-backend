const mongoose = require("mongoose")

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        data: buffer,
        contentType: String
    },
    type: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model("Events", EventSchema)