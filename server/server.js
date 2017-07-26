"use strict";
exports.__esModule = true;
var express = require("express");
var routes_1 = require("./routes");
var constants_1 = require("./constants");
var mongodb_1 = require("mongodb");
var constants_2 = require("./constants");
// Initialise connection to MongoDB.
mongodb_1.MongoClient.connect(constants_2.url, function (err, database) {
    if (err)
        throw err;
    exports.db = database;
    console.log("Successfully connected to database!");
});
// Set-up a server, with routes and static public files.
exports.server = express();
exports.server.use(express.static('public/'));
exports.server.use(routes_1.routes);
// Handle a 404 Page Not Found.
exports.server.use(function (req, res, next) {
    res.status(constants_1.StatusCode.NotFound)
        .json({
        message: 'Route not found'
    });
});
// Listen and serve.
var port = 8080;
exports.server.listen(process.env.PORT || port, function () {
    console.log("Listening on port", port);
});
