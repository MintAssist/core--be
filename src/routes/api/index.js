"use strict";
const router = require("express").Router();

const trimData = require("../../app/http/middleware/trimData.mid")

const authenticate = require("./../../app/http/middleware/apiAuthentication.mid")
const authorize = require("./../../app/http/middleware/rbacAuthorization.mid")
const roles = global.$_constant.business.roles

router.use("/auth", trimData, require("./auth"))

/**
 * API portal back office
 */
router.use("/bo", trimData, authenticate,
	authorize({
		includeRoles: [
			roles.admin
		]
	}),
	require("./../../portals/bo/routes/api"))

/**
 * API portal user
 */
router.use("/u", trimData, authenticate,
	authorize({
		includeRoles: [
			roles.user
		],
		excludeRoles: [
			roles.admin,
			roles.superAdmin
		]
	}),
	require("./../../portals/user/routes/api"))

module.exports = router;
