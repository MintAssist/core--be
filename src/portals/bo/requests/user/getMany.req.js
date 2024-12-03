const { query } = require("express-validator");

module.exports = [
	query("page")
		.optional()
		.isInt({ min: 1 })
		.withMessage("Page must be a positive integer.")
		.toInt(),

	query("size")
		.optional()
		.isInt({ min: 1, max: global.$_constant.page.limit })
		.withMessage("Size must be a positive integer.")
		.toInt(),

	query("email")
		.optional()
		.isString()
		.withMessage("Search must be a string.")
		.isLength({ max: 100 })
		.withMessage("Search must not exceed 100 characters.")
		.trim()
		.escape(),

	query("state")
		.optional()
		.isArray()
		.withMessage("State must be a array.")
		.isIn(Object.keys(global.$_constant.business.user.state))
		.withMessage(`State must be one of the following: ${Object.keys(global.$_constant.business.user.state).toString()}.`),

	query("role")
		.optional()
		.isArray()
		.withMessage("Role must be a array.")
		.isIn(Object.keys(global.$_constant.business.roles))
		.withMessage(`Role must be one of the following: ${Object.keys(global.$_constant.business.roles).toString()}.`),

	query("order")
		.optional()
		.isObject()
		.withMessage("Order must be an object.")
		.custom(value => {
			const allowKeys = ['email', 'state']
			if (!value.key || !value.value) {
				throw new Error("Order must have key and value.");
			}
			if (!allowKeys.includes(value.key)) {
				throw new Error(`Order value must be either ${allowKeys.toString()}.`);
			}
			if (!['ASC', 'DESC'].includes(value.value)) {
				throw new Error("Order value must be either 'ASC' or 'DESC'.");
			}
			return true;
		})
];