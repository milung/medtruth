"use strict";
exports.__esModule = true;
var express_1 = require("express");
var upload_1 = require("./upload");
var images_1 = require("./images");
exports.api = express_1.Router();
exports.api.use('/_upload', upload_1.routerUpload);
exports.api.use('/_images', images_1.routerImages);
/*
    Route:      OPTIONS '/api'
    Expects:
    --------------------------------------------
    Returns information about this endpoint.
*/
exports.api.options('/', function (req, res) {
    return res.json({
        routes: [
            { endpoint: upload_1.rootUpload },
            { endpoint: images_1.rootImages }
        ]
    });
});
