import Joi from "joi";

export const signupValidator = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().required().messages({
            "string.empty": "Tên không được để trống",
            "any.required": "Trường tên là bắt buộc",
        }),
        email: Joi.string().email().required().messages({
            "string.empty": "Email không được để trống",
            "any.required": "Trường email là bắt buộc",
            "string.email": "Email không đúng định dạng",
        }),
        password: Joi.string().required().min(6).messages({
            "string.empty": "Mật khẩu không được để trống",
            "any.required": "Trường mật khẩu là bắt buộc",
            "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
        }),
        confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
            "string.empty": "Xác nhận mật khẩu không được để trống",
            "any.required": "Trường xác nhận mật khẩu là bắt buộc",
            "any.only": "Xác nhận mật khẩu không khớp",
        }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((err) => err.message);

        return res.status(400).json({
            messages: errors,
        });
    }

    next();
};
export const signinValidator = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.empty": "Email không được để trống",
            "any.required": "Trường email là bắt buộc",
            "string.email": "Email không đúng định dạng",
        }),
        password: Joi.string().required().min(6).messages({
            "string.empty": "Mật khẩu không được để trống",
            "any.required": "Trường mật khẩu là bắt buộc",
            "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
        }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((err) => err.message);

        return res.status(400).json({
            messages: errors,
        });
    }

    next();
};
