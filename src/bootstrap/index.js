"use strict";

require("@knfs-tech/bamimi-autoload");

const express = require("express"),
    app = express(),
    configs = require("../configs"),
    errorhandler = require("errorhandler"),
    path = require("path"),
    { createServer } = require("node:http"),
    socket = require("@knfs-tech/bamimi-socket.io"),
    server = createServer(app),
    session = require("express-session"),
    flash = require("express-flash");

/**
 * Create db association
 */
require("../app/ORMs/associations");

const jobOnMain = require("../kernel/cronjobs/onMain");
/** 
 * **********************************
 * Set log
 * **********************************
 */
require("../kernel/log")(app);
/***
 * **********************************
 * Set static file
 * **********************************
 */
app.use("/public", express.static(path.join(__dirname, "./../public"), { maxAge: configs.app.staticCacheTime }));

/**
 * **********************************
 * Set up common middleware before
 * **********************************
 */
app.use(session({
    secret: configs.auth.sessionSecret,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

/**
 * **********************************
 * Set up common middleware before
 * **********************************
 */
const kernelMiddleware = require("../kernel/index").middleware.common;
app.use(kernelMiddleware.before);

/**
 * **********************************
 * Set up router
 * **********************************
 */
app.use(require("../kernel/router"));

/**
 * **********************************
 * Set up common middleware after
 * **********************************
 */
app.use(kernelMiddleware.after);

/**
 * **********************************
 * Set up template
 * **********************************
 */
require("../kernel/interface/web")(app);

/**
 * **********************************
 * Error handle
 * **********************************
 */

if (process.env.NODE_ENV === "development") {
    // only use in development
    app.use(errorhandler());
}


/**
 * **********************************
 * Job run on main process
 * **********************************
 */
jobOnMain();


/**
 * **********************************
 * socket run on main process
 * **********************************
 */
if (configs.socket.onMain) {
    console.log("socket on port " + configs.app.server.port);
    socket.io(server, configs.socket);
    require("../routes/socket")
}


server.listen(configs.app.server.port, function () {
    console.log("listening on port " + configs.app.server.port);
});


