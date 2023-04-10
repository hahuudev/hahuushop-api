import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Category = new mongoose.Schema(
    {
        name: String,
        products: [{ type: mongoose.Types.ObjectId, ref: "Products", default: [] }],
    },
    { collection: "Categories", timestamps: true }
);

Category.plugin(mongoosePaginate);

Category.index({ name: "text" });

const CategoryModel = mongoose.model("Categories", Category);

CategoryModel.createIndexes({ name: "text" });

export default CategoryModel;
