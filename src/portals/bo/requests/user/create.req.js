const { body } = require("express-validator");
const User = require("./../../../../app/ORMs/user/User")

module.exports = [
    body("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email format.")
        .trim()
        .normalizeEmail()
        .custom(async (email) => {
            try {
                const total = await User.countDocuments({ email });
                if (total > 0) {
                    return Promise.reject("Email exist");
                }
            } catch (error) {
                await global.$_logger.error(error);
                throw new Error("Error checking email.");
            }
        }),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8, max: 64 }) // follow OWASP 
        .withMessage("Password must be between 8 and 64 characters.")
        .matches(/[a-z]/)
        .withMessage("Password must include at least one lowercase letter.")
        .matches(/[A-Z]/)
        .withMessage("Password must include at least one uppercase letter.")
        .matches(/\d/)
        .withMessage("Password must include at least one number.")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Password must include at least one special character.")
        .escape(), // block XSS

    body("state")
        .notEmpty()
        .withMessage("State is required.")
        .isString()
        .withMessage("State must be a string.")
        .isIn(Object.keys(global.$_constant.business.user.state))
        .withMessage(`State must be one of the following: ${Object.keys(global.$_constant.business.user.state).toString()}.`),
    
    body("role")
        .notEmpty()
        .withMessage("State is required.")
        .isString()
        .withMessage("Role must be a array.")
        .isIn(Object.keys(global.$_constant.business.roles))
        .withMessage(`Role must be one of the following: ${Object.keys(global.$_constant.business.roles).toString()}.`),
]