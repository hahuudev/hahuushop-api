import jwt from "jsonwebtoken";
import UserModel from "~/models/user.model";

export const verifyToken = async (req, res, next) => {
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

            console.log(currentUser)

            const { email, username, _id, role } = currentUser;
            req.user = { _id, email, username, role };
            next();
        });
    } catch (error) {
        console.log(error);
    }
};
