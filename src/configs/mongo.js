"use strict";
require("dotenv").config();

module.exports = {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "xxx",
    database: process.env.DB_DATABASE || "xxx",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
};
