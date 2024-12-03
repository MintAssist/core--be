"use strict";
const QueryService = require("../../../../modules/user/services/query.service");
const CommandService = require("../../../../modules/user/services/command.service")

const UserResponse = require("./../../response/user.res")
module.exports = {
    index: async function (req, res, next) {
        try {
            const query = {
                page: parseInt(req.query?.page) || global.$_constant.page.index,
                size: parseInt(req.query?.size) || global.$_constant.page.limit,
                email: req.query?.email ?? null,
                state: req.query?.state ?? "*",
                roles: req.query?.role ?? "*",
                order: req.query?.order ?? null
            };


            let result = await QueryService.getMany(query);

            return res.status(200).sendMessage({
                total: result.total,
                users: UserResponse.getMany(result.data),
                max: Math.ceil(result.total / query.size) ?? 1,
                query
            });
        } catch (error) {
            next(error)
        }
    },
    create: async function (req, res, next) {
        try {
            const payload = {
                email: req.body.email,
                password: req.body.password,
                role: req.body.role,
                state: req.body.state,
            }

            const user = await CommandService.create({ user: payload, userInfo: null })
            return await res.status(201).sendMessage({
                user: UserResponse.getOne(user)
            });
        } catch (error) {
            next(error)
        }
    },
    update: async function (req, res, next) {
        try {
            const userId = req.params.userId
            const user = await QueryService.getById(userId);
            
            if (!user) {
                return res.status(404).sendMessage({
                    "msg": global.$_errorCodeResponse.common.notFound,
                    "key": "notFound"
                });
            }

            const payload = {
                role: req.body.role,
                state: req.body.state,
            }

            await CommandService.update(userId, payload)
            return await res.status(200).sendMessage({
                msg: "Successful"
            });
        } catch (error) {
            next(error)
        }
    },
    updateUserInfo: async function (req, res, next) {
        try {
            const payload = {
                "firstName": req.body.firstName,
                "lastName": req.body.lastName,
                "gender": req.body.gender,
                "phone": req.body.phone ?? null,
                "age": req.body.age ?? null,
                "nation": req.body.nation ?? null,
                "job": req.body.job ?? "Other"
            };

            const userId = req.params.userId
            const user = await QueryService.getById(userId);

            if (!user) {
                return res.status(404).sendMessage({
                    "msg": global.$_errorCodeResponse.common.notFound,
                    "key": "notFound"
                });
            }

            await CommandService.updateUserInfo(userId, payload);

            return res.status(200).sendMessage({
                message: "Successful"
            });
        } catch (error) {
            next(error)
        }
    },
    getById: async function (req, res) {
        try {
            const userId = req.params.userId
            const user = await QueryService.getById(userId);

            if (!user) {
                return res.status(404).sendMessage({
                    "msg": global.$_errorCodeResponse.common.notFound,
                    "key": "notFound"
                });
            }
            return res.status(200).sendMessage({
                user: UserResponse.getOne(user)
            });
        } catch (error) {
            next(error)
        }
    },
};
