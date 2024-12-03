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
				
				const total = await User.countDocuments({email});
				if (total === 0) {
					return Promise.reject("Email not exist");
				}
			} catch (error) {
				await global.$_logger.error(error);
				throw new Error("Error checking email.");
			}
		}),
];
