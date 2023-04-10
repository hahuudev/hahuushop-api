import CategoryModel from "~/models/category.model";
import ProductModel from "~/models/product.model";

export const search = async (req, res) => {
    try {
        const keyword = req.query.q;
        const [products, categories] = await Promise.all([
            ProductModel.find({ $text: { $search: keyword } }, { _id: true, name: true, images: true, slug: true }),
            CategoryModel.find({ $text: { $search: keyword } }, { _id: true, name: true }),
        ]);
        res.status(200).json({
            products,
            categories,
        });
    } catch (error) {
        console.log(error);
    }
};
