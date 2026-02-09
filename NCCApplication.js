const mongoose = require("mongoose");

const NCCSchema = new mongoose.Schema({
  name: String,
  gender: String,
  mobile: String,
  email: String,
  address: String,
  job: String,
  qualification: String,
  institute: String,
  jobPortal: String,
  purpose: String,
  applicationDate: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("NCCApplication", NCCSchema);
