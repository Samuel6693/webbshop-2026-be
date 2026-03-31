import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }, 
    size: {
        type: Number,
        required: true,
        min: 36,
        max: 50
    },
    stock: {
        type: Number,
        default: 0
    }
});

variantSchema.index({ productId: 1, size: 1}, { unique: true});

const Variant = mongoose.model('Variant', variantSchema);

export default Variant;
