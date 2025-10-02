const mongoose = require('mongoose');

const amdin =  mongoose.Schema({
    email:String,
    password:String,
})

module.exports = mongoose.model("amdin", amdin)