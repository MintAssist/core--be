
module.exports = (config) => {
	const { Sequelize } = require("sequelize");
	return new Sequelize(config);
}