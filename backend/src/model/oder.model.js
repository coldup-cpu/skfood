const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type:String, required: true },
  menuId: { type:String, required: true },
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },

  sabjisSelected: [String], // max 2 items
  base: { type: String, enum: ["roti", "roti+rice"], required: true },
  extraRoti: { type: Number, default: 0 },
  isSpecial: { type: Boolean, default: false },
  quantity: { type: Number, default: 1, min: 1, max: 5 },

  totalPrice: { type: Number, required: true },
  tipMoney: { type: Number, required: false },

  address: {
    label: String,
    address: String,
    lat: Number,
    lng: Number
  },

  otp: { type: String, required: true },

  status: { 
    type: String, 
    enum: ["Confirmed", "on-the-way", "delivered"], 
    default: "Confirmed" 
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
