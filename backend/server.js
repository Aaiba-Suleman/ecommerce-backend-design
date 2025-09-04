
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- Session (using env secret for Render) ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: true,
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));



// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
});
const Product = mongoose.model("Product", productSchema);

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

// Middleware to provide user & cartCount to EJS
app.use(async (req, res, next) => {
  if (req.session.userId) {
    let cart = await Cart.findOne({ userId: req.session.userId }).populate("products.productId");
    if (!cart) cart = { products: [] };

    // Only count products that exist in DB
    const validProducts = cart.products.filter(p => p.productId !== null);
    res.locals.cartCount = validProducts.reduce((acc, item) => acc + item.quantity, 0);
  } else {
    res.locals.cartCount = 0;
  }
  res.locals.user = req.session.username || null;
  next();
});



// Seed Products (Run once safely)
async function seedProducts() {
  const count = await Product.countDocuments();
  if (count === 0){
  const products = [
     {
        name: "Camera",
        price: 499.99,
        image: "/images/product1.jpeg",
        description: "DSLR camera with HD quality.",
      },
    {
        name: "Bag",
        price: 79.99,
        image: "/images/product2.jpeg",
        description: "Stylish and durable travel bag, perfect for everyday use.",
      },
       {
        name: "Makeup Kit",
        price: 45.99,
        image: "/images/product3.jpeg",
        description: "All-in-one makeup kit with versatile shades for a flawless look anytime.",
      },
      {
        name: "Perfume",
        price: 49.99,
        image: "/images/product4.jpeg",
        description: "Long-lasting fragrance with a refreshing aroma.",
      },
      {
        name: "Toy Car",
        price: 19.99,
        image: "/images/product5.jpeg",
        description: "Mini racing toy car for kids.",
      },
      {
        name: "Food Factory",
        price: 129.99,
        image: "/images/product6.jpeg",
        description: "Kitchen food factory appliance for multiple uses.",
      },
      {
        name: "Hair Pony",
        price: 2.99,
        image: "/images/product7.jpeg",
        description: "Durable and stylish hair pony for daily use.",
      },
    {
        name: "Monster Truck (Remote Control)",
        price: 89.99,
        image: "/images/product8.jpeg",
        description: "Exciting RC monster truck with powerful wheels.",
      },
  {
        name: "Headphone",
        price: 59.99,
        image: "/images/product9.jpeg",
        description: "High-quality over-ear headphones with deep bass.",
      },
      {
        name: "Water Bottle",
        price: 15.99,
        image: "/images/product10.jpeg",
        description: "Reusable eco-friendly water bottle for hydration.",
      },
{
        name: "Monopoly",
        price: 25.99,
        image: "/images/product11.jpeg",
        description: "Classic Monopoly board game for family fun.",
      },
      {
        name: "Pencil Colors",
        price: 5.99,
        image: "/images/product12.jpeg",
        description: "Set of 12 vibrant pencil colors for creative drawing.",
      },
        {
        name: "Vase",
        price: 34.99,
        image: "/images/product13.jpeg",
        description: "Beautiful decorative flower vase.",
      },
       {
        name: "Globe",
        price: 39.99,
        image: "/images/product14.jpeg",
        description: "Educational globe for geography lovers.",
      },
      {
        name: "AirPods",
        price: 129.99,
        image: "/images/product15.jpeg",
        description: "Wireless earbuds with great sound quality.",
      },
      {
        name: "Ludo",
        price: 49.99,
        image: "/images/product16.jpeg",
        description: "Classic wooden Ludo game for endless family fun and bonding.",
      },
       {
        name: "Mini Bagpack",
        price: 79.99,
        image: "/images/product17.jpeg",
        description: "Compact and trendy mini backpack, perfect for daily essentials on the go.",
      },
       {
        name: "Blender",
        price: 219.99,
        image: "/images/product18.jpeg",
        description: "Powerful and easy-to-use blender for smoothies, shakes, and everyday kitchen tasks.",
      },
       {
        name: "Dumbbell",
        price: 89.99,
        image: "/images/product19.jpeg",
        description: "Durable and comfortable dumbbell for effective home or gym workouts.",
      },
      {
        name: "Lamp",
        price: 89.99,
        image: "/images/product20.jpeg",
        description: "Stylish and energy-efficient lamp to brighten up any room or workspace.",
      },
      {
        name: "Silicon Phone Case",
        price: 89.99,
        image: "/images/product21.jpeg",
        description: "Flexible and durable silicone phone case for all-round protection and a comfortable grip.",
      },
      {
        name: "Notebooks",
        price: 89.99,
        image: "/images/product22.jpeg",
        description: "Premium-quality notebooks perfect for notes, journaling, and daily planning.",
      },
    {
        name: "Yoga Exercise Mat",
        price: 89.99,
        image: "/images/product23.jpeg",
        description: "Non-slip yoga mat designed for maximum comfort and stability during workouts.",
      },
      {
        name: "Sticky Notes",
        price: 89.99,
        image: "/images/product24.jpeg",
        description: "Bright and handy sticky notes for reminders, organization, and quick note-taking.",
      },
  ];

  await Product.insertMany(products);
  console.log("✅ Products seeded correctly!");
  }
}
seedProducts();

// Routes
app.get("/", async (req, res) => {
  const products = await Product.find().limit(3); // Featured 3
  res.render("index", { title: "Home", products });
});

app.get("/shop", async (req, res) => {
  if (!req.session.userId) return res.redirect("/signup");
  const products = await Product.find();
  res.render("shop", { title: "All Products", products });
});

app.get("/products", async (req, res) => {
  if (!req.session.userId) return res.redirect("/signup"); // only logged-in users
  const products = await Product.find(); // get all products
  res.render("shop", { title: "All Products", products }); // render shop.ejs
});

// Cart page
app.get("/cart", async (req, res) => {
  let cart = await Cart.findOne({ userId: req.session.userId }).populate("products.productId");
  if (!cart) cart = new Cart({ userId: req.session.userId, products: [] });

  // Remove any products that were deleted from DB
  cart.products = cart.products.filter(p => p.productId !== null);

  res.render("cart", { title: "Your Cart", cart });
});


// Signup Page (GET)
app.get("/signup", (req, res) => {
  res.render("signup", { title: "Signup", error: null });
});

// Signup POST
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.render("signup", { title: "Signup", error: "Email already exists!" });
  }

  const newUser = new User({ username, email, password });
  await newUser.save();

  // DO NOT log in automatically — redirect to login page
  res.redirect("/login");
});



// Login Page (GET)
app.get("/login", (req, res) => {
  res.render("login", { title: "Login", error: null });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });

  if (!user) {
    return res.render("login", { title: "Login", error: "Invalid username or password!" });
  }

  // Set session so user is considered logged in
  req.session.userId = user._id;
  req.session.username = user.username;

  // Redirect to products page after successful login
  res.redirect("/products");
});


// Cart actions
app.post("/cart/add/:id", async (req, res) => {
  const productId = req.params.id;
  let cart = await Cart.findOne({ userId: req.session.userId });
  if (!cart) cart = new Cart({ userId: req.session.userId, products: [] });

  const index = cart.products.findIndex(p => p.productId.toString() === productId);
  if (index > -1) cart.products[index].quantity += 1;
  else cart.products.push({ productId, quantity: 1 });

  await cart.save();
  res.redirect("/cart");
});

// Increase quantity
app.post("/cart/increase/:id", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.session.userId });
  const item = cart.products.find(p => p.productId.toString() === req.params.id);
  if (item) item.quantity += 1;
  await cart.save();
  res.redirect("/cart");
});

// Decrease quantity
app.post("/cart/decrease/:id", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.session.userId });
  const index = cart.products.findIndex(p => p.productId.toString() === req.params.id);
  if (index > -1) {
    if (cart.products[index].quantity > 1) cart.products[index].quantity -= 1;
    else cart.products.splice(index, 1);
  }
  await cart.save();
  res.redirect("/cart");
});

// Remove product
app.post("/cart/remove/:id", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.session.userId });
  cart.products = cart.products.filter(p => p.productId.toString() !== req.params.id);
  await cart.save();
  res.redirect("/cart");
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      return res.redirect("/"); // fallback if error
    }
    res.redirect("/login"); // redirect to login after logout
  });
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
