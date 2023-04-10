import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "~/configs/cloudinary";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ["jpg", "png"],
    params: {
        folder: "hahuushop",
    
    },
});

export const uploadMulter = multer({ storage: storage });
