const User = require("../../../app/ORMs/user/User");

const {
	sendVerificationEmail,
} = require("./../../../app/services/notification.service")

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

module.exports = {
	create: async function ({ user = {
		email,
		password,
		role,
		state
	}, userInfo = {
		firstName,
		lastName,
		gender,
		phone,
		age,
		nation,
		job
	} }) {
		try {
			const newUser = new User({
				...user,
				state: global.$_constant.business.user.state[user.state],
				userInfo
			});

			await newUser.save()

			const userResponse = {
				_id: newUser._id,
				email: user.email,
				state: newUser.state
			}

			if (newUser.state === global.$_constant.business.user.state.isVerifying) {
				sendVerificationEmail(userResponse)
			}

			return userResponse;
		} catch (error) {
			console.error(error)
			throw new Error('Error register user');
		}
	},
	update: async function (userId, newInfo = {
		role,
		state
	}) {
		try {
			const currentUser = await User.findById(new ObjectId(userId))
			currentUser.role = newInfo.role,
			currentUser.state = global.$_constant.business.user.state[newInfo.state],
			await currentUser.save()
			return true

		} catch (error) {
			console.error(error)
			throw new Error('Error change password');
		}
	},
	changePassword: async function (userId, newPassword) {
		try {
			const currentUser = await User.findById(userId)
			currentUser.password = newPassword
			await currentUser.save()
			
			return true

		} catch (error) {
			console.error(error)
			throw new Error('Error change password');
		}
	},
	updateGoogleGenerateApiKey: async function (userId, apiKey) {
		try {
			const currentUser = await User.findById(userId)
			currentUser.googleGenerateApiKey = apiKey
			currentUser.save();

			return currentUser;
		} catch (error) {
			console.error(error)
			throw new Error("Update Google Generate Api Key user info error");
		}
	},
	updateUserInfo: async function (userId, changeData = {
		firstName,
		lastName,
		gender,
		phone,
		age,
		nation,
		job
	}) {
		try {
			const currentUser = await User.findById(userId)

			if (changeData && typeof changeData === "object") {
				currentUser.userInfo = {
					...currentUser.userInfo?.toObject(), // Retain existing fields
					...changeData // Update fields with new data
				};
			}
			currentUser.save();

			return currentUser;
		} catch (error) {
			console.error(error)
			throw new Error("Update user info error");
		}
	},
};
