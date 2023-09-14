import axios from "axios";
import Joi from "joi";
import CategoryModel from "~/models/category.model";
import ProductModel from "~/models/product.model.js";

const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    original_price: Joi.number().required(),
    description: Joi.string().required(),
    images: Joi.array().items({ base_url: Joi.string().required(), publicId: Joi.string() }),
    categoryId: Joi.string().required(),
});

export const getAllProducts = async (req, res) => {
    try {
        const { _sort = "createdAt", page = 1, limit = 10, _order = "desc" } = req.query;
        const options = {
            page,
            limit,
            sort: {
                [_sort]: _order === "desc" ? 1 : -1,
            },
        };

        const { docs, ...data } = await ProductModel.paginate({}, options);
        res.json({
            meassge: "Success",
            products: docs,
            ...data,
        });
    } catch (error) {
        console.log(error);
    }
};

export const getProductsByCategoryId = async (req, res) => {
    try {
        const { _sort = "createdAt", page = 1, limit = 10, _order = "desc" } = req.query;
        const options = {
            page,
            limit,
            sort: {
                [_sort]: _order === "desc" ? 1 : -1,
            },
        };

        const { docs, ...data } = await ProductModel.paginate({ categoryId: req.params.id }, options);
        res.json({
            meassge: "Success",
            products: docs,
            ...data,
        });
    } catch (error) {
        console.log(error);
    }
};

export const getProductBySlug = async (req, res) => {
    try {
        const data = await ProductModel.findOne({ slug: req.params.id });
        res.json({
            meassge: "Success",
            product: data,
        });
    } catch (error) {
        console.log(error);
    }
};
export const getProductById = async (req, res) => {
    try {
        const data = await ProductModel.findById(req.params.id);
        res.json({
            meassge: "Successfully",
            product: data,
        });
    } catch (error) {
        console.log(error);
    }
};

export const newProduct = async (req, res) => {
    try {
        const newProduct = req.body;
        const error = schema.validate(newProduct);
        if (error.error) {
            return res.json({ meassge: error.error.details[0].message });
        }
        const product = new ProductModel(newProduct);
        const data = await product.save();
        // await CategoryModel.findByIdAndUpdate(data.categoryId, { $push: { products: data._id } });

        res.json({
            meassge: "New product success",
            products: data,
        });
    } catch (error) {
        console.log(error);
    }
};

export const updateProduct = async (req, res) => {
    const id = req.params.id;
    const newProduct = req.body;
    const error = schema.validate(newProduct);
    if (error.error) {
        return res.json({ meassge: error.error.details[0].message });
    }

    // await axios.put("http://localhost:8080/products/" + id, req.body);
    const result = await ProductModel.findByIdAndUpdate(id, req.body);
    res.json({
        meassge: "Update product success",
    });
};

export const deleteProduct = async (req, res) => {
    const id = req.params.id;
    // await axios.delete("http://localhost:8080/products/" + id);
    const result = await ProductModel.findByIdAndDelete(id);
    res.json({
        meassge: "Delete product successfully",
    });
};
