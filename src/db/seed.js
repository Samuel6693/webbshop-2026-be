import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Variant from "../models/Variant.js";

dotenv.config();

const imageBaseUrl = (
  process.env.IMAGE_BASE_URL ?? "https://webbshop-2026-be.vercel.app"
).replace(/\/$/, "");

function productImage(filename) {
  return `${imageBaseUrl}/products/${filename}`;
}

const catalog = [
  {
    name: "Nike Air Jordan 1 Retro High OG Chicago Reimagined",
    description:
      "A premium high-top with tumbled leather panels, classic Chicago color blocking, and a shape that works just as well with relaxed denim as it does with tailored streetwear fits. It is built to feel collectible without losing the everyday comfort and durable finish people expect from a modern retro release.",
    price: 2199,
    image: productImage("jordan-1-chicago-reimagined.jpg.png"),
    dropDate: "2026-04-03T23:59:00+02:00",
    status: "live",
    variants: [
      { size: 38, stock: 2 },
      { size: 39, stock: 4 },
      { size: 40, stock: 5 },
      { size: 41, stock: 6 },
      { size: 42, stock: 4 },
      { size: 43, stock: 3 },
    ],
  },
  {
    name: "Nike Dunk Low Panda Essential",
    description:
      "A clean black and white low-top designed for easy daily wear, with smooth leather overlays, reliable cushioning, and a look that stays relevant across seasons. This version keeps the silhouette simple while giving enough structure and comfort for long days in the city.",
    price: 1299,
    image: productImage("dunk-low-panda-essential.jpg.png"),
    dropDate: "2026-04-05T23:59:00+02:00",
    status: "live",
    variants: [
      { size: 37, stock: 3 },
      { size: 38, stock: 6 },
      { size: 39, stock: 7 },
      { size: 40, stock: 8 },
      { size: 41, stock: 5 },
      { size: 42, stock: 4 },
      { size: 43, stock: 2 },
    ],
  },
  {
    name: "Adidas Samba OG Core Black Cloud White",
    description:
      "A slim terrace-inspired classic with soft leather, suede accents, and a low-profile outsole that gives it a sharp and timeless shape. The understated black and white palette makes it easy to pair with everything from cargo trousers to more minimal everyday looks.",
    price: 1199,
    image: productImage("samba-og-core-black-cloud-white.jpg.png"),
    dropDate: "2026-03-29T23:59:00+02:00",
    status: "live",
    variants: [
      { size: 36, stock: 4 },
      { size: 37, stock: 5 },
      { size: 38, stock: 6 },
      { size: 39, stock: 5 },
      { size: 40, stock: 4 },
      { size: 41, stock: 3 },
    ],
  },
  {
    name: "New Balance 550 White Green Vintage",
    description:
      "A retro basketball-inspired silhouette with crisp leather panels, subtle green details, and a sturdy build that gives the pair a premium and slightly nostalgic character. It is an easy choice for anyone who wants a versatile sneaker with a little more presence than a basic court shoe.",
    price: 1499,
    image: productImage("nb-550-white-green-vintage.jpg.png"),
    dropDate: "2026-03-24T23:59:00+02:00",
    status: "sold_out",
    variants: [
      { size: 38, stock: 0 },
      { size: 39, stock: 0 },
      { size: 40, stock: 0 },
      { size: 41, stock: 0 },
      { size: 42, stock: 0 },
    ],
  },
  {
    name: "Nike Air Force 1 07 Triple White",
    description:
      "A dependable wardrobe staple with crisp leather uppers, soft underfoot cushioning, and enough structure to stay clean and sharp throughout repeated wear. This all-white version remains one of the easiest pairs to style, whether the look is casual, sporty, or slightly more polished.",
    price: 1199,
    image: productImage("air-force-1-triple-white.jpg.png"),
    dropDate: "2026-04-01T23:59:00+02:00",
    status: "live",
    variants: [
      { size: 38, stock: 8 },
      { size: 39, stock: 10 },
      { size: 40, stock: 12 },
      { size: 41, stock: 12 },
      { size: 42, stock: 9 },
      { size: 43, stock: 7 },
      { size: 44, stock: 4 },
    ],
  },
  {
    name: "Adidas Campus 00s Grey White",
    description:
      "A wider, skate-inspired take on the Campus line with plush suede, padded details, and a chunky attitude that fits current streetwear styling without feeling overdone. The muted grey upper keeps the pair wearable while the silhouette adds more visual weight than a standard low-top.",
    price: 1299,
    image: productImage("campus-00s-grey-white.jpg.png"),
    dropDate: "2026-04-07T23:59:00+02:00",
    status: "live",
    variants: [
      { size: 37, stock: 2 },
      { size: 38, stock: 4 },
      { size: 39, stock: 5 },
      { size: 40, stock: 5 },
      { size: 41, stock: 4 },
      { size: 42, stock: 3 },
    ],
  },
  {
    name: "Asics Gel Kayano 14 Silver Black",
    description:
      "A layered running-inspired model that blends early-2000s performance design with the comfort and visual complexity that has made the silhouette popular again. Metallic details, supportive cushioning, and a breathable upper give it both technical appeal and strong everyday wearability.",
    price: 1799,
    image: productImage("gel-kayano-14-silver-black.jpg.png"),
    dropDate: "2026-04-09T23:59:00+02:00",
    status: "live",
    variants: [
      { size: 39, stock: 3 },
      { size: 40, stock: 5 },
      { size: 41, stock: 6 },
      { size: 42, stock: 5 },
      { size: 43, stock: 4 },
      { size: 44, stock: 2 },
    ],
  },
  {
    name: "Salomon XT 6 Vanilla Ice",
    description:
      "A trail-running icon with lightweight support, aggressive tooling, and the kind of technical aesthetic that works especially well in modern outdoor-inspired streetwear. The colorway stays versatile while the quick-lace system and structured upper make it practical for longer wear.",
    price: 1999,
    image: productImage("salomon-xt-6-vanilla-ice.jpg.png"),
    dropDate: "2026-04-23T23:59:00+02:00",
    status: "upcoming",
    variants: [
      { size: 38, stock: 2 },
      { size: 39, stock: 3 },
      { size: 40, stock: 4 },
      { size: 41, stock: 5 },
      { size: 42, stock: 4 },
      { size: 43, stock: 3 },
    ],
  },
  {
    name: "Puma Palermo Archive Blue",
    description:
      "A terrace-inspired low-profile pair with a soft suede upper, slim proportions, and vintage sport references that make it easy to style with both wide and slim trousers. It delivers a lighter and more refined alternative to chunkier everyday sneakers without losing personality.",
    price: 1099,
    image: productImage("puma-palermo-archive-blue.jpg.png"),
    dropDate: "2026-04-24T23:59:00+02:00",
    status: "upcoming",
    variants: [
      { size: 37, stock: 4 },
      { size: 38, stock: 6 },
      { size: 39, stock: 6 },
      { size: 40, stock: 5 },
      { size: 41, stock: 4 },
      { size: 42, stock: 2 },
    ],
  },
  {
    name: "Converse Chuck 70 High Parchment",
    description:
      "A premium update to the classic Chuck Taylor with sturdier canvas, enhanced cushioning, and vintage-inspired details that give the shoe a more elevated finish. The parchment upper and off-white sole make the pair feel understated, timeless, and easy to wear year-round.",
    price: 999,
    image: productImage("chuck-70-high-parchment.jpg.png"),
    dropDate: "2026-04-25T23:59:00+02:00",
    status: "upcoming",
    variants: [
      { size: 37, stock: 3 },
      { size: 38, stock: 5 },
      { size: 39, stock: 5 },
      { size: 40, stock: 6 },
      { size: 41, stock: 4 },
      { size: 42, stock: 3 },
      { size: 43, stock: 2 },
    ],
  },
  {
    name: "Vans Old Skool Black White",
    description:
      "A skate classic that still works because of its clean linework, durable suede overlays, and familiar side stripe that instantly anchors a casual outfit. This version keeps the iconic black and white formula intact while remaining easy to wear for both everyday errands and all-day use.",
    price: 899,
    image: productImage("vans-old-skool-black-white.jpg.png"),
    dropDate: "2026-04-26T23:59:00+02:00",
    status: "upcoming",
    variants: [
      { size: 36, stock: 4 },
      { size: 37, stock: 5 },
      { size: 38, stock: 6 },
      { size: 39, stock: 6 },
      { size: 40, stock: 5 },
      { size: 41, stock: 4 },
      { size: 42, stock: 3 },
    ],
  },
  {
    name: "Nike Air Max 97 Silver Bullet",
    description:
      "A standout runner-inspired silhouette with reflective piping, wave-shaped overlays, and full-length Air cushioning that gives the pair both comfort and unmistakable presence. The metallic upper keeps the shoe bold, but the shape is classic enough to remain wearable well beyond trend cycles.",
    price: 1999,
    image: productImage("air-max-97-silver-bullet.jpg.png"),
    dropDate: "2026-03-31T23:59:00+02:00",
    status: "sold_out",
    variants: [
      { size: 39, stock: 0 },
      { size: 40, stock: 0 },
      { size: 41, stock: 0 },
      { size: 42, stock: 0 },
      { size: 43, stock: 0 },
    ],
  },
  {
    name: "Adidas Handball Spezial Navy Gum",
    description:
      "A soft suede terrace model with a slim profile, classic gold branding, and a gum outsole that adds warmth and vintage character to the overall look. It is one of those pairs that feels dressed up compared with a standard trainer while still staying casual and easy to wear.",
    price: 1299,
    image: productImage("handball-spezial-navy-gum.jpg.png"),
    dropDate: "2026-04-27T23:59:00+02:00",
    status: "upcoming",
    variants: [
      { size: 37, stock: 3 },
      { size: 38, stock: 5 },
      { size: 39, stock: 6 },
      { size: 40, stock: 5 },
      { size: 41, stock: 4 },
      { size: 42, stock: 3 },
    ],
  },
  {
    name: "New Balance 2002R Protection Pack Rain Cloud",
    description:
      "A layered runner with deconstructed suede edges, premium textures, and soft cushioning that makes it feel substantial without becoming bulky. The muted grey tones create a refined look, while the aged detailing gives the pair a more fashion-forward attitude than a standard performance runner.",
    price: 1899,
    image: productImage("nb-2002r-protection-pack-rain-cloud.jpg.png"),
    dropDate: "2026-04-28T23:59:00+02:00",
    status: "upcoming",
    variants: [
      { size: 39, stock: 2 },
      { size: 40, stock: 3 },
      { size: 41, stock: 4 },
      { size: 42, stock: 5 },
      { size: 43, stock: 3 },
      { size: 44, stock: 2 },
    ],
  },
  {
    name: "Nike Vomero 5 Photon Dust",
    description:
      "A layered mesh runner with a technical look, excellent day-long comfort, and a color palette that feels clean without turning flat. The combination of breathable materials and sculpted detailing makes it a strong option for anyone who wants a current, comfortable sneaker with subtle depth.",
    price: 1799,
    image: productImage("vomero-5-photon-dust.jpg.png"),
    dropDate: "2026-04-29T23:59:00+02:00",
    status: "upcoming",
    variants: [
      { size: 38, stock: 4 },
      { size: 39, stock: 5 },
      { size: 40, stock: 7 },
      { size: 41, stock: 6 },
      { size: 42, stock: 5 },
      { size: 43, stock: 3 },
    ],
  },
  {
    name: "Reebok Club C 85 Vintage Chalk",
    description:
      "A low-profile tennis classic with soft leather, understated branding, and an aged off-white finish that gives the pair a relaxed premium feel. It is simple in the best way, offering enough retro personality to stand out while still working as an everyday go-to sneaker.",
    price: 1099,
    image: productImage("club-c-85-vintage-chalk.jpg.png"),
    dropDate: "2026-04-30T23:59:00+02:00",
    status: "upcoming",
    variants: [
      { size: 37, stock: 5 },
      { size: 38, stock: 6 },
      { size: 39, stock: 6 },
      { size: 40, stock: 7 },
      { size: 41, stock: 5 },
      { size: 42, stock: 4 },
    ],
  },
  {
    name: "Jordan 4 Retro Military Blue",
    description:
      "A structured basketball retro with visible Air cushioning, supportive wings, and one of the most recognizable panel layouts in the Jordan line. The military blue accents keep the pair bright and wearable, while the shape gives it enough impact to anchor a full outfit on its own.",
    price: 2499,
    image: productImage("jordan-4-military-blue.jpg.png"),
    dropDate: "2026-04-18T23:59:00+02:00",
    status: "sold_out",
    variants: [
      { size: 39, stock: 0 },
      { size: 40, stock: 0 },
      { size: 41, stock: 0 },
      { size: 42, stock: 0 },
      { size: 43, stock: 0 },
      { size: 44, stock: 0 },
    ],
  },
  {
    name: "Nike Blazer Mid 77 Vintage White Black",
    description:
      "A retro-inspired mid-top with exposed foam, a clean leather upper, and old-school basketball energy that translates well into everyday wear. The vintage treatment gives it just enough attitude, while the shape remains slim and easy to style with simple wardrobe pieces.",
    price: 1199,
    image: productImage("blazer-mid-77-vintage-white-black.jpg.png"),
    dropDate: "2026-05-01T23:59:00+02:00",
    status: "upcoming",
    variants: [
      { size: 38, stock: 3 },
      { size: 39, stock: 5 },
      { size: 40, stock: 5 },
      { size: 41, stock: 5 },
      { size: 42, stock: 4 },
      { size: 43, stock: 2 },
    ],
  },
  {
    name: "On Cloudmonster Frost Wash",
    description:
      "A modern running silhouette with oversized cushioning, lightweight construction, and a distinct underfoot geometry that makes the pair feel energetic and current. The balanced neutral colorway keeps the shoe versatile while the build itself brings a more technical edge to daily rotation.",
    price: 2099,
    image: productImage("cloudmonster-frost-wash.jpg.png"),
    dropDate: "2026-05-02T23:59:00+02:00",
    status: "upcoming",
    variants: [
      { size: 39, stock: 2 },
      { size: 40, stock: 4 },
      { size: 41, stock: 5 },
      { size: 42, stock: 5 },
      { size: 43, stock: 3 },
      { size: 44, stock: 2 },
    ],
  },
  {
    name: "Hoka Clifton 9 White Solar Flare",
    description:
      "A comfort-first runner with a lightweight upper, balanced cushioning, and a shape that feels sporty without becoming too aggressive for everyday use. Bright accent colors give the pair some energy, but the overall design still stays easy to wear outside of training contexts.",
    price: 1899,
    image: productImage("clifton-9-white-solar-flare.jpg.png"),
    dropDate: "2026-04-17T23:59:00+02:00",
    status: "live",
    variants: [
      { size: 38, stock: 3 },
      { size: 39, stock: 4 },
      { size: 40, stock: 6 },
      { size: 41, stock: 6 },
      { size: 42, stock: 4 },
      { size: 43, stock: 2 },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Order.deleteMany({});
    await Variant.deleteMany({});
    await Product.deleteMany({});

    const createdProducts = await Product.insertMany(
      catalog.map(({ variants, dropDate, ...product }) => ({
        ...product,
        dropDate: new Date(dropDate),
      }))
    );

    const variantsData = createdProducts.flatMap((product, index) =>
      catalog[index].variants.map((variant) => ({
        productId: product._id,
        size: variant.size,
        stock: variant.stock,
      }))
    );

    await Variant.insertMany(variantsData);

    console.log(
      `Seed complete: ${createdProducts.length} products and ${variantsData.length} variants created.`
    );
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
