
// Storage path to where the incoming files are stored.
//export const storagePath = (process.argv[2] === 'local') ? "out/uploads/" : "uploads/";
//export const imagePath = (process.argv[2] === 'local') ? "out/images/" : "images/";
export const storagePath = "out/uploads/"
export const imagePath ="out/images/";

console.log("paths");
console.log(storagePath);
console.log(imagePath);


// HTTP status codes.
export namespace StatusCode {
    // 1xx
    export const Continue                       = 100;
    export const SwitchingProtocols             = 101;
    // 2xx
    export const OK                             = 200;
    export const Created                        = 201;
    export const Accepted                       = 202;
    export const NonAuthoritativeInformation    = 203;
    export const NoContent                      = 204;
    export const ResetContent                   = 205;
    export const PartialContent                 = 206;
    // 3xx
    export const MultipleChoices                = 300;
    export const MovedPermanently               = 301;
    export const Found                          = 302;
    export const SeeOther                       = 303;
    export const NotModified                    = 304;
    export const UseProxy                       = 305;
    export const TemporaryRedirect              = 307;
    // 4xx
    export const BadRequest                     = 400;
    export const Unauthorized                   = 401;
    export const Forbidden                      = 403;
    export const NotFound                       = 404;
    export const MethodNotAllowed               = 405;
    export const NotAcceptable                  = 406;
    export const ProxyAuthenticationRequired    = 407;
    export const RequestTimeout                 = 408;
    export const Conflict                       = 409;
    export const Gone                           = 410;
    // 5xx
    export const InternalServerError            = 500;
    export const NotImplemented                 = 501;
    export const BadGateway                     = 502;
    export const ServiceUnavailable             = 503;
    export const GatewayTimeout                 = 504;
    export const HTTPNotSupported               = 505;
}


export const azureBlobStorage: string = 'https://medtruth.blob.core.windows.net/';
export const imagesBlobStorage: string = azureBlobStorage + '/images/';
export const getFullImageURL = (imageID: string) => {
    return imagesBlobStorage + imageID + '.png';
};
export const getThumbnailImageURL = (imageID: string) => {
    return imagesBlobStorage + imageID + '_.png';
};
