const { Schema, model } = require("mongoose");
const { generate } = require("shortid");

const schema = new Schema({
    uid:{
        type:String,
        default:generate,
        unique:true,
        index:true
    },
    name:{
        type:String,
        required:true
    },
    address:{
        type:String
    }
});

const schools = model("schools", schema);

module.exports = { schools };