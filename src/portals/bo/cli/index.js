const { Command } = require("commander");
const CommandService = require("../../../modules/user/services/command.service")
const constants = require("./../../../configs/constant")
const runCommand = new Command();

runCommand
	.name("admin")
	.command("createSuperAdmin <email> <password>")
	.description("Create a Super Admin account")
	.action(async (email, password) => {
		try {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				throw new Error("Invalid email format.");
			}
			console.log(email, password)

			const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
			console.log(`Checking password: ${password}`); // Debug mật khẩu nhập vào
			if (!passwordRegex.test(password.trim())) {
				console.log(`Password failed regex check: ${password}`);
				throw new Error("Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character.");
			}

			// Tạo payload cho user
			const payload = {
				email,
				password,
				role: "superAdmin",
				state: constants.business.user.state.activated,
			};

			// Gọi service tạo user
			const user = await CommandService.create({ user: payload, userInfo: null });

			console.log(`Super Admin created successfully: ${email}`);
			process.exit(0);
		} catch (error) {
			console.error("Error creating Super Admin:", error.message);
			process.exit(1);
		}
	});

module.exports = runCommand;
