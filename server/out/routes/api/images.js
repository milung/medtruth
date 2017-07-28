"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const constants_1 = require("../../constants");
const azure_service_1 = require("../../azure-service");
exports.rootImages = '/images';
exports.routerImages = express_1.Router();
/*
    Route:      OPTIONS '/_images'
    Expects:
    --------------------------------------------
    Returns information about this endpoint.
*/
exports.routerImages.options('/', (req, res) => {
    return res.json({
        endpoint: '/api/_images',
        message: 'Images is an endpoint for retreiving converted images.'
    });
});
/*
    Route:      GET '/images'
    Expects:
    --------------------------------------------
    Returns all PNG images to the client.
*/
exports.routerImages.get('/', (req, res) => {
    res.sendStatus(constants_1.StatusCode.NotImplemented);
});
/*
    Route:      GET '/images/latest'
    Expects:    JSON, containing number of latest images.
    --------------------------------------------
    Returns latest PNG images uploaded to the server.
*/
exports.routerImages.get('/latest', (req, res) => {
    res.sendStatus(constants_1.StatusCode.NotImplemented);
});
/*
    Route:      GET '/images/:id'
    Expects:    Parameter 'id'
    --------------------------------------------
    Returns a JSON object containing 'url' from the Azure Storage.
*/
exports.routerImages.get('/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let id = req.params.id + ".png";
    // Declare a status code and a retreived url.
    let code;
    let url;
    // Await for Azure Storage's url for image.
    try {
        url = yield azure_service_1.AzureStorage.getURLforImage(id);
        code = constants_1.StatusCode.OK;
    }
    catch (e) {
        url = null;
        code = constants_1.StatusCode.NotFound;
    }
    res.status(code).json({
        url: url
    });
}));
//# sourceMappingURL=images.js.map