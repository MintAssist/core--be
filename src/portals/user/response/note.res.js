
module.exports = {
	getOne: function (note) {
		const response =  {
			_id: note._id,
			title: note.title,
			url: note.url,
			language: note.language,
		}

		return response;
	},
	getMany: function (notes) {
		const startLength = 30; 
		const endLength = 10;

		return notes.map(note => {
			return {
				_id: note._id,
				title: note.title,
				url: note.url,
				language: note.language,
				topic: note.topic,
				originalText: note.originalText,
				shortText: note.originalText.substring(0, startLength) + '...' + note.originalText.substring(note.originalText.length - endLength),
				summariesCount: note.summariesCount,
				translationsCount: note.translationsCount,
				similarArticlesCount: note.similarArticlesCount,
				relatesCount: note.relatesCount,
				createdAt: note.createdAt
			}
		})
	}
}