const Note = require("../../../app/ORMs/note/Note");
const Translate = require("../../../app/ORMs/note/Translate");
const Summary = require("../../../app/ORMs/note/Summary");
const RelatedKnowledge = require("../../../app/ORMs/note/RelatedKnowledge");
const SimilarArticle = require("../../../app/ORMs/note/SimilarArticle");
const { generatePage } = require("../../../utils/paginate")

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
module.exports = {
    getMany: async function ({
        shortText = null,
        title = null,
        url = null,
        userId,
        language = "*",
        order = null,
        page,
        size,
    }) {
        const { limit, offset } = generatePage(page, size);

        const cond = [{
            userId: new ObjectId(userId)
        }];

        let sort = { createdAt: -1 }

        if (shortText) {
            cond.push({
                originalText: new RegExp(`${shortText}`, 'i')
            })
        }

        if (title) {
            cond.push({
                title: new RegExp(`${title}`, 'i')
            })
        }

        if (url) {
            cond.push({
                url: new RegExp(`${url}`, 'i')
            })
        }

        if (language !== "*") {
            cond.language = language;
        }

        if (order && order.key && order.value) {
            sort = {
                [order.key]: order.value === 'ASC' ? 1 : -1
            }
        }

        try {
            const notes = await Note.aggregate([
                {
                    $match: { $and: cond }
                }
                ,
                { $skip: offset },
                { $limit: limit },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        url: 1,
                        language: 1,
                        topic: 1,
                        createdAt: 1,
                        originalText: 1,
                        summariesCount: { $size: "$summaries" }, 
                        translationsCount: { $size: "$translations" },
                        similarArticlesCount: { $size: "$similarArticles" },
                        relatesCount: { $size: "$relates" },
                    }
                },
                { $sort: sort }
            ]).exec();

            const total = await Note.countDocuments(cond);

            return {
                data: notes,
                limit,
                offset,
                total,
            };
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching note');
        }
    },
    getSummariesByNoteId: async function ({
        shortText = null,
        noteId,
        language = "*",
        order = null,
        page,
        size,
    }) {
        const { limit, offset } = generatePage(page, size);

        const cond = [{
            noteId: new ObjectId(noteId)
        }];

        let sort = { createdAt: -1 }

        if (shortText) {
            cond.push({
                content: new RegExp(`${shortText}`, 'i')
            })
        }

        if (language !== "*") {
            cond.language = language;
        }

        if (order && order.key && order.value) {
            sort = {
                [order.key]: order.value === 'ASC' ? 1 : -1
            }
        }

        try {
            const summaries = await Summary.find({ $and: cond })
                .skip(offset)
                .limit(limit)
                .select("_id noteId language content")
                .sort(sort)

            const total = await Summary.countDocuments({ $and: cond });

            return {
                data: summaries,
                limit,
                offset,
                total,
            };
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching summary');
        }
    },
    getTranslationsByNoteId: async function ({
        shortText = null,
        noteId,
        language = "*",
        order = null,
        page,
        size,
    }) {
        const { limit, offset } = generatePage(page, size);

        const cond = [{
            noteId: new ObjectId(noteId)
        }];

        let sort = { createdAt: -1 }

        if (shortText) {
            cond.push({
                content: new RegExp(`${shortText}`, 'i')
            })
        }

        if (language !== "*") {
            cond.language = language;
        }

        if (order && order.key && order.value) {
            sort = {
                [order.key]: order.value === 'ASC' ? 1 : -1
            }
        }

        try {
            const translations = await Translate.find({ $and: cond })
                .skip(offset)
                .limit(limit)
                .select("_id noteId language content")
                .sort(sort)

            const total = await Translate.countDocuments({ $and: cond });

            return {
                data: translations,
                limit,
                offset,
                total,
            };
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching summary');
        }
    },
    getRelationsByNoteId: async function ({
        shortText = null,
        noteId,
        language = "*",
        hardLevel = null,
        order = null,
        title = null,
        page,
        size,
    }) {
        const { limit, offset } = generatePage(page, size);

        const cond = [{
            noteId: new ObjectId(noteId)
        }];

        let sort = { createdAt: -1 }

        if (shortText) {
            cond.push({
                description: new RegExp(`${shortText}`, 'i')
            })
        }

        if (title) {
            cond.push({
                title: new RegExp(`${title}`, 'i')
            })
        }

        if (language !== "*") {
            cond.language = language;
        }

        if (hardLevel !== "*" && Array.isArray(hardLevel) && hardLevel.length > 0) {
            const hardLevelConditions = hardLevel.map(hl => ({
                hardLevel: global.$_constant.business.note.hardLevel[hl]
            }));
            cond.push({ $or: hardLevelConditions });
        }

        if (order && order.key && order.value) {
            sort = {
                [order.key]: order.value === 'ASC' ? 1 : -1
            }
        }

        try {
            const relations = await RelatedKnowledge.find({ $and: cond })
                .skip(offset)
                .limit(limit)
                .select("_id noteId title language description hardLevel")
                .sort(sort)

            const total = await RelatedKnowledge.countDocuments({ $and: cond });

            return {
                data: relations,
                limit,
                offset,
                total,
            };
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching summary');
        }
    },
    getById: async function ({ noteId, userId }) {
        try {
            const note = await Note.findOne({ _id: noteId, userId })
                .populate("summaries translations similarArticles relates")
                .select("_id title url language originalText summaries translations similarArticles relates");

            if (!note) {
                return false
            }

            return note
        } catch (error) {
            console.error(error);
            throw new Error('Error fetching note by ID');
        }
    },
};
