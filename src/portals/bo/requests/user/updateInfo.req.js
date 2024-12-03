const { body } = require("express-validator");
const User = require("./../../../../app/ORMs/user/User")

module.exports = [
	body("firstName")
		.notEmpty()
		.withMessage("First name is required.")
		.isString()
		.withMessage("First name must be a string.")
		.isLength({ min: 2, max: 50 })
		.withMessage("First name must be between 2 and 50 characters."),

	body("lastName")
		.notEmpty()
		.withMessage("Last name is required.")
		.isString()
		.withMessage("Last name must be a string.")
		.isLength({ min: 2, max: 50 })
		.withMessage("Last name must be between 2 and 50 characters."),

	body("gender")
		.notEmpty()
		.withMessage("Gender is required.")
		.isIn(global.$_constant.business.user.gender)
		.withMessage("Gender must be 'male', 'female', or 'other'."),

	body("phone")
		.optional()
		.isMobilePhone()
		.withMessage("Invalid phone number.")
		.custom(async (phone, { req }) => {
			try {
				const userId = req.params.userId;
				const total = await User.countDocuments({
					phone,
					_id: { $ne: userId } 
				});
				if (total > 0) {
					return Promise.reject("Phone number already exists.");
				}
			} catch (error) {
				console.error(error)
				throw new Error("Error checking phone number.");
			}
		}),

	body("age")
		.optional()
		.isInt({ min: 10, max: 120 })
		.withMessage("Age must be a number between 10 and 150."),

	body("nation")
		.optional()
		.isString()
		.withMessage("Nation must be a string.")
		.isIn(global.$_constant.business.user.nations.map(nation => nation.name))
		.withMessage(`Nation must belongs ${global.$_constant.business.user.nations.map(nation => nation.name).toString()}`),

	body("job")
		.optional()
		.isString()
		.isIn(global.$_constant.business.user.jobs)
		.withMessage(`Job must belongs ${global.$_constant.business.user.jobs.toString()}`)
		.isLength({ max: 100 })
		.withMessage("Job must not exceed 100 characters.")
];
