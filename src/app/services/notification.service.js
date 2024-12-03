const verificationEmail = require("../emails/verificationEmail.email");
const resetPassword = require("../emails/resetPassword.email");
const changePasswordSuccessfully = require("../emails/changePasswordSuccessfully.email")
// const sendMailOTPAuth = require("./../emails/OTPAuth.email")
const { recoveryPassword, auth } = require("../../libs/auth.lib")
const configAuth = require("../../configs/auth")

module.exports = {
    sendVerificationEmail: function (user) {
        const mailData = {
            _id: user._id,
            email: user.email,
            exp: configAuth.OTP.auth.ext
        }
        const token = auth.getOTP(mailData._id)
        mailData.token = token
        
        mailData.activeLink = global.$_clientUrl(`support/verify-mail/${user._id}`, { token: token, email: user.email })

        verificationEmail(mailData);
    },
    sendResetPasswordEmail: function (user) {
        const mailData = {
            _id: user._id,
            email: user.email,
            exp: configAuth.OTP.recoveryPassword.ext
        }
        const token = recoveryPassword.getOTP(mailData._id)
        mailData.token = token
        mailData.activeLink = ""
        switch (user.role) {
            case "user":
                mailData.activeLink = global.$_clientUrl(`support/reset-password/${user._id}`, { token: token })
                break;
            case "admin":
            case "superAdmin":
                mailData.activeLink = global.$_clientUrl(`support/reset-password/${user._id}`, { token: token }, "webBoUrl")
                break;
        }

        resetPassword(mailData);
    },
    sendChangePasswordSuccessfullyEmail: function (user) {
        const mailData = {
            _id: user._id,
            email: user.email,
        }

        changePasswordSuccessfully(mailData);
    }
};