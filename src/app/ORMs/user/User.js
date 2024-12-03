const mongoose = require("../../../kernel/database");
const Schema = mongoose.Schema;
const auth = require("../../../kernel/auth");
const userInfoSchema = require("./UserInfo");

const userSchema = new Schema({
    state: {
        type: Number,
        enum: Object.values(global.$_constant.business.user.state),
        default: global.$_constant.business.user.state.isVerifying,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        sparse: true,
    },
    role: {
        type: String,
        enum: Object.keys(global.$_constant.business.roles),
        required: true
    },
    googleGenerateApiKey: {
        type: String,
        unique: true,
        sparse: true,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    userInfo: {
        type: userInfoSchema,
        required: false
    }
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await auth.hashPassword(this.password, 10)
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
