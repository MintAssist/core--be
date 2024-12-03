const { QueueManager } = require("@knfs-tech/bamimi-schedule")
const { renderTemplate } = require("../../utils/mail")

module.exports = (data) => {
	const html = renderTemplate("otp-auth.ejs", {
		username: data?.username,
		email: data.email,
		token: data.token,
		activeLink: data?.activeLink,
		exp: data.exp
	})
	const queueManager = QueueManager.getInstance()
	queueManager.getQueue("emailOTPQueue").add("sendMailOTP", {
		to: data.email,
		subject: "Your two-factor authentication code",
		html
	})
}