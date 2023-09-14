import express from "express";
import cors from "cors";
import productRouter from "./router/products.js";
import categoryRouter from "./router/category.router.js";
import authRouter from "./router/auth.router.js";
import uploadRouter from "./router/upload.router.js";
import searchRouter from "./router/search.router.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();

app.use(cors({ credentials: true }));
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api", authRouter);
app.use("/api", uploadRouter);
app.use("/api", searchRouter);

mongoose.connect(process.env.MONGODB_ATLATS, { useUnifiedTopology: true, useNewUrlParser: true });

app.use("/", (req, res) => {
    res.send("hello word Nguyễn Hà Hữu");
});

mongoose.connection.once("open", () => {
    console.log("ConnectDb successfully");
    app.listen(8000, () => {
        console.log("I am running port 8000");
    });
});
