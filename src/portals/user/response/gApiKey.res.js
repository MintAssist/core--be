
module.exports = {
	getOne: function (user) {
		const startLength = 5;
		const endLength = 5;

		return user.googleGenerateApiKey ? user.googleGenerateApiKey.substring(0, startLength)
			+ '*************************'
			+ user.googleGenerateApiKey.substring(user.googleGenerateApiKey.length - endLength)
			: null
	},
}