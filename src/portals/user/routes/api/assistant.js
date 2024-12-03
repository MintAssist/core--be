"use strict";
const router = require("express").Router();

const { validateApi: validate } = require("../../../../utils/validate");

const Controller = require("../../controllers/api/assistant.controller");

// const updateRequest = require("../../requests/ass/update.req")

router.post("/notes", Controller.saveContent);
router.post("/notes/tmp/analysis", Controller.createTMPAnalyzeContent);
router.post("/notes/tmp/summaries", Controller.createTMPSummaryContent);
router.post("/notes/tmp/relations", Controller.createTMPRelationContent);
router.post("/notes/tmp/translations", Controller.createTMPTranslateContent);

module.exports = router;

