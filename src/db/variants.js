import Variant from '../models/Variant.js';

export const getAllVariants = async () => {
    return await Variant.find();
};

export const getVariantsByProductId = async (productId) => {
    return await Variant.find({ productId });
};

export const getVariantById = async (id) => {
    return await Variant.findById(id);
};

export const createVariant = async (variantData) => {   
    const variant = new Variant(variantData);
    return await variant.save();
};

export const updateVariantStock = async (id, stock) => {
    return await Variant.findByIdAndUpdate
    (id, 
    { stock }, 
    { new: true, runValidators: true }); // run validators to ensure stock is not negative if the route was used with another route that doesn't check for negative stock
};

export const deleteVariant = async (id) => {
    return await Variant.findByIdAndDelete(id);
};