"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const routes_1 = require("./routes");
// Set-up a server, with routes and static public files.
exports.server = express();
exports.server.use(express.static('public/'));
exports.server.use(routes_1.routes);
// Listen and serve.
const port = 8080;
exports.server.listen(process.env.PORT || port, () => {
    console.log("Listening on port", port);
});
``;
//# sourceMappingURL=server.js.map