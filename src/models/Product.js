import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    required: true,
  },
  dropDate: {
    type: Date,
    required: true,
  }, 
  status: {
    type: String,
    enum: ["Upcoming", "live", "sold_out"]
  }
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;