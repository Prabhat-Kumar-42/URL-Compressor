const { default: mongoose } = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      require: true,
      unique: true,
    },
    visitHistory: [{ timestamp: { type: Number } }],
  },
  { timestamp: true },
);

const URL = mongoose.model("url", urlSchema);
module.exports = {
  URL,
};
