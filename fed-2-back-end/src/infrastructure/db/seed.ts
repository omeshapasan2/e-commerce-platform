import "dotenv/config";
import { connectDB } from "./index";
import Category from "./entities/Category";
import Product from "./entities/Product";
import stripe from "../stripe";
import Color from "./entities/Color";

const CATEGORY_NAMES = ["Socks", "Pants", "T-shirts", "Shoes", "Shorts"];

const COLOR_NAMES = ["Red", "Blue", "Green"];

const ADJECTIVES = [
  "Classic", "Sporty", "Elegant", "Comfy", "Trendy", "Cool", "Premium", "Casual", "Bold", "Vivid",
  "Soft", "Durable", "Lightweight", "Cozy", "Modern", "Vintage", "Chic", "Sleek", "Eco", "Urban"
];
const NOUNS = [
  "Runner", "Style", "Fit", "Wear", "Edition", "Line", "Collection", "Piece", "Design", "Model",
  "Comfort", "Edge", "Wave", "Touch", "Look", "Trend", "Vibe", "Aura", "Motion", "Essence"
];

function getRandomName(categoryName: string) {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${categoryName} ${noun}`;
}

const createProductsForCategory = async (
  categoryId: any,
  categoryName: string,
  colors: any[]
) => {
  const products = [];
  for (let i = 0; i < 10; i++) {

    const name = getRandomName(categoryName);
    const description = `This is a ${categoryName} that is ${name}`;
    const price = Math.floor(Math.random() * 100) + 10;

    const stripeProduct = await stripe.products.create({
      name: name,
      description: description,
      default_price_data: {
        currency: "usd",
        unit_amount: price * 100,
      },
    });

    const color = colors[Math.floor(Math.random() * colors.length)];

    products.push({
      categoryId,
      colorId: color._id,
      name: name,
      price: price,
      description: description,
      image: `https://via.placeholder.com/150?text=${encodeURIComponent(categoryName)}`,
      stock: Math.floor(Math.random() * 50) + 1,
      reviews: [],
      stripePriceId: stripeProduct.default_price,
    });
  }
  await Product.insertMany(products);
};

const seed = async () => {
  await connectDB();
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Color.deleteMany({});

  const colors = await Color.insertMany(
    COLOR_NAMES.map((name) => ({ name }))
  );

  for (const name of CATEGORY_NAMES) {
    const category = await Category.create({ name });
    await createProductsForCategory(category._id, name, colors);
    console.log(`Seeded category: ${name}`);
  }

  console.log("Seeding complete.");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});