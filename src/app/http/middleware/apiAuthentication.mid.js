"use strict";
const auth = require("../../../kernel/auth")
const jwt = auth.getJWT()

module.exports = async (req, res, next) => {
	try {
		if (!req.headers.authorization) {
			return res.status(400).sendMessage([
				{
					"msg": global.$_errorCodeResponse.auth.tokenNotExist,
					"key": "tokenNotExist"
				}
			])
		}
		const authorization = req.headers.authorization.split(" ");
		const typeAuth = authorization[0];

		if (!typeAuth || "Bearer" !== typeAuth) {
			return res.status(401).sendMessage([
				{
					"msg": global.$_errorCodeResponse.auth.authInvalid,
					"key": "authInvalid"
				}
			])
		}

		const token = authorization[1];
		const verifiedPayload = await jwt.verify(token).catch(error => {
			return {
				error
			}
		})

		if (!verifiedPayload || verifiedPayload.error) {
			return res.status(401).sendMessage([
				{
					"msg": global.$_errorCodeResponse.auth.tokenInvalid,
					"key": "tokenInvalid"
				}
			])
		}

		const checkBlacklist = await jwt.checkBlacklist(token)

		if (checkBlacklist) {
			return res.status(401).sendMessage([
				{
					"msg": global.$_errorCodeResponse.auth.tokenInvalid,
					"key": "tokenInvalid"
				}
			])
		}

		req.session.currentUser = verifiedPayload
		req.session.accessToken = token
		next()
	} catch (error) {
		console.error(error)
		throw new Error("Auth error!")
	}
}
