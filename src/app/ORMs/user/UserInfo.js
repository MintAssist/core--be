const mongoose = require("../../../kernel/database");
const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
        required: false
    },
    gender: {
        type: String,
        enum: global.$_constant.business.user.gender,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    nation: {
        type: String,
        enum: global.$_constant.business.user.nations.map(nation => nation.name),
        required: false
    },
    job: {
        type: String,
        enum: global.$_constant.business.user.jobs,
        required: false
    }
}, {
    timestamps: true
});

module.exports = userInfoSchema;
