import "dotenv/config";
import express from "express";
import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import variantsRouter from "./routes/variants.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";
import adminRouter from "./routes/admin.js";
import cors from "cors";

const app = express();

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Webbshop API", stack: "MEN (MongoDB, Express, Node.js)" });
});


app.get("/health", (req, res) => {
  res.json({ status: "100% Healthy :)" });
});

app.use("/products", productsRouter);
app.use("/variants", variantsRouter);
app.use("/auth", authRouter);
app.use("/orders", orderRouter);
app.use("/users", userRouter);
app.use("/admin", adminRouter);

export default app;
