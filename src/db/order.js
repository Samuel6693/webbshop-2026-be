import Order from "../models/Order.js";

export async function createOrder(orderData) {
    return await Order.create(orderData);
}

export async function getAllOrdersByUserId(userId) {
    return await Order.find({ user: userId })
    .populate("product")
    .populate("variant")
    .sort({ createdAt: -1 });
}
