"use strict";
const router = require("express").Router();

const { validateApi: validate } = require("../../../../utils/validate");

const Controller = require("../../controllers/api/note.controller");

const gmReq = require("../../requests/note/getMany.req")
const gmsReq = require("../../requests/note/getManySummary.req")
const gmtReq = require("../../requests/note/getManyTranslation.req")
const gmrReq = require("../../requests/note/getManyRelation.req")

router.get("/", validate(gmReq), Controller.index);
router.get("/:noteId/summaries", validate(gmsReq), Controller.getSummaries);
router.get("/:noteId/translations", validate(gmtReq), Controller.getTranslations);
router.get("/:noteId/relations", validate(gmrReq), Controller.getRelations);
router.get("/:noteId", Controller.getById);

module.exports = router;

