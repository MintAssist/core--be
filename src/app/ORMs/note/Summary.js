const mongoose = require("../../../kernel/database");
const Schema = mongoose.Schema;

const summarySchema = new Schema({
	noteId: { type: Schema.Types.ObjectId, ref: 'Note', required: true },
	language: {
		type: String,
		// enum: global.$_constant.business.note.langs.map(lang => lang.name),
		required: true
	},
	content: { type: String, required: true }
}, {
	timestamps: true,
});

const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;
