const { QueueManager } = require("@knfs-tech/bamimi-schedule")
const { renderTemplate } = require("../../utils/mail");

module.exports = (data) => {
	const html = renderTemplate("reset-password.ejs", {
		email: data.email,
		token: data.token,
		activeLink: data?.activeLink,
		exp: data.exp
	});

	const queueManager = QueueManager.getInstance()
	queueManager.getQueue("emailQueue").add("sendMail", {
		to: data.email,
		subject: "Recovery Password",
		html: html
	});
};