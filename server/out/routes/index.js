"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_1 = require("./api");
exports.routes = express_1.Router();
exports.routes.use('/api', api_1.api);
//# sourceMappingURL=index.js.map