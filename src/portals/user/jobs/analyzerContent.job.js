const CommandService = require("../../../modules/assistant/services/command.service")

module.exports = {
    name: "analyzeContent",
    queue: "analyzeContentQueue",
    handle: async function (job) {
        const userId = job.data.dataKey.userId;
        const originalText = job.data.dataKey.originalText;
        const url = job.data.dataKey.originalUrl
        const language = job.data.dataKey.language;


        try {
            const analyzedContent = await CommandService.analyzeContent(userId, { originalText, language })

            await CommandService.saveTmpFeaturesCache(job.data.dataKey, {
                result: analyzedContent,
                status: "done"
            })
            console.log(`Analyze Content success ${job.data.dataKey}`);

        } catch (error) {

            await CommandService.saveTmpFeaturesCache({
                userId,
                originalText,
                url
            }, {
                status: "fail"
            })

            console.error(`Analyze Content fail`, error);
        }
    }
};