import express from "express";
import cors from "cors";
import productRouter from "./router/products.js";
import categoryRouter from "./router/category.router";
import authRouter from "./router/auth.router.js";
import uploadRouter from "./router/upload.router.js";
import searchRouter from "./router/search.router.js";
import mongoose from "mongoose";

const app = express();

app.use(cors({ credentials: true }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api", authRouter);
app.use("/api", uploadRouter);
app.use("/api", searchRouter);

mongoose.connect("mongodb://localhost:27017/web17301", { useUnifiedTopology: true, useNewUrlParser: true });

app.use("/", (req, res) => {
    res.send("hello word");
});
// app.listen(8000, () => {
//     console.log("I am running port 8000");
// });

export const viteNodeApp = app;
