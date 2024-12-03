const CommandService = require("../../../modules/assistant/services/command.service")

module.exports = {
    name: "relationContent",
    queue: "relationContentQueue",
    handle: async function (job) {
        const userId = job.data.dataKey.userId;
        const originalText = job.data.dataKey.originalText;
        const language = job.data.dataKey.language;
        const url = job.data.dataKey.originalUrl

        try {
            const translateContent = await CommandService.relationContent(userId, { originalText, language })

            await CommandService.saveTmpFeaturesCache(job.data.dataKey, {
                result: translateContent,
                status: "done"
            }, "relationContent")
            console.log(`Relation Content success ${job.data.dataKey}`);

        } catch (error) {
            await CommandService.saveTmpFeaturesCache({
                userId,
                originalText,
                url
            }, {
                status: "fail"
            }, "relationContent")

            console.error(`Relation Content fail`, error);
        }
    }
};