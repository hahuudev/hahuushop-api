import express from "express";
import cors from "cors";
import Joi from "joi";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { v2 } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cookieParser from "cookie-parser";
const Category = new mongoose.Schema(
  {
    name: String,
    products: [{ type: mongoose.Types.ObjectId, ref: "Products", default: [] }]
  },
  { collection: "Categories", timestamps: true }
);
Category.plugin(mongoosePaginate);
Category.index({ name: "text" });
const CategoryModel = mongoose.model("Categories", Category);
CategoryModel.createIndexes({ name: "text" });
mongoose.plugin(slug);
const Product = new mongoose.Schema(
  {
    name: { type: String, require: true },
    slug: { type: String, slug: "name" },
    price: { type: Number },
    original_price: { type: Number },
    description: { type: String },
    images: [{ url: { type: String, publicId: { type: String } }, _id: false }],
    categoryId: { type: mongoose.SchemaTypes.ObjectId, ref: "Categories", require: true }
  },
  { collection: "Products", timestamps: true }
);
Product.index({ name: "text" });
Product.plugin(mongoosePaginate);
const ProductModel = mongoose.model("Products", Product);
ProductModel.createIndexes({ name: "text" });
const schema$1 = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  original_price: Joi.number().required(),
  description: Joi.string().required(),
  images: Joi.array().items({ url: Joi.string().required(), publicId: Joi.string() }),
  categoryId: Joi.string().required()
});
const getAllProducts = async (req, res) => {
  try {
    const { _sort = "createdAt", page = 1, limit = 10, _order = "desc" } = req.query;
    const options = {
      page,
      limit,
      sort: {
        [_sort]: _order === "desc" ? 1 : -1
      }
    };
    const { docs, ...data } = await ProductModel.paginate({}, options);
    res.json({
      meassge: "Success",
      products: docs,
      ...data
    });
  } catch (error) {
    console.log(error);
  }
};
const getProductsByCategoryId = async (req, res) => {
  try {
    const { _sort = "createdAt", page = 1, limit = 10, _order = "desc" } = req.query;
    const options = {
      page,
      limit,
      sort: {
        [_sort]: _order === "desc" ? 1 : -1
      }
    };
    const { docs, ...data } = await ProductModel.paginate({ categoryId: req.params.id }, options);
    res.json({
      meassge: "Success",
      products: docs,
      ...data
    });
  } catch (error) {
    console.log(error);
  }
};
const getProductBySlug = async (req, res) => {
  try {
    const data = await ProductModel.findOne({ slug: req.params.id });
    res.json({
      meassge: "Success",
      product: data
    });
  } catch (error) {
    console.log(error);
  }
};
const getProductById = async (req, res) => {
  try {
    const data = await ProductModel.findById(req.params.id);
    res.json({
      meassge: "Successfully",
      product: data
    });
  } catch (error) {
    console.log(error);
  }
};
const newProduct = async (req, res) => {
  try {
    const newProduct2 = req.body;
    const error = schema$1.validate(newProduct2);
    if (error.error) {
      return res.json({ meassge: error.error.details[0].message });
    }
    const product = new ProductModel(newProduct2);
    const data = await product.save();
    res.json({
      meassge: "New product success",
      products: data
    });
  } catch (error) {
    console.log(error);
  }
};
const updateProduct = async (req, res) => {
  const id = req.params.id;
  const newProduct2 = req.body;
  const error = schema$1.validate(newProduct2);
  if (error.error) {
    return res.json({ meassge: error.error.details[0].message });
  }
  await ProductModel.findByIdAndUpdate(id, req.body);
  res.json({
    meassge: "Update product success"
  });
};
const deleteProduct = async (req, res) => {
  const id = req.params.id;
  await ProductModel.findByIdAndDelete(id);
  res.json({
    meassge: "Delete product successfully"
  });
};
const User = new mongoose.Schema({
  username: { type: String, require: true },
  email: { type: String, unique: true, require: true },
  password: { type: String, min: 6, require: true },
  role: { type: String, enum: ["member", "admin"], default: "member" }
});
const UserModel = mongoose.model("Users", User);
const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.access_token) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }
    const access_token = req.headers.access_token.split(" ")[1];
    jwt.verify(access_token, "secretKey", async (error, payload) => {
      if (error) {
        return res.status(401).json({ message: error.name });
      }
      const currentUser = await UserModel.findById(payload._id);
      console.log(currentUser);
      const { email, username, _id, role } = currentUser;
      req.user = { _id, email, username, role };
      next();
    });
  } catch (error) {
    console.log(error);
  }
};
const router$4 = express.Router();
router$4.route("/products/category/:id").get(getProductsByCategoryId);
router$4.route("/products").get(getAllProducts).post(verifyToken, newProduct);
router$4.route("/product/:id").get(getProductById);
router$4.route("/products/:id").get(getProductBySlug).put(verifyToken, updateProduct).delete(verifyToken, deleteProduct);
const schema = Joi.object({
  name: Joi.string().required()
});
const getAllCategories = async (req, res) => {
  try {
    const data = await CategoryModel.find();
    res.json({
      meassge: "Success",
      categories: data
    });
  } catch (error) {
    console.log(error);
  }
};
const newCategory = async (req, res) => {
  const newProduct2 = req.body;
  const error = schema.validate(newProduct2);
  if (error.error) {
    return res.json({ meassge: error.error.details[0].message });
  }
  const category = new CategoryModel(newProduct2);
  const data = await category.save();
  res.json({
    meassge: "New product success",
    category: data
  });
};
const updateCategory = async (req, res) => {
  const id = req.params.id;
  const newProduct2 = req.body;
  const error = schema.validate(newProduct2);
  if (error.error) {
    return res.json({ meassge: error.error.details[0].message });
  }
  await CategoryModel.findByIdAndUpdate(id, req.body);
  res.json({
    meassge: "Update product success"
  });
};
const deleteCategory = async (req, res) => {
  const id = req.params.id;
  await CategoryModel.findByIdAndDelete(id);
  res.json({
    meassge: "Delete product successfully"
  });
};
const router$3 = express.Router();
router$3.route("/categories").get(getAllCategories).post(newCategory);
router$3.route("/categories/:id").put(updateCategory).delete(deleteCategory);
let list_token = [];
const signup = async (req, res) => {
  try {
    const userExist = await UserModel.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(400).json({
        message: "Email đã tồn tại"
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await UserModel.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });
    const { password: passwordDb, ...payload } = user;
    const access_token = jwt.sign(payload, "secretKey", { expiresIn: "1d" });
    const refresh_token = jwt.sign(payload, "secretKey", { expiresIn: "2d" });
    return res.status(201).cookie("token", refresh_token, {
      httpOnly: true,
      samsite: "strict",
      maxAge: 2 * 24 * 60 * 60 * 1e3
    }).json({
      message: "Đăng ký tk thành công",
      access_token,
      user
    });
  } catch (error) {
  }
};
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDb = await UserModel.findOne({ email });
    if (!userDb) {
      return res.status(300).json({ message: "Tài khoản chưa được đăng ký trong hệ thống" });
    }
    const isMatch = await bcrypt.compare(password, userDb.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai username hoặc password" });
    }
    const { password: passwordDb, _id, ...payload } = userDb;
    const access_token = jwt.sign({ _id }, "secretKey", { expiresIn: "1d" });
    const refresh_token = jwt.sign({ _id }, "secretKey", { expiresIn: "2d" });
    list_token.push(refresh_token);
    return res.status(201).cookie("refresh_token", refresh_token, {
      httpOnly: true,
      samsite: "strict",
      maxAge: 2 * 24 * 60 * 60 * 1e3
    }).json({
      message: "Đăng nhập tk thành công",
      access_token,
      user: userDb
    });
  } catch (error) {
  }
};
const getAuth = async (req, res) => {
  try {
    res.status(200).json({ message: "Get user login successfuly !!", user: req.user });
  } catch (error) {
    console.log(error);
  }
};
const logout = async (req, res) => {
  try {
    list_token = list_token.filter((token) => token !== refreshToken);
    res.status(200).clearCookie("refresh_token").json({ message: "Logout successfully" });
  } catch (error) {
    console.log(error);
  }
};
const refreshToken = async (req, res) => {
  var _a;
  try {
    if (!((_a = req.cookies) == null ? void 0 : _a.refresh_token)) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }
    const resfreshToken = req.cookies.refresh_token;
    if (!list_token.includes(refreshToken)) {
      return res.status(401).json({ message: "Refresh token không hợp lệ" });
    }
    jwt.verify(resfreshToken, "secretKey", async (error, payload) => {
      if (error) {
        return res.status(401).json({ message: error.name });
      }
      list_token = list_token.filter((token) => token !== refreshToken);
      const new_access_token = jwt.sign({ _id: payload._id }, "secretKey", { expiresIn: "1d" });
      const new_refresh_token = jwt.sign({ _id: payload._id }, "secretKey", { expiresIn: "2d" });
      list_token.push(new_refresh_token);
      res.status(200).cookie("refresh_token", new_refresh_token, {
        httpOnly: true,
        samsite: "strict",
        maxAge: 2 * 24 * 60 * 60 * 1e3
      }).json({ access_token: new_access_token });
    });
  } catch (error) {
    console.log(error);
  }
};
const signupValidator = (req, res, next) => {
  const schema2 = Joi.object({
    username: Joi.string().required().messages({
      "string.empty": "Tên không được để trống",
      "any.required": "Trường tên là bắt buộc"
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email không được để trống",
      "any.required": "Trường email là bắt buộc",
      "string.email": "Email không đúng định dạng"
    }),
    password: Joi.string().required().min(6).messages({
      "string.empty": "Mật khẩu không được để trống",
      "any.required": "Trường mật khẩu là bắt buộc",
      "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự"
    }),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
      "string.empty": "Xác nhận mật khẩu không được để trống",
      "any.required": "Trường xác nhận mật khẩu là bắt buộc",
      "any.only": "Xác nhận mật khẩu không khớp"
    })
  });
  const { error } = schema2.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => err.message);
    return res.status(400).json({
      messages: errors
    });
  }
  next();
};
const signinValidator = (req, res, next) => {
  const schema2 = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Email không được để trống",
      "any.required": "Trường email là bắt buộc",
      "string.email": "Email không đúng định dạng"
    }),
    password: Joi.string().required().min(6).messages({
      "string.empty": "Mật khẩu không được để trống",
      "any.required": "Trường mật khẩu là bắt buộc",
      "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự"
    })
  });
  const { error } = schema2.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => err.message);
    return res.status(400).json({
      messages: errors
    });
  }
  next();
};
const router$2 = express.Router();
router$2.post("/signup", signupValidator, signup);
router$2.post("/signin", signinValidator, signin);
router$2.get("/auth", verifyToken, getAuth);
router$2.get("/auth/logout", verifyToken, logout);
router$2.post("/auth/refresh-token", refreshToken);
v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
const uploadImage = async (req, res) => {
  const images = req.files.map((file) => file.path);
  const uploadedImages = [];
  for (const image of images) {
    try {
      const result = await v2.uploader.upload(image);
      uploadedImages.push({ url: result.secure_url, publicId: result.public_id });
    } catch (error) {
      console.log(error);
    }
  }
  return res.json({ urls: uploadedImages });
};
const deleteImage = async (req, res) => {
  const publicId = req.params.publicId;
  try {
    const result = await v2.uploader.destroy(publicId);
    res.status(200).json({ message: "Xóa ảnh thành công", ...result });
  } catch (error) {
    res.status(500).json({ error: "Error deleting image" });
  }
};
const storage = new CloudinaryStorage({
  cloudinary: v2,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "hahuushop"
  }
});
const uploadMulter = multer({ storage });
const router$1 = express.Router();
router$1.post("/images/upload", uploadMulter.array("images", 10), uploadImage);
router$1.delete("/images/:publicId", deleteImage);
const search = async (req, res) => {
  try {
    const keyword = req.query.q;
    const [products, categories] = await Promise.all([
      ProductModel.find({ $text: { $search: keyword } }, { _id: true, name: true, images: true, slug: true }),
      CategoryModel.find({ $text: { $search: keyword } }, { _id: true, name: true })
    ]);
    res.status(200).json({
      products,
      categories
    });
  } catch (error) {
    console.log(error);
  }
};
const router = express.Router();
router.get("/search", search);
const app = express();
app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", router$4);
app.use("/api", router$3);
app.use("/api", router$2);
app.use("/api", router$1);
app.use("/api", router);
mongoose.connect("mongodb://localhost:27017/web17301", { useUnifiedTopology: true, useNewUrlParser: true });
app.use("/", (req, res) => {
  res.send("hello word");
});
app.listen(8e3, () => {
  console.log("I am running port 8000");
});
const viteNodeApp = app;
export {
  viteNodeApp
};
