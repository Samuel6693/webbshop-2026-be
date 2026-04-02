import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import Variant from "../models/Variant.js";

dotenv.config();

const productsData = [
{
name: "Nike Air Jordan 1 Retro High",
description: "Classic high-top sneaker with premium leather.",
price: 1899,
image: "https://picsum.photos/400?1",
dropDate: new Date("2026-04-10T09:00:00.000Z"),
status: "upcoming",
},
{
name: "Adidas Yeezy Boost 350 V2",
description: "Iconic Yeezy silhouette with Boost cushioning.",
price: 2499,
image: "https://picsum.photos/400?2",
dropDate: new Date("2026-04-03T08:00:00.000Z"),
status: "live",
},
{
name: "Nike Dunk Low Panda",
description: "Minimal black and white everyday sneaker.",
price: 1299,
image: "https://picsum.photos/400?3",
dropDate: new Date("2026-04-04T10:00:00.000Z"),
status: "live",
},
{
name: "New Balance 550 White Green",
description: "Retro basketball-inspired streetwear shoe.",
price: 1499,
image: "https://picsum.photos/400?4",
dropDate: new Date("2026-03-29T09:30:00.000Z"),
status: "sold_out",
},
{
name: "Nike Air Force 1 Triple White",
description: "Timeless all-white staple.",
price: 1199,
image: "https://picsum.photos/400?5",
dropDate: new Date("2026-04-02T07:00:00.000Z"),
status: "live",
},
{
name: "Adidas Forum Low",
description: "Classic low-top with vintage vibes.",
price: 1099,
image: "https://picsum.photos/400?6",
dropDate: new Date("2026-04-12T11:00:00.000Z"),
status: "upcoming",
},
{
name: "Nike Air Max 97 Silver Bullet",
description: "Futuristic design with full-length Air unit.",
price: 1999,
image: "https://picsum.photos/400?7",
dropDate: new Date("2026-04-05T08:30:00.000Z"),
status: "live",
},
{
name: "Puma RS-X Tech",
description: "Chunky sneaker with bold colors.",
price: 1399,
image: "https://picsum.photos/400?8",
dropDate: new Date("2026-04-01T14:00:00.000Z"),
status: "live",
},
{
name: "Converse Chuck 70 High",
description: "Premium canvas with vintage styling.",
price: 899,
image: "https://picsum.photos/400?9",
dropDate: new Date("2026-03-25T12:00:00.000Z"),
status: "sold_out",
},
{
name: "Vans Old Skool Black White",
description: "Skate classic with signature stripe.",
price: 799,
image: "https://picsum.photos/400?10",
dropDate: new Date("2026-04-06T09:00:00.000Z"),
status: "live",
},
{
name: "Nike Blazer Mid 77 Vintage",
description: "Retro basketball look with suede details.",
price: 1099,
image: "https://picsum.photos/400?11",
dropDate: new Date("2026-04-15T10:30:00.000Z"),
status: "upcoming",
},
{
name: "Adidas Superstar Core Black",
description: "Legendary shell-toe sneaker.",
price: 999,
image: "https://picsum.photos/400?12",
dropDate: new Date("2026-04-07T08:00:00.000Z"),
status: "live",
},
];

const sizes = [38, 39, 40, 41, 42, 43, 44, 45];

async function seed() {
await mongoose.connect(process.env.MONGODB_URI);

await Product.deleteMany();
await Variant.deleteMany();

const createdProducts = await Product.insertMany(productsData);

const variantsData = [];

for (const product of createdProducts) {
const numberOfVariants = Math.floor(Math.random() * 3) + 4;
const shuffledSizes = sizes.sort(() => 0.5 - Math.random()).slice(0, numberOfVariants);

for (const size of shuffledSizes) {
  variantsData.push({
    productId: product._id,
    size,
    stock: Math.floor(Math.random() * 10),
  });
}

}

await Variant.insertMany(variantsData);

await mongoose.connection.close();
}

seed();
