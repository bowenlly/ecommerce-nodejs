const mongoose = require("mongoose");
const Schema = mongoose.Schema;



// Data model for users
const orderSchema = new Schema(
  {
    username: {type: String, required: true },
    created: { type: Date, default: Date.now },
    total: mongoose.Decimal128,
    order:[{"product_id":{type:String, required: true, unique: true},"quantity":{type:Number}}]
  }, { versionKey: false }
);


// Export model
module.exports = mongoose.model("order", orderSchema);