import Product from "../models/Product.js";
import Variant from "../models/Variant.js"


// GET all productts
export async function getAllProducts() {
  return await Product.find();
}

// GET product by id
export async function getProductById(id) {
        return await Product.findById(id);
   
}

// GET variant by productId
export async function getProductVariant(productId) {
    return await Variant.find({productId});

}

export async function createProduct(productData) {
    const product = new Product(productData);
    await product.save();
    return product;

}

export async function updateProductById(id, productData) {
    return await Product.findByIdAndUpdate(id, productData, {
        new: true,
        runValidators: true
    });
}

export async function deleteProductById(id) {
    return await Product.findByIdAndDelete(id);
}

