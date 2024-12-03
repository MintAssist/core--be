const mongoose = require("../../../kernel/database");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
	title: { type: String, required: false },
	url: {
		type: String,
		required: true,
		validate: {
			validator: function (v) {
				return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
			},
			message: props => `${props.value} is not a valid URL!`
		}
	},
	originalText: { type: String, required: true },
	language: {
		type: String,
		// enum: global.$_constant.business.note.langs.map(lang => lang.name),
		required: false
	},
	topic: {
		type: String,
		required: false
	},
	summaries: [{ type: Schema.Types.ObjectId, ref: 'Summary' }],
	translations: [{ type: Schema.Types.ObjectId, ref: 'Translate' }],
	categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	similarArticles: [{ type: Schema.Types.ObjectId, ref: 'SimilarArticle' }],
	relates: [{ type: Schema.Types.ObjectId, ref: 'RelatedKnowledge' }],
}, {
	timestamps: true,
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
