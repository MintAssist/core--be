const mongoose = require("../../../kernel/database");
const Schema = mongoose.Schema;

const detailSchema = new Schema({
	noteId: { type: Schema.Types.ObjectId, ref: 'Note', required: true }, // Tham chiếu đến Note
	language: {
		type: String,
		enum: global.$_constant.business.note.langs.map(lang => lang.name),
		required: true
	},
	topic: {
		type: String, required: true
	},
}, {
	timestamps: true,
});

const Detail = mongoose.model('Detail', detailSchema);

module.exports = Detail