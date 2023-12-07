const { Schema, model } = require("mongoose");
const { generate } = require("shortid");

const schema1 = new Schema({
  uid: {
    type: String,
    unique: true,
    default: generate,
    index: true,
  },
  name: {
    type: String,
    unique: false,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  password: {
    type: String,
    unique: false,
    required: true,
  },
  age: {
    type: Number,
  },
  schoolId: {
    type: String,
    ref: "schools",
    required: true,
  }
});

const users = model("users", schema1);

module.exports = { users };
