import express from "express";
import { deleteImage, uploadImage } from "~/controllers/uploader.controller";
import { uploadMulter } from "~/middleware/uploader";
const router = express.Router();

router.post("/images/upload", uploadMulter.array("images",10), uploadImage);
router.delete("/images/:publicId", deleteImage);

export default router;
