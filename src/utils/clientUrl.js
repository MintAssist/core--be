"use strict";
const config = require("../configs/app")

module.exports = (path = '', params = {}, typeUrl = "webUserUrl") => {
    let url;
    if (path instanceof URL) {
        url = path;
    } else {
        url = new URL(`${config.client[typeUrl]}/${path}`);
    }

    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
    }

    return url;
}
