module.exports = [
    {
        name: "sendMail",
        func: require("../app/jobs/sendMail.job"),
        onMain: true
    },
    {
        name: "analyzeContent",
        func: require("../portals/user/jobs/analyzerContent.job"),
        onMain: true
    },
    {
        name: "summaryContent",
        func: require("../portals/user/jobs/summaryContent.job"),
        onMain: true
    },
    {
        name: "translateContent",
        func: require("../portals/user/jobs/translateContent.job"),
        onMain: true
    },
    {
        name: "relationContent",
        func: require("../portals/user/jobs/relationContent.job"),
        onMain: true
    }
];