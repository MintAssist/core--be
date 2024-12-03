const CommandService = require("../../../modules/assistant/services/command.service")

module.exports = {
    name: "summaryContent",
    queue: "summaryContentQueue",
    handle: async function (job) {
        const userId = job.data.dataKey.userId;
        const originalText = job.data.dataKey.originalText;
        const language = job.data.dataKey.language;
        const url = job.data.dataKey.originalUrl

        try {
            const summarizedContent = await CommandService.summaryContent(userId, { originalText, language })

            await CommandService.saveTmpFeaturesCache(job.data.dataKey, {
                result: summarizedContent,
                status: "done"
            }, "summaryContent")
            console.log(`Summary Content success ${job.data.dataKey}`);

        } catch (error) {

            await CommandService.saveTmpFeaturesCache({
                userId,
                originalText,
                url
            }, {
                status: "fail"
            }, "summaryContent")

            console.error(`Summary Content fail`, error);
        }
    }
};