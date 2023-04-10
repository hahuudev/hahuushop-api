import express from "express";
import {
    deleteProduct,
    getAllProducts,
    getProductById,
    getProductBySlug,
    getProductsByCategoryId,
    newProduct,
    updateProduct,
} from "~/controllers/products";
import { verifyToken } from "~/middleware/verifyToken";

const router = express.Router();

router.route("/products/category/:id").get(getProductsByCategoryId);
router.route("/products").get(getAllProducts).post(verifyToken, newProduct);

router.route("/product/:id").get(getProductById);
router.route("/products/:id").get(getProductBySlug).put(verifyToken, updateProduct).delete(verifyToken, deleteProduct);

export default router;
