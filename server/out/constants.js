"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Storage path to where the incoming files are stored.
exports.storagePath = "uploads/";
exports.imagePath = "images/";
// Path to MongoDB.
exports.dbName = "/myproject";
exports.dbAddress = "localhost:27017";
exports.url = "mongodb://" + exports.dbAddress + exports.dbName;
// Name of the collection in database
exports.collectionName = "images";
// HTTP status codes.
var StatusCode;
(function (StatusCode) {
    // 1xx
    StatusCode.Continue = 100;
    StatusCode.SwitchingProtocols = 101;
    // 2xx
    StatusCode.OK = 200;
    StatusCode.Created = 201;
    StatusCode.Accepted = 202;
    StatusCode.NonAuthoritativeInformation = 203;
    StatusCode.NoContent = 204;
    StatusCode.ResetContent = 205;
    StatusCode.PartialContent = 206;
    // 3xx
    StatusCode.MultipleChoices = 300;
    StatusCode.MovedPermanently = 301;
    StatusCode.Found = 302;
    StatusCode.SeeOther = 303;
    StatusCode.NotModified = 304;
    StatusCode.UseProxy = 305;
    StatusCode.TemporaryRedirect = 307;
    // 4xx
    StatusCode.BadRequest = 400;
    StatusCode.Unauthorized = 401;
    StatusCode.Forbidden = 403;
    StatusCode.NotFound = 404;
    StatusCode.MethodNotAllowed = 405;
    StatusCode.NotAcceptable = 406;
    StatusCode.ProxyAuthenticationRequired = 407;
    StatusCode.RequestTimeout = 408;
    StatusCode.Conflict = 409;
    StatusCode.Gone = 410;
    // 5xx
    StatusCode.InternalServerError = 500;
    StatusCode.NotImplemented = 501;
    StatusCode.BadGateway = 502;
    StatusCode.ServiceUnavailable = 503;
    StatusCode.GatewayTimeout = 504;
    StatusCode.HTTPNotSupported = 505;
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
//# sourceMappingURL=constants.js.map