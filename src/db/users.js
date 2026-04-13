import User from "../models/User.js";

export async function createUser(userData) {
  const user = new User(userData);
  await user.save();
  return user;
}

export async function findUserByEmail(email) {
  return await User.findOne({ email });
}

export async function findUserById(id) {
  return await User.findById(id);
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

