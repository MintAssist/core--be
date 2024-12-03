const User = require("./../ORMs/user/User")
const {
	sendVerificationEmail,
	sendResetPasswordEmail,
	sendChangePasswordSuccessfullyEmail
} = require("./notification.service")
const { recoveryPassword, auth } = require("../../libs/auth.lib");
const PasswordBasedAuth = require("./../../kernel/auth").getPasswordBasedAuth()
const jwt = require("./../../kernel/auth").getJWT();

module.exports = {
	registerUser: async function ({ email, password, role = "user" }) {
		try {
			const newUser = new User({
				email,
				password,
				role
			});

			await newUser.save()

			const userResponse = {
				_id: newUser._id,
				email: email,
				state: newUser.state,
			}

			sendVerificationEmail(userResponse)

			return userResponse;
		} catch (error) {
			console.error(error)
			throw new Error('Error register user');
		}
	},
	verifyNewAccount: async function ({userId, otp}) {
		try {
			const validOtp = await auth.checkOTP(userId, otp)
			if (validOtp) {
				const currentUser = await User.findById(userId)
				currentUser.state = global.$_constant.business.user.state.activated
				await currentUser.save()

				const tokens = await this._attempt({
					_id: currentUser._id,
					state: currentUser.state,
					email: currentUser.email
				})

				await auth.deleteOTP(userId)

				return {
					user: {
						_id: userId,
						email: currentUser.email,
						role: currentUser.role,
						state: newUser.state,
					},
					accessToken: tokens.accessToken,
					refreshToken: tokens.refreshToken
				}
				
			} else {
				return false
			}
		} catch (error) {
			console.error(error)
			throw new Error('Error verify new email');
		}
	},
	reVerifyEmail: async function({ email }) {
		try {
			const currentUser = await User.findOne({ email: email, state: global.$_constant.business.user.state.isVerifying }).exec()
			if (currentUser) {
				sendVerificationEmail({
					_id: currentUser._id,
					email,
				})

				return true
			} else {
				return false
			}
		} catch (error) {
			console.error(error)
			throw new Error('Error reverify email password');
		}
	},
	loginUser: async function (verifyData = { id, password, rememberMe: false }) {
		try {
			const currentUser = await User.findOne({ email: verifyData.id, state: global.$_constant.business.user.state.activated }).exec()

			if (!currentUser) {
				return false
			}

			const verify = await PasswordBasedAuth.check(currentUser, verifyData, { idFields: ["email"], pinField: "password" })

			if (!verify) {
				return false
			}

			const tokens = await this._attempt({
				_id: currentUser._id,
				state: currentUser.state,
				email: currentUser.email,
				role: currentUser.role
			}, verifyData.rememberMe)


			return {
				user: {
					_id: currentUser._id,
					email: currentUser.email,
					role: currentUser.role,
					state: currentUser.state,
				},
				accessToken: tokens.accessToken,
				refreshToken: tokens.refreshToken
			}
		} catch (error) {
			console.log(error)
			throw new Error('Error login user');
		}
	},
	logout: async function ({ accessToken, refreshToken = "" }) {
		try {
			if ("" !== refreshToken) {
				await jwt.setBlacklist(refreshToken)
			}

			return await jwt.setBlacklist(accessToken)
		} catch (error) {
			console.log(error)
			throw new Error('Error logout user');
		}
	},

	forgetPassword: async function ({ email }) {
		try {
			const currentUser = await User.findOne({ email: email, state: global.$_constant.business.user.state.activated }).exec()
			if (currentUser) {
				sendResetPasswordEmail({
					_id: currentUser._id,
					email,
					role: currentUser.role
				})

				return currentUser
			} else {
				return false
			}
		} catch (error) {
			console.error(error)
			throw new Error('Error forget password');
		}
	},

	resetPassword: async function ({ userId, newPassword, otp  }) {
		try {
			const validOtp = await recoveryPassword.checkOTP(userId, otp)
			if (validOtp) {
				const currentUser = await User.findById(userId)
				currentUser.password = newPassword
				await currentUser.save()
				await recoveryPassword.deleteOTP(userId)

				sendChangePasswordSuccessfullyEmail({
					_id: currentUser._id,
					email: currentUser.email,
				})

				return true

			} else {
				return false
			}
		} catch (error) {
			console.error(error)
			throw new Error('Error reset password');
		}
	},

	changePassword: async function ({ userId, newPassword }) {
		try {
			const currentUser = await User.findById(userId)
			if (!currentUser) {
				return false
			}
			currentUser.password = newPassword
			await currentUser.save()

			sendChangePasswordSuccessfullyEmail({
				_id: currentUser._id,
				email: currentUser.email,
			})
			return true
			
		} catch (error) {
			console.error(error)
			throw new Error('Error reset password');
		}
	},

	refreshToken: async function ({ refreshToken }) {
		try {
			const verifiedPayload = await jwt.verify(refreshToken, true).catch(error => {
				return {
					error
				}
			})

			if (!verifiedPayload || verifiedPayload.error) {
				return false
			}
			
			const infoToken = {
				_id: verifiedPayload._id,
				email: verifiedPayload.email,
				state: verifiedPayload.state,
				role: verifiedPayload.role,
				refreshToken
			}

			const accessToken = await jwt.generateAccessToken(infoToken)

			return accessToken
		} catch (error) {
			console.error(error)
			throw new Error('Error refresh password');
		}
	},

	_attempt: async function ({
		_id,
		email,
		state,
		role
	}, rememberMe = false) {
		const infoToken = {
			_id,
			email,
			state,
			role
		}

		let refreshToken = ""
		if (rememberMe) {
			refreshToken = await jwt.generateRefreshToken(infoToken)
		}

		infoToken.refreshToken = refreshToken
		const accessToken = await jwt.generateAccessToken(infoToken)
		return {
			accessToken,
			refreshToken
		}
	},
}