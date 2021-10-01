const { Schema, model } = require("mongoose");

const ProfileSchema = new Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  birthdate: { type: String, required: true },
  city: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Profile", ProfileSchema);
