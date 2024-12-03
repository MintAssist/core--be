const CommandService = require("../../../modules/assistant/services/command.service")

module.exports = {
    name: "translateContent",
    queue: "translateContentQueue",
    handle: async function (job) {
        const userId = job.data.dataKey.userId;
        const originalText = job.data.dataKey.originalText;
        const language = job.data.dataKey.language;
        const url = job.data.dataKey.originalUrl

        try {
            const translateContent = await CommandService.translateContent(userId, { originalText, language })

            await CommandService.saveTmpFeaturesCache(job.data.dataKey, {
                result: translateContent,
                status: "done"
            }, "translateContent")
            console.log(`Translate Content success ${job.data.dataKey}`);

        } catch (error) {

            await CommandService.saveTmpFeaturesCache({
                userId,
                originalText,
                url
            }, {
                status: "fail"
            }, "translateContent")

            console.error(`Translate Content fail`, error);
        }
    }
};