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

export async function publishScheduledProducts() {
    const productsToPublish = await Product.find({
        status: "upcoming",
        dropDate: { $lte: new Date() } // Find products with dropDate in the past or now
    });
    if (productsToPublish.length === 0) {
        return [];
    }
    const productIds = productsToPublish.map(product => product._id);

    await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { status: "live" } }
    );

    return productsToPublish.map((product) => ({ ...product.toObject(), status: "live" })); // Return the list of published products
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

