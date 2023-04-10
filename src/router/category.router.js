import express from "express";
import { deleteCategory, getAllCategories, newCategory, updateCategory } from "~/controllers/category.controller";
import { verifyToken } from "~/middleware/verifyToken";

const router = express.Router();

router.route("/categories").get( getAllCategories).post(newCategory);
router.route("/categories/:id").put(updateCategory).delete(deleteCategory);

export default router;
