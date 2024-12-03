"use strict";

const langs = require("./langs");

module.exports = {
    page: {
        index: 1,
        limit: 20,
        maxLimit: 300
    },
    business: {
        user: {
            gender: ['male', 'female', 'other'],
            state: {
                isVerifying: 0,
                activated: 1,
                deactivated: -1
            },
            jobs: require("./popularJobs"),
            nations: require("./country"),
        },
        note: {
            langs: require("./langs"),
            hardLevel: {
                advanced: "Advanced",
                intermediate: "Intermediate",
                newbie: "Newbie",
                beginner: "Beginner",
            }
        },
        roles: {
            user: 1, //001
            admin: 2, // 010
            superAdmin: 3 // 100
        }
    }
};