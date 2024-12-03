"use strict";
const router = require("express").Router();
const authController = require("../../app/http/controllers/api/auth.controller")

const { validateApi: validate } = require("../../utils/validate");

const signInReq = require("./../../app/http/requests/api/auth/signIn.req")
const fpReq = require("./../../app/http/requests/api/auth/forgetPassword.req")
const rpReq = require("./../../app/http/requests/api/auth/resetPassword.req")
const vmReq = require("./../../app/http/requests/api/auth/verifyEmail.req")
const signUpReq = require("./../../app/http/requests/api/auth/signUp.req")
const rtReq = require("./../../app/http/requests/api/auth/refreshToken.req")

const authenticate = require("./../../app/http/middleware/apiAuthentication.mid")

router.post("/sign-in", validate(signInReq), authController.signIn);
router.post("/sign-up", validate(signUpReq), authController.signUp);
router.post("/forgot-password", validate(fpReq), authController.forgetPassword);
router.post("/reset-password", validate(rpReq), authController.resetPassword)
router.post("/sign-out", authenticate, authController.signOut);
router.post("/verify-email", validate(vmReq), authController.verifyEmail);
router.post("/reverify-email", validate(fpReq), authController.reVerifyEmail);
router.post("/refresh-token", validate(rtReq), authController.refreshToken);

module.exports = router;
