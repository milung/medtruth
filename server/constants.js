"use strict";
exports.__esModule = true;
// Storage path to where are the incoming files stored.
exports.storagePath = "uploads/";
// HTTP status codes.
var StatusCode;
(function (StatusCode) {
    // 1xx
    StatusCode.Continue = 100;
    // 2xx
    StatusCode.OK = 200;
    // 3xx
    StatusCode.Found = 302;
    // 4xx
    StatusCode.BadRequest = 400;
    StatusCode.Forbidden = 403;
    StatusCode.NotFound = 404;
    // 5xx
    StatusCode.InternalServerError = 500;
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
