import Joi from "joi";
import CategoryModel from "~/models/category.model";
import ProductModel from "~/models/product.model";

const schema = Joi.object({
    name: Joi.string().required(),
});

export const getAllCategories = async (req, res) => {
    try {
        const data = await CategoryModel.find();
        res.json({
            meassge: "Success",
            categories: data,
        });
    } catch (error) {
        console.log(error);
    }
};
export const getCategoryById = async (req, res) => {
    try {
        const [category, products] = await Promise.all([
            CategoryModel.findById(req.params.id),
            ProductModel.find({ categoryId: req.params.id }),
        ]);
        
        res.json({
            meassge: "Success",
            category: { ...category._doc, products },
        });
    } catch (error) {
        console.log(error);
    }
};

export const newCategory = async (req, res) => {
    const newProduct = req.body;
    const error = schema.validate(newProduct);
    if (error.error) {
        return res.json({ meassge: error.error.details[0].message });
    }
    const category = new CategoryModel(newProduct);
    const data = await category.save();
    res.json({
        meassge: "New product success",
        category: data,
    });
};

export const updateCategory = async (req, res) => {
    const id = req.params.id;
    const newProduct = req.body;
    const error = schema.validate(newProduct);
    if (error.error) {
        return res.json({ meassge: error.error.details[0].message });
    }

    // await axios.put("http://localhost:8080/products/" + id, req.body);
    const result = await CategoryModel.findByIdAndUpdate(id, req.body);
    res.json({
        meassge: "Update product success",
    });
};

export const deleteCategory = async (req, res) => {
    const id = req.params.id;
    // await axios.delete("http://localhost:8080/products/" + id);
    const result = await CategoryModel.findByIdAndDelete(id);
    res.json({
        meassge: "Delete product successfully",
    });
};
