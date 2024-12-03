const mongoose = require("../../../kernel/database");
const Schema = mongoose.Schema;

const similarArticleSchema = new Schema({
	noteId: { type: Schema.Types.ObjectId, ref: 'Note', required: true },
	title: { type: String, required: true },
	url: { type: String, required: true }, 
	description: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
}, {
	timestamps: true,
});

// Tạo model
const SimilarArticle = mongoose.model('SimilarArticle', similarArticleSchema);

module.exports = SimilarArticle;
