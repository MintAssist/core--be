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

	query("shortText")
		.optional()
		.isString()
		.withMessage("Short Text must be a string.")
		.isLength({ max: 200 })
		.withMessage("Short Text must not exceed 200 characters.")
		.trim()
		.escape(),
	query("title")
		.optional()
		.isString()
		.withMessage("Title must be a string.")
		.isLength({ max: 200 })
		.withMessage("Title must not exceed 200 characters.")
		.trim()
		.escape(),

	query("hardLevel")
		.optional()
		.isArray()
		.withMessage("Hard Level must be a array.")
		.isIn(Object.keys(global.$_constant.business.note.hardLevel))
		.withMessage(`Hard Level must be one of the following: ${Object.keys(global.$_constant.business.note.hardLevel).toString()}.`),
	
	query("order")
		.optional()
		.isObject()
		.withMessage("Order must be an object.")
		.custom(value => {
			const allowKeys = ['title', 'language', 'hardLevel']
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