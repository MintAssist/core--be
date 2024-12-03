"use strict";

const AuthService = require("./../../../services/auth.service")

module.exports = {
    signIn: async function (req, res, next) {
        try {
            const payload = {
                id: req.body.email,
                password: req.body.password,
                rememberMe: req.body.rememberMe ?? false
            }

            const verify = await AuthService.loginUser(payload)
            if (!verify) {
                return res.status(400).sendMessage([
                    {
                        "msg": global.$_errorCodeResponse.auth.loginPayloadInvalid,
                        "key": "loginPayloadInvalid"
                    }
                ])
            }

            return await res.status(200).sendMessage(verify);
        } catch (error) {
            next(error)
        }
    },

    signOut: async function (req, res, next) {
        try {
            const payload = {
                accessToken: req.session.accessToken,
            }

            await AuthService.logout(payload)
            return await res.status(204).sendMessage();
        } catch (error) {
            next(error)
        }
    },

    signUp: async function (req, res, next) {
        try {
            const payload = {
                email: req.body.email,
                password: req.body.password
            }

            const user = await AuthService.registerUser(payload)
            return await res.status(201).sendMessage({
                user
            });
        } catch (error) {
            next(error)
        }
    },

    reVerifyEmail: async function (req, res, next) {
        try {
            const payload = {
                email: req.body.email,
            }

            const verify = await AuthService.reVerifyEmail(payload)
            if (!verify) {
                return await res.status(400).sendMessage([
                    {
                        "msg": global.$_errorCodeResponse.auth.reVerifyInvalid,
                        "key": "reVerifyInvalid"
                    }
                ])
            }

            return await res.status(204).sendMessage();
        } catch (error) {
            next(error)
        }
    },

    verifyEmail: async function(req, res, next) {
        try {
            const payload = {
                userId: req.body.id,
                otp: req.body.otp
            }

            const verify = await AuthService.verifyNewAccount(payload)
            if (!verify) {
                return await res.status(400).sendMessage([
                    {
                        "msg": global.$_errorCodeResponse.auth.otpInvalid,
                        "key": "otpInvalid"
                    }
                ])
            }

            return await res.status(202).sendMessage({
                user: verify.user,
                accessToken: verify.accessToken,
                refreshToken: verify.refreshToken
            });
        } catch (error) {
            next(error)
        }
    },

    forgetPassword: async function (req, res, next) {
        try {
            const payload = {
                email: req.body.email,
            }

            const verify = await AuthService.forgetPassword(payload)
            if (!verify) {
                return res.status(400).sendMessage([
                    {
                        "msg": global.$_errorCodeResponse.auth.forgetPasswordInvalid,
                        "key": "forgetPasswordInvalid"
                    }
                ])
            }
            return await res.status(204).sendMessage();
        } catch (error) {
            next(error)
        }
    },

    resetPassword: async function (req, res, next) {
        try {
            const payload = {
                userId: req.body.id,
                otp: req.body.otp,
                newPassword: req.body.newPassword
            }

            const verify = await AuthService.resetPassword(payload)
            if (!verify) {
                return res.status(400).sendMessage([
                    {
                        "msg": global.$_errorCodeResponse.auth.resetPasswordInvalid,
                        "key": "resetPasswordInvalid"
                    }
                ])
            }
            return await res.status(204).sendMessage();
        } catch (error) {
            next(error)
        }
    },

    refreshToken: async function (req, res, next) {
        try {
            const payload = {
                refreshToken: req.body.refreshToken,
            }

            const verify = await AuthService.refreshToken(payload)
            if (!verify) {
                return res.status(401).sendMessage([
                    {
                        "msg": global.$_errorCodeResponse.auth.refreshTokenInvalid,
                        "key": "refreshTokenInvalid"
                    }
                ])
            }

            return await res.status(200).sendMessage({
                accessToken: verify
            });
        } catch (error) {
            next(error)
        }
    }
};