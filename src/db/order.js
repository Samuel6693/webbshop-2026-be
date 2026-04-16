import Order from "../models/Order.js";

export async function createOrder(orderData) {
    return await Order.create(orderData);
}

export async function getAllOrders() {
    return await Order.find()
    .sort({ createdAt: -1 });
}

export async function getAllOrdersByUserId(userId) {
    return await Order.find({ "user.id": userId })
    .sort({ createdAt: -1 });
}

export async function updateOrderStatusById(id, status) {
    return await Order.findByIdAndUpdate(
        id, 
        { status }, 
        { new: true, runValidators: true }
    );
}

export async function updateOrderById(id, updateData) {
    return await Order.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );
}

export async function deleteOrderById(id) {
    return await Order.findByIdAndDelete(id);
}
