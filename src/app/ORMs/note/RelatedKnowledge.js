const mongoose = require("../../../kernel/database");
const Schema = mongoose.Schema;

const relatedKnowledgeSchema = new Schema({
	noteId: { type: Schema.Types.ObjectId, ref: 'Note', required: true },
	title: { type: String, required: true },
	language: {
		type: String,
		// enum: global.$_constant.business.note.langs.map(lang => lang.name),
		required: true
	},
	description: { type: String, required: true },
	hardLevel: {
		type: String,
		enum: Object.values(global.$_constant.business.note.hardLevel),
		require: true
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
}, {
		timestamps: true,
});

const RelatedKnowledge = mongoose.model('RelatedKnowledge', relatedKnowledgeSchema);

module.exports = RelatedKnowledge;
