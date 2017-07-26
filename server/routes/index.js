"use strict";
exports.__esModule = true;
var express_1 = require("express");
var api_1 = require("./api");
exports.routes = express_1.Router();
exports.routes.use('/api', api_1.api);
