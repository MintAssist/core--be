"use strict";

const cacheCore = require("../kernel/cache")
const config = require("../configs/auth")
const securityUtils = require("./../utils/security")

function generateOTP(key, length, ext) {
	const optionsGenerateOTP = {
		length,
		includeUppercase: false,
		includeLowercase: false,
		includeNumbers: true,
		includeSymbols: false
	};
	const OTP = securityUtils.generateRandomPassword(optionsGenerateOTP)
	const cache = cacheCore.getStorage().singleton
	Promise.resolve(cache.set(key, OTP, 'EX', ext, (err, result) => {
		if (err) {
			console.error('Error setting key with expiration:', err);
		} else {
			console.log('Set key with expiration result:', result);
		}
	}))

	return OTP;
}

async function checkOTP(key, otp) {
	const cache = cacheCore.getStorage().singleton
	const value = await cache.get(key)
	if (!value || value !== otp) {
		return false
	}

	return true
}

async function deleteOTP(key) {
	const cache = cacheCore.getStorage().singleton
	return await cache.del(key)
}

const recoveryPassword = () => {
	const RECOVERY_PASSWORD_OTP = 'RECOVER_PASSWORD_OTP'

	return {
		getOTP: (userId) => {
			const key = RECOVERY_PASSWORD_OTP + '-' + userId
			return generateOTP(key, 10, config.OTP.recoveryPassword.ext,)
		},
		checkOTP: (userId, otp) => {
			const key = RECOVERY_PASSWORD_OTP + '-' + userId
			return checkOTP(key, otp)
		},
		deleteOTP: (userId) => {
			const key = RECOVERY_PASSWORD_OTP + '-' + userId
			return deleteOTP(key)
		}
	}
}

const auth = () => {
	const AUTH_OTP = 'AUTH_OTP'

	return {
		getOTP: (userId) => {
			const key = AUTH_OTP + '-' + userId
			return generateOTP(key, 6, config.OTP.auth.ext,)
		},
		checkOTP: (userId, otp) => {
			const key = AUTH_OTP + '-' + userId
			return checkOTP(key, otp)
		},
		deleteOTP: (userId) => {
			const key = AUTH_OTP + '-' + userId
			return deleteOTP(key)
		}
	}
}

module.exports = {
	recoveryPassword: recoveryPassword(),
	auth: auth()
}