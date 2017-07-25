"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = require("./upload");
const images_1 = require("./images");
exports.api = express_1.Router();
exports.api.use('/_upload', upload_1.routerUpload);
exports.api.use('/_images', images_1.routerImages);
//# sourceMappingURL=index.js.map