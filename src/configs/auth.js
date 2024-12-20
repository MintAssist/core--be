"use strict";
require("dotenv").config();

module.exports = {
    /**
	 * Read more at:
	 * @link("https://github.com/expressjs/cors#readme")
	 */
    cors: {
        origin: "*",
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: "Authorization",
        credentials: false
    },
    sessionSecret: process.env.SESSION_SECRET,
    socketToken: process.env.TOKEN_SOCKET ?? "",
    authenticate: {
        accessPassword: {
            idFields: ["email"], // fields id to verify, you can use with multiple ['username', 'email']
            pinField: ["password"] // field as password, you can use with other name field
        },
        tokenBasedToken: {
            accessToken: {
                secretKey: process.env.SECRET_KEY,
                options: {
                    expiresIn: "1d"
                }
            },
            refreshToken: {
                secretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
                options: {
                    expiresIn: "30d"
                },
                multiple: false, // if you want to multiple refresh token, in case multiple device
                use: false // if you want to use refresh token
            },
            useBlacklist: true, // if you want to black list to block token
            // storage for save refresh token (in case using multiple) and use black list
            storage: {
                /**
				 * @type {Enum("memory", "redis")}
				 */
                type: "redis",
                options: {
                    host: process.env.REDIS_CACHE_HOST || "127.0.0.1",
                    port: Number(process.env.REDIS_CACHE_PORT) || 6379,
                    username: process.env.REDIS_CACHE_USER || null,
                    password: process.env.REDIS_CACHE_PASS || null,
                    db: process.env.REDIS_CACHE_DB || "0",
                } // if you redis, it is connection info of redis, In code we use ioredis
            },
            // fields of origin data to create token
            fields: [
                "id",
                "username",
                "email"
            ]
        },
        mfa: {
            appName: "alfred",
            fieldId: "id" // id for uri auth and Qrcode
        }
    },
    OTP: {
        recoveryPassword: {
            ext: 5 * 60
        },
        auth: {
            ext: 5 * 60
        }
    }
};