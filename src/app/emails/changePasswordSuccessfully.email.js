const { QueueManager } = require("@knfs-tech/bamimi-schedule")
const { renderTemplate } = require("../../utils/mail");

module.exports = (data) => {
	const html = renderTemplate("change-password-successfully.ejs", {
		email: data.email,
	});

	const queueManager = QueueManager.getInstance()
	queueManager.getQueue("emailQueue").add("sendMail", {
		to: data.email,
		subject: "Password Change Success",
		html: html
	});
};