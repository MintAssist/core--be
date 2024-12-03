"use strict";
const router = require("express").Router();

const { validateApi: validate } = require("../../../../utils/validate");

const Controller = require("../../controllers/api/user.controller");

const gmReq = require("../../requests/user/getMany.req")
const createReq = require("../../requests/user/create.req")
const editReq = require("../../requests/user/edit.req")
const editInfoReq = require("../../requests/user/updateInfo.req")

router.get("/", validate(gmReq), Controller.index);
router.post("/", validate(createReq), Controller.create);
router.get("/:userId", Controller.getById);
router.put("/:userId/user-infos", validate(editInfoReq), Controller.updateUserInfo);
router.put("/:userId", validate(editReq), Controller.update);

module.exports = router;

