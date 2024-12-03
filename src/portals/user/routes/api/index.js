"use strict";
const router = require("express").Router();

router.use("/me", require("./me"));
router.use("/assistants", require("./assistant"));
router.use("/notes", require("./note"));

module.exports = router;

