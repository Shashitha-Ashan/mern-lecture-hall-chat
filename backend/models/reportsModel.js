const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  reporterid: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  messageid: {
    type: mongoose.Types.ObjectId,
    ref: "message",
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  resolve: {
    type: Boolean,
    default: false,
  },
});

const Report = mongoose.model("reports", reportSchema);

module.exports = Report;
