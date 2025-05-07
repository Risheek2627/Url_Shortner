const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    require: true,
    unique: true,
  },
  longUrl: {
    type: String,
    require: true,
  },
  shortUrl: {
    type: String,
    require: true,
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  expiry: {
    type: Date,
    default: () => Date.now() + 24 * 60 * 60 * 1000,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Url", urlSchema);
