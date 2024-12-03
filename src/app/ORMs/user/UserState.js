const mongoose = require("../../../kernel/database");
const Schema = mongoose.Schema;

const userStateSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId(),
    },
    value: {
        type: String,
        enum: global.$_constant.business.user.state,
        default: global.$_constant.business.user.state[0],
        required: true
    },
    firebaseUID: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true
});

const UserState = mongoose.model('UserState', userStateSchema);

module.exports = UserState;
