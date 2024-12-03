const { body } = require("express-validator");
const User = require("./../../../../ORMs/user/User")

module.exports = [
	body("id")
		.notEmpty()
		.withMessage("UserId is required.")
		.isMongoId()
		.withMessage("Invalid UserId format.")
		.trim()
		.custom(async (userId) => {
			try {
				const total = await User.countDocuments({ _id: userId });
				if (total === 0) {
					return Promise.reject("User not exist");
				}
			} catch (error) {
				await global.$_logger.error(error);
				throw new Error("Error checking userId.");
			}
		}),

	body("otp")
		.notEmpty()
		.withMessage("OTP is required.")
		.isLength({ min: 10, max: 10 })
		.withMessage("OTP must be 10")
		.matches(/^[0-9]{10}$/)
		.withMessage("OTP must include number"),
	
	body("newPassword")
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
