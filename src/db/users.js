import User from "../models/User.js";

export async function getAllUsers() {
  return await User.find().select("-password"); // Exclude password field from the result
}

export async function getUserById(id) {
  return await User.findById(id).select("-password"); // Exclude password field from the result
}

export async function findUserByEmail(email) {
  return await User.findOne({ email });
}

export async function findSafeUserByEmail(email) {
  return await User.findOne({ email }).select("-password"); // Exclude password field from the result
}

export async function createUser(userData) {
  const user = new User(userData);
  await user.save();
  return user;
}

export async function updateUser(id, updateData) {
  return await User.findByIdAndUpdate
  (id, 
  updateData, 
  { new: true, runValidators: true }) // run validators to ensure email and password are valid if the route was used with another route that doesn't check for valid email and password  
  .select("-password"); 
}

export async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}

// Additional functions for managing user wishlist
export async function getUserWishlist(userId) {
  return await User.findById(userId)
  .populate("wishlist.product")
  .populate("wishlist.variant");
}

// Add a product (and optional variant) to the user's wishlist
export async function addToWishlist(userId, productId, variantId = null) {
  const user = await User.findById(userId);

  if (!user) return null;

  const alreadyInWishlist = user.wishlist.some((item) => {
      const sameProduct = item.product.toString() === productId;
      const sameVariant = (item.variant?.toString() || null) === (variantId || null);

    return sameProduct && sameVariant;
  });

  if (alreadyInWishlist) {
    return user; 
  }

  await user.save();

  return await User.findById(userId)
    .populate("wishlist.product")
    .populate("wishlist.variant");
}

// Remove a product (and optional variant) from the user's wishlist
export async function removeFromWishlist(userId, productId, variantId = null) {
  const user = await User.findById(userId);

  if (!user) return null;

  user.wishlist = user.wishlist.filter((item) => {
    const sameProduct = item.product.toString() === productId;
    const sameVariant = (item.variant?.toString() || null) === (variantId || null);

    return !(sameProduct && sameVariant);
  });

  await user.save();

  return await User.findById(userId)
    .populate("wishlist.product")
    .populate("wishlist.variant");
}

