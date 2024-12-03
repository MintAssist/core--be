"use strict";
const CommandService = require("../../../../modules/assistant/services/command.service")

module.exports = {
	createTMPAnalyzeContent: async function (req, res, next) {
		try {
			const payload = {
				url: req.body.url,
				originalText: req.body.originalText,
				language: req.body.language,
				userId: req.session.currentUser._id
			}
			
			const data = await CommandService.createTMPFeaturesContent(payload, {language: payload.language}, "analyzeContent")
			
			return await res.status(201).sendMessage({
				...data
			})
		} catch (error) {
			next(error)
		}
	},
	createTMPSummaryContent: async function (req, res, next) {
		try {
			const payload = {
				url: req.body.url,
				originalText: req.body.originalText,
				language: req.body.language,
				userId: req.session.currentUser._id
			}

			const data = await CommandService.createTMPFeaturesContent(payload, {
				originalText: payload.originalText,
				language: payload.language
			}, "summaryContent")

			return await res.status(201).sendMessage({
				...data
			})
		} catch (error) {
			next(error)
		}
	},
	createTMPTranslateContent: async function (req, res, next) {
		try {
			const payload = {
				url: req.body.url,
				originalText: req.body.originalText,
				userId: req.session.currentUser._id,
				language: req.body.language,

			}

			const data = await CommandService.createTMPFeaturesContent(payload, {
				originalText: payload.originalText,
				language: payload.language
			}, "translateContent")

			return await res.status(201).sendMessage({
				...data
			})
		} catch (error) {
			next(error)
		}
	},
	createTMPRelationContent: async function (req, res, next) {
		try {
			const payload = {
				url: req.body.url,
				originalText: req.body.originalText,
				userId: req.session.currentUser._id,
				language: req.body.language,
			}

			const data = await CommandService.createTMPFeaturesContent(payload, {
				originalText: payload.originalText,
				language: payload.language
			}, "relationContent")

			return await res.status(201).sendMessage({
				...data
			})
		} catch (error) {
			next(error)
		}
	},

	saveContent: async function (req, res, next) {
		try {
			const payload = {
				url: req.body.url,
				originalText: req.body.originalText,
				userId: req.session.currentUser._id,
			}

			const content = await CommandService.saveContent(payload)

			return res.status(201).sendMessage({
				content
			});
		} catch (error) {
			next(error)
		}
	},
};
