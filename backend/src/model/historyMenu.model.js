const mongoose = require("mongoose");

const historyMenuSchema = new mongoose.Schema({
  mealType: { type: String, enum: ["lunch", "dinner"], required: true },
  // date: { type: Date, required: true },
  
  listOfSabjis: [
    {
      name: String,
      imageUrl: String,
      isSpecial:{type: Boolean, default: false}
    }
  ],
  
  baseOptions: {
    type: [String],
    default: ["5 Roti", "3 Roti + Rice"]
  },
  
  basePrice: {type: Number, default: 60},
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("historyMenu", historyMenuSchema);
