
const config = require("../../configs/database");

let db;

if (config.typeDatabase === "sql") {
	db = require("./sequelize")(config.sql.development)
} else {
	switch (config.nosql.connection) {
		case "mongodb":
			db = require("./mongodb")(config.nosql.mongodb)
			break;
	}

}

module.exports = db;