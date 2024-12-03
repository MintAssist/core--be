"use strict";
const {
	updateUserInfo,
	updateGoogleGenerateApiKey,
} = require("../../../../modules/user/services/command.service");

const { 
	changePassword
} = require("../../../../app/services/auth.service")
const {
	getById
} = require("../../../../modules/user/services/query.service");

const Response = require("./../../response/me.res")
const ApiKeyResponse = require("./../../response/gApiKey.res")

module.exports = {
	getDetail: async function (req, res) {
		try {
			const userId = req.session.currentUser._id
			const user = await getById(userId);

			if (!user) {
				return res.status(404).sendMessage({
					"msg": global.$_errorCodeResponse.common.notFound,
					"key": "notFound"
				});
			}
			return res.status(200).sendMessage({
				user: Response.getOne(user)
			});
		} catch (error) {
			next(error)
		}
	},
	getGApiKey: async function (req, res, next) {
		try {
			const userId = req.session.currentUser._id
			const user = await getById(userId);

			if (!user) {
				return res.status(404).sendMessage({
					"msg": global.$_errorCodeResponse.common.notFound,
					"key": "notFound"
				});
			}

			return res.status(200).sendMessage({
				apiKey: ApiKeyResponse.getOne(user)
			});
		} catch (error) {
			next(error)
		}
	},
	updateGoogleGenerateApiKey: async function (req, res, next) {
		try {
			const apiKey = req.body.apiKey
			const userId = req.session.currentUser._id
			await updateGoogleGenerateApiKey(userId, apiKey);

			return res.status(200).sendMessage({
				message: "Successful"
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

			const userId = req.session.currentUser._id
			await updateUserInfo(userId, payload);

			return res.status(200).sendMessage({
				msg: "Successful"
			});
		} catch (error) {
			next(error)
		}
	},

	changePassword: async function (req, res, next) {
		try {
			const payload = {
				userId: req.session.currentUser._id,
				newPassword: req.body.password
			}

			const update = await changePassword(payload)
			if (!update) {
				return res.status(400).sendMessage([
					{
						"msg": global.$_errorCodeResponse.auth.changePasswordInvalid,
						"key": "changePasswordInvalid"
					}
				])
			}
			return await res.status(200).sendMessage({
				msg: "Successful"
			});
		} catch (error) {
			next(error)
		}
	},
};
