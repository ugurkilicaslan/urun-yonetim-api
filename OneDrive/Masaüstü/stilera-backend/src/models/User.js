const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    birthDate: { type: Date },
    gender: { type: String, enum: ["Erkek", "Kadın", "Diğer"] },
    profilePhoto: { type: String },

    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Product modeline referans
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true } // Bu, şemanın ikinci parametresidir (Seçenekler)
);

module.exports = mongoose.model("User", userSchema);
