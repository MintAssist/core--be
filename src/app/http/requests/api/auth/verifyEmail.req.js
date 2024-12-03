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
		.isLength({ min: 6, max: 6 })
		.withMessage("OTP must be 6")
		.matches(/^[0-9]{6}$/)
		.withMessage("OTP must include number"),
];
