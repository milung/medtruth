"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const routes_1 = require("./routes");
const constants_1 = require("./constants");
// Set-up a server, with routes and static public files.
exports.server = express();
// Serve public files.
exports.server.use(express.static('public/'));
// Serve routes.
exports.server.use(routes_1.routes);
// As a last resort, send a NotFound status.
exports.server.use((req, res, next) => {
    res.status(constants_1.StatusCode.NotFound)
        .json({
        message: 'Route not found'
    });
});
// Listen and serve.
const port = 8080;
exports.server.listen(process.env.PORT || port, () => {
    console.log("Listening on port", port);
});
//# sourceMappingURL=server.js.map