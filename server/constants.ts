
// Storage path to where are the incoming files stored.
export const storagePath = "uploads/";

// HTTP status codes.
export namespace StatusCode {
    // 1xx
    export const Continue = 100;

    // 2xx
    export const OK = 200;

    // 3xx
    export const Found = 302;

    // 4xx
    export const BadRequest = 400;
    export const Forbidden = 403;
    export const NotFound = 404;

    // 5xx
    export const InternalServerError = 500;
}
