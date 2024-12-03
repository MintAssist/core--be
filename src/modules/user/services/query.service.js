const User = require("../../../app/ORMs/user/User");
const { generatePage } = require("../../../utils/paginate")

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

module.exports = {
    getMany: async function ({
        email = null,
        state = "*",
        roles = "*",
        order = null,
        page,
        size,
    }) {
        const { limit, offset } = generatePage(page, size)

        const cond = [];
        let sort = { createdAt: -1}

        if (email) {
            cond.push({ email: new RegExp(`^${email}`, 'i') })
        }

        if (state !== "*" && Array.isArray(state) && state.length > 0) {
            const stateConditions = state.map(s => ({
                state: global.$_constant.business.user.state[s]
            }));
            cond.push({ $or: stateConditions });
        }

        if (roles !== "*" && Array.isArray(roles) && roles.length > 0) {
            cond.push({ $or: roles.map(role => ({
                role
            })) });
        }

        if (order && order.key && order.value) {
            sort = {
                [order.key]: order.value === 'ASC' ? 1 : -1 
            }
        }

        try {
            const users = await User.find({ $and: cond })
                .skip(offset) 
                .limit(limit)
                .select("_id email state role userInfo createdAt")
                .sort(sort)

            const total = await User.countDocuments({ $and: cond });

            return {
                data: users,
                limit,
                offset,
                total,
            };
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching users');
        }
    },
    getById: async function (userId) {
        try {
            const user = await User.findById(new ObjectId(userId))
                .select("_id email state role userInfo googleGenerateApiKey")
            
            return user
        } catch (error) {
            console.error(error)
            throw new Error("Get user by id Error")
        }
    },
};
