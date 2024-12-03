
module.exports = {
	getOne: function (relation) {
		const startLength = 30;
		const endLength = 10;

		const response =  {
			_id: relation._id,
			title: relation.title,
			noteId: relation.noteId,
			language: relation.language,
			description: relation.description,
			shortText: relation.description.substring(0, startLength) + '...' + relation.description.substring(relation.description.length - endLength),
			hardLevel: relation.hardLevel,
		}

		return response;
	},
	getMany: function (relations) {
		return relations.map(relation => this.getOne(relation))
	}
}