"use strict";
const QueryService = require("../../../../modules/assistant/services/query.service")

const Response = require("./../../response/note.res")
const SummaryResponse = require("./../../response/summary.res")
const RelationsResponse = require("./../../response/relations.res")

module.exports = {
	index: async function (req, res, next) {
		try {
			const query = {
				page: parseInt(req.query?.page) || global.$_constant.page.index,
				size: parseInt(req.query?.size) || global.$_constant.page.limit,
				title: req.query?.title ?? null,
				shortText: req.query?.shortText ?? null,
				url: req.query?.url ?? null,
				language: req.query?.language ?? "*",
				userId: req.session.currentUser._id,
				order: req.query?.order ?? null
			};

			let result = await QueryService.getMany(query);

			return res.status(200).sendMessage({
				total: result.total,
				notes: Response.getMany(result.data),
				max: Math.ceil(result.total / query.size) ?? 1,
				query
			});
		} catch (error) {
			next(error)
		}
	},
	getSummaries: async function (req, res, next) {
		try {
			const query = {
				page: parseInt(req.query?.page) || global.$_constant.page.index,
				size: parseInt(req.query?.size) || global.$_constant.page.limit,
				shortText: req.query?.shortText ?? null,
				language: req.query?.language ?? "*",
				order: req.query?.order ?? null,
				noteId: req.params.noteId
			};

			const userId = req.session.currentUser._id;

			const noteId = req.params.noteId;
			const note = await QueryService.getById({ noteId, userId })

			if (!note) {
				return res.status(404).sendMessage({
					"msg": global.$_errorCodeResponse.common.notFound,
					"key": "notFound"
				})
			}

			let result = await QueryService.getSummariesByNoteId(query);

			return res.status(200).sendMessage({
				total: result.total,
				summaries: SummaryResponse.getMany(result.data),
				max: Math.ceil(result.total / query.size) ?? 1,
				query
			});
		} catch (error) {
			next(error)
		}
	},
	getTranslations: async function (req, res, next) {
		try {
			const query = {
				page: parseInt(req.query?.page) || global.$_constant.page.index,
				size: parseInt(req.query?.size) || global.$_constant.page.limit,
				shortText: req.query?.shortText ?? null,
				language: req.query?.language ?? "*",
				order: req.query?.order ?? null,
				noteId: req.params.noteId
			};

			const userId = req.session.currentUser._id;

			const noteId = req.params.noteId;
			const note = await QueryService.getById({ noteId, userId })

			if (!note) {
				return res.status(404).sendMessage({
					"msg": global.$_errorCodeResponse.common.notFound,
					"key": "notFound"
				})
			}

			let result = await QueryService.getTranslationsByNoteId(query);

			return res.status(200).sendMessage({
				total: result.total,
				translations: SummaryResponse.getMany(result.data),
				max: Math.ceil(result.total / query.size) ?? 1,
				query
			});
		} catch (error) {
			next(error)
		}
	},
	getRelations: async function (req, res, next) {
		try {
			const query = {
				page: parseInt(req.query?.page) || global.$_constant.page.index,
				size: parseInt(req.query?.size) || global.$_constant.page.limit,
				shortText: req.query?.shortText ?? null,
				language: req.query?.language ?? "*",
				order: req.query?.order ?? null,
				hardLevel: req.query?.hardLevel ?? null,
				noteId: req.params.noteId
			};

			const userId = req.session.currentUser._id;

			const noteId = req.params.noteId;
			const note = await QueryService.getById({ noteId, userId })

			if (!note) {
				return res.status(404).sendMessage({
					"msg": global.$_errorCodeResponse.common.notFound,
					"key": "notFound"
				})
			}

			let result = await QueryService.getRelationsByNoteId(query);

			return res.status(200).sendMessage({
				total: result.total,
				relations: RelationsResponse.getMany(result.data),
				max: Math.ceil(result.total / query.size) ?? 1,
				query
			});
		} catch (error) {
			next(error)
		}
	},
	getById: async function (req, res) {
		try {
			const userId = req.session.currentUser._id;
			const noteId = req.params.noteId;
			const note = await QueryService.getById({ noteId, userId })
			
			if (!note) {
				return res.status(404).sendMessage({
					"msg": global.$_errorCodeResponse.common.notFound,
					"key": "notFound"
				})
			}

			return res.status(200).sendMessage({
				note
			});

		} catch (error) {
			next(error)
		}
	}
};
