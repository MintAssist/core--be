
module.exports = {
	getOne: function (summary) {
		const startLength = 30;
		const endLength = 10;

		const response =  {
			_id: summary._id,
			noteId: summary.noteId,
			language: summary.language,
			content: summary.content,
			shortText: summary.content.substring(0, startLength) + '...' + summary.content.substring(summary.content.length - endLength),
		}

		return response;
	},
	getMany: function (summaries) {
		return summaries.map(summary => this.getOne(summary))
	}
}