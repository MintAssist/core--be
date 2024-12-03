const Note = require("../../../app/ORMs/note/Note");
const Translate = require("../../../app/ORMs/note/Translate")
const Summary = require("../../../app/ORMs/note/Summary")
const RelatedKnowledge = require("../../../app/ORMs/note/RelatedKnowledge")
const User = require("../../../app/ORMs/user/User");

const { getStorage } = require("./../../../kernel/cache")
const cache = getStorage().new
const { compressData, uncompressData } = require("../../../utils/compress")
const murmur = require('murmurhash');

const { GoogleGenerativeAI } = require("@google/generative-ai");

const prompts = require("./../../../configs/prompt")
const commonContext = prompts.commonContext
const specificContext = prompts.specificContext

const { QueueManager } = require("@knfs-tech/bamimi-schedule")

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const TMP_CONTENT_CACHE_KEY = "TMP_CONTENT"
const TMP_CONTENT_CACHE_TIME = 900

module.exports = {
	generateKeyJob: async function ({
		userId,
		url,
		originalText
	}) {
		const contentKey = murmur.v3(originalText);
		const urlKey = murmur.v3(url);
		const key = `${userId}:${urlKey}:${contentKey}`

		return key
	},
	saveTmpFeaturesCache: async function (dataKey = {
		userId,
		url,
		originalText
	}, dataCache, feature = "analyzeContent") {
		const prefixKey = await this.generateKeyJob(dataKey);
		let cacheKey = `${TMP_CONTENT_CACHE_KEY}:${prefixKey}:${feature}`;

		await cache.set(cacheKey, (await compressData(JSON.stringify(dataCache))).toString("base64"), 'EX', TMP_CONTENT_CACHE_TIME);
	},
	getFeaturesCache: async function (data = {
		userId,
		url,
		originalText
	}, feature = "analyzeContent") {
		const prefixKey = await this.generateKeyJob(data);
		let cacheKey = `${TMP_CONTENT_CACHE_KEY}:${prefixKey}:${feature}`;

		let cachedValue = await cache.get(cacheKey);
		if (cachedValue) {
			cachedValue = Buffer.from(cachedValue, "base64");
			cachedValue = await uncompressData(cachedValue);
			cachedValue = cachedValue.toString();

			return JSON.parse(cachedValue)
		}

		return null;
	},
	createTMPFeaturesContent: async function (dataKey, payload = null, feature) {
		try {
			const data = await this.getFeaturesCache(dataKey, feature)

			if (!data) {
				await this.saveTmpFeaturesCache(dataKey, { status: "processing" }, feature)
				const queueManager = QueueManager.getInstance()
				const queue = queueManager.getQueue(`${feature}Queue`)
				await queue.add(feature, {
					dataKey,
					featureValue: payload
				})

				const jobCount = await queue.getJobCounts();
				w = (jobCount.active + jobCount.waiting) * 0.08

				return {
					msg: "Successful",
					status: "pending",
					waitFor: w * 1000
				}

			} else if ("processing" === data.status) {
				return {
					msg: "Successful",
					status: "processing",
					waitFor: 300
				}
			} else if ("error" === data.status) {
				return {
					msg: "Error",
					status: "fail"
				}
			}

			return data;

		} catch (error) {
			console.error(error);
			throw new Error("Job error");
		}
	},
	analyzeContent: async function (userId, {
		originalText,
		oLanguage
	}) {
		const currentUser = await User.findById(new ObjectId(userId)).select("userInfo googleGenerateApiKey")
		const genAI = new GoogleGenerativeAI(currentUser.googleGenerateApiKey);
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
		const promptConfig = specificContext.analyze;
		const contentPrompt = await this._addCommonContext(
			currentUser,
			promptConfig.prompt.replaceAll(promptConfig.params.content, originalText)
				.replaceAll(promptConfig.params.language, oLanguage)
		)

		console.log({ action:"analyzeContent", contentPrompt })
		const r = await model.generateContent(contentPrompt);
		const result = r.response.text()
		const [language, title, topic] = result.split(promptConfig.separateString)
		return {
			language,
			title,
			topic
		};
	},
	translateContent: async function (userId, {
		originalText,
		language
	}) {
		const currentUser = await User.findById(userId).select("userInfo googleGenerateApiKey");

		const genAI = new GoogleGenerativeAI(currentUser.googleGenerateApiKey);
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
		const promptConfig = specificContext.translate;
		const contentPrompt = await this._addCommonContext(
			currentUser,
			promptConfig.prompt
				.replaceAll(promptConfig.params.content, originalText)
				.replaceAll(promptConfig.params.language, language)
		);
		console.log({ action: "translateContent", contentPrompt })
		const r = await model.generateContent(contentPrompt);
		const result = r.response.text();

		return {
			language,
			translation: result
		}
	},
	summaryContent: async function (userId, {
		originalText,
		language
	}) {
		const currentUser = await User.findById(userId).select("userInfo googleGenerateApiKey");

		const genAI = new GoogleGenerativeAI(currentUser.googleGenerateApiKey);
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
		const promptConfig = specificContext.summary;
		const contentPrompt = await this._addCommonContext(
			currentUser,
			promptConfig.prompt
				.replaceAll(promptConfig.params.content, originalText)
				.replaceAll(promptConfig.params.language, language)
		);
		console.log({ action: "summaryContent", contentPrompt })

		const r = await model.generateContent(contentPrompt);
		const result = r.response.text();

		const resultArr = result.split("\n");

		return {
			language,
			ideas: resultArr
		};
	},

	relationContent: async function (userId, {
		originalText,
		min = 5,
		max = 15,
		language
	}) {
		try {
			const currentUser = await User.findById(userId).select("userInfo googleGenerateApiKey");

			const genAI = new GoogleGenerativeAI(currentUser.googleGenerateApiKey);
			const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
			const promptConfig = specificContext.relateKnowledge;
			const contentPrompt = await this._addCommonContext(
				currentUser,
				promptConfig.prompt
					.replaceAll(promptConfig.params.content, originalText)
					.replaceAll(promptConfig.params.min, min)
					.replaceAll(promptConfig.params.language, language)
					.replaceAll(promptConfig.params.max, max)
			)
			console.log({ action: "relationContent", contentPrompt })
			const r = await model.generateContent(contentPrompt);
			const result = r.response.text();
			const articleArr = result.split(promptConfig.separateStringArr).map(article => {
				const [title, description, language, hardLevel] = article.split(promptConfig.separateString)

				return {
					title: title.replace(/^[\n`\s]+|[\n`\s]+$/g, '').trim(),
					description: description.replace(/^[\n`\s]+|[\n`\s]+$/g, '').trim(),
					language: language.replace(/^[\n`\s]+|[\n`\s]+$/g, '').trim(),
					hardLevel: hardLevel.replace(/^[\n`\s]+|[\n`\s]+$/g, '').trim()
				}
			})

			return {
				language,
				articles: articleArr
			};
		} catch (error) {
			console.error(error)
			throw new Error("Error")
		}
	},
	create: async function (userId, {
		url,
		originalText,
		topic,
		language,
		title
	}) {
		try {
			const note = new Note({
				title,
				language,
				originalText,
				url,
				userId,
				topic
			})

			await note.save()

			return {
				_id: note._id,
				title,
				language,
				originalText,
				url
			}
		} catch (error) {
			console.error(error)
			throw new Error('Error create note');
		}
	},
	translate: async function (noteId, {
		language,
		content
	}) {
		try {
			const newTranslation = await Translate.create({
				noteId,
				language,
				content: content,
			});

			await Note.findByIdAndUpdate(
				noteId,
				{ $push: { translations: newTranslation._id } },
				{ new: true }
			);

			return {
				language,
				content: newTranslation.content,
			};
		} catch (error) {
			console.error(error);
			throw new Error("Error in translation process");
		}
	},

	summary: async function (noteId, {
		language,
		content
	}) {
		try {
			const newSummary = await Summary.create({
				noteId,
				language,
				content: content,
			});

			await Note.findByIdAndUpdate(
				noteId,
				{ $push: { summaries: newSummary._id } },
				{ new: true }
			);

			return {
				noteId,
				language,
				content
			};
		} catch (error) {
			console.error(error);
			throw new Error("Error in summary process");
		}
	},

	relateKnowledge: async function (noteId, {
		articleArr
	}) {
		try {
			const relatedKnowledgeDocs = await RelatedKnowledge.insertMany(
				articleArr.map(article => {
					const cleanTitle = article.title.replace(/\n/g, ' ').trim();
					const cleanDescription = article.description.replace(/\n/g, ' ').trim();
					const cleanLanguage = article.language.replace(/\n/g, ' ').trim();

					return {
						noteId,
						title: cleanTitle,
						description: cleanDescription,
						language: cleanLanguage,
						hardLevel: article.hardLevel,
					};
				})
			);

			await Note.findByIdAndUpdate(
				noteId,
				{ $push: { relates: { $each: relatedKnowledgeDocs.map(doc => doc._id) } } },
				{ new: true }
			);

			return relatedKnowledgeDocs;
		} catch (error) {
			console.error(error)
			throw new Error('Error summary');
		}
	},
	saveContent: async function (data = {
		userId,
		url,
		originalText
	}) {
		try {
			const createData = {
				...data
			}
			const analyzeContentCache = await this.getFeaturesCache(data, "analyzeContent")
			if (analyzeContentCache && analyzeContentCache.status === "done") {
				createData.language = analyzeContentCache.result.language
				createData.title = analyzeContentCache.result.title
				createData.topic = analyzeContentCache.result.topic
			}

			const Note = await this.create(data.userId, createData)

			const relationContentCache = await this.getFeaturesCache(data, "relationContent")
			if (relationContentCache && relationContentCache.status === "done") {
				await this.relateKnowledge(Note._id, { articleArr: relationContentCache.result.articles })
			}

			const summaryContentCache = await this.getFeaturesCache(data, "summaryContent")
			if (summaryContentCache && summaryContentCache.status === "done") {
				await this.summary(Note._id, {
					language: summaryContentCache.result.language,
					content: summaryContentCache.result.ideas.join("\n").toString(),
				})
			}

			const translateContentCache = await this.getFeaturesCache(data, "transactionContent")
			if (translateContentCache && translateContentCache.status === "done") {
				console.log(translateContentCache.result)
				await this.translate(Note._id,
					{
						language: translateContentCache.result.language,
						content: translateContentCache.result.translation,
					}
				)
			}

		} catch (error) {
			console.error(error)
			throw new Error("Save Note error")
		}
	},
	_addCommonContext: async function (user, promptContent) {
		let withCommonContextPrompt;
		if (user.userInfo) {
			const commonContextUserInfo = commonContext.userInfo
			const commonContextPrompt
				= commonContextUserInfo
					.prompt
					.replaceAll(commonContextUserInfo.params.age, user.userInfo.age)
					.replaceAll(commonContextUserInfo.params.nation, user.userInfo.nation)
					.replaceAll(commonContextUserInfo.params.job, user.userInfo.job)
			withCommonContextPrompt += commonContextPrompt
		}

		withCommonContextPrompt += `\n${commonContext.holdFormat.prompt}`;

		return withCommonContextPrompt += `\n${promptContent}`
	},
};