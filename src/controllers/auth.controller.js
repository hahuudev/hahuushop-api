import UserModel from "~/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    try {
        const userExist = await UserModel.findOne({ email: req.body.email });
        if (userExist) {
            return res.status(400).json({
                message: "Email đã tồn tại",
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await UserModel.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        const { password: passwordDb, ...payload } = user;

        const access_token = jwt.sign(payload, "secretKey", { expiresIn: "1d" });
        const refresh_token = jwt.sign(payload, "secretKey", { expiresIn: "2d" });

        return res
            .status(201)
            .cookie("token", refresh_token, {
                httpOnly: true,
                samsite: "strict",
                maxAge: 2 * 24 * 60 * 60 * 1000,
            })
            .json({
                message: "Đăng ký tk thành công",
                access_token: access_token,
                user,
            });
    } catch (error) {}
};

export const signin = async (req, res) => {
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

        return res
            .status(201)
            .cookie("token", refresh_token, {
                httpOnly: true,
                samsite: "strict",
                maxAge: 2 * 24 * 60 * 60 * 1000,
            })
            .json({
                message: "Đăng nhập tk thành công",
                access_token: access_token,
                user: userDb,
            });
    } catch (error) {}
};

export const getAuth = async (req, res) => {
    try {
        res.status(200).json({ message: "Get user login successfuly !!", user: req.user });
    } catch (error) {
        console.log(error);
    }
};

export const logout = async (req, res) => {
    try {
        res.status(200).clearCookie("refresh_token").json({ message: "Logout successfully" });
    } catch (error) {
        console.log(error);
    }
};
export const refreshToken = async (req, res) => {
    try {
        if (!req.cookies.refresh_token) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập" });
        }
        const resfreshToken = req.cookies.refresh_token.split(" ")[1];

        jwt.verify(resfreshToken, "secretKey", async (error, payload) => {
            if (error) {
                return res.status(401).json({ message: error.name });
            }

            const new_access_token = jwt.sign({ _id }, "secretKey", { expiresIn: "1d" });
            const new_refresh_token = jwt.sign({ _id }, "secretKey", { expiresIn: "2d" });

            res.status(200)
                .cookie("token", new_refresh_token, {
                    httpOnly: true,
                    samsite: "strict",
                    maxAge: 2 * 24 * 60 * 60 * 1000,
                })
                .json({ access_token: new_access_token });
        });
    } catch (error) {
        console.log(error);
    }
};
