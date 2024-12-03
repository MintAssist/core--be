const mongoose = require("../../../kernel/database");
const Schema = mongoose.Schema;

const translateSchema = new Schema({
	noteId: { type: Schema.Types.ObjectId, ref: 'Note', required: true }, // Tham chiếu đến Note
	language: {
		type: String,
		// enum: global.$_constant.busin	ess.note.langs.map(lang => lang.name),
		required: true
	},
	content: { type: String, required: true }
}, {
	timestamps: true,
});

const Translate = mongoose.model('Translate', translateSchema);

module.exports = Translate