const { body } = require("express-validator");

module.exports = [
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