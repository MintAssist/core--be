"use strict";
const router = require("express").Router();

const { validateApi: validate } = require("../../../../utils/validate");

const Controller = require("../../controllers/api/me.controller");

const updateRequest = require("../../requests/me/update.req")
const chpRequest = require("../../requests/me/changePassword.req")

router.get("/", Controller.getDetail);
router.put("/", validate([updateRequest]), Controller.updateUserInfo);
router.get("/google-generate-api-key", Controller.getGApiKey);
router.patch("/google-generate-api-key", validate([]), Controller.updateGoogleGenerateApiKey);
router.patch("/change-password", validate([chpRequest]), Controller.changePassword);

module.exports = router;

