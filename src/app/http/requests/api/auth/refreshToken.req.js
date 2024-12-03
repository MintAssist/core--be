const { body } = require("express-validator");

module.exports = [
	body("refreshToken")
		.notEmpty()
		.withMessage("Refresh token is required.")
		.isString()
		.withMessage("Refresh token must be a string.")
		.isLength({ min: 50 })
		.withMessage("Refresh token is too short.")
		.trim()
		.escape(),
];
