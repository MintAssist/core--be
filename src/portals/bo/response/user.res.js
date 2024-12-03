
module.exports = {
	getOne: function (user) {
		let state = ""
		let stateKey = ""
		switch (user.state) {
			case 0:
				state = "Is Verifying";
				stateKey = "isVerifying";
				break;
			case 1:
				state = "Activated";
				stateKey = "activated";
				break;
			case -1:
				state = "Deactivated";
				stateKey = "Deactivated";
				break;
		}

		let role = ""
		switch (user.role) {
			case "user":
				role = "User";
				break;
			case "admin":
				role = "Admin";
				break;
			case "superAdmin":
				role = "Super admin";
				break;
		}

		const response =  {
			_id: user._id,
			email: user.email,
			name: user.userInfo ? `${user.userInfo.firstName} ${user.userInfo.lastName}` : null,
			firstName: user.userInfo ? `${user.userInfo.firstName}` : null,
			lastName: user.userInfo ? `${user.userInfo.lastName}` : null,
			age: user.userInfo ? user.userInfo.age : null,
			gender: user.userInfo ? user.userInfo.gender : null,
			phone: user.userInfo ? user.userInfo.phone : null,
			nation: user.userInfo ? user.userInfo.nation : null,
			job: user.userInfo ? user.userInfo.job : null,
			createdAt: user.createdAt,
			roleKey: user.role,
			role,
			state,
			stateKey,
		}

		return response;
	},
	getMany: function (users) {
		return users.map(user => this.getOne(user))
	}
}