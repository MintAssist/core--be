const { body } = require("express-validator");
const User = require("./../../../../ORMs/user/User")

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
];
