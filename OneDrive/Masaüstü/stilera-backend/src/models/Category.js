const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  values: [{ type: String, required: true }],
});

module.exports = mongoose.model("Attribute", attributeSchema);
