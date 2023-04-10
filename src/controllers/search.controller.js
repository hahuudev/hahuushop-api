import ProductModel from "~/models/product.model";

export const search = async (req, res) => {
    try {
        const keyword = req.query.q;
        const [products] = await Promise.all([
            ProductModel.find({ $text: { $search: keyword } }, { _id: true, name: true, images: true, slug: true }),
        ]);
        res.status(200).json({
            products,
            categories: [],
        });
    } catch (error) {
        console.log(error)
    }
};
