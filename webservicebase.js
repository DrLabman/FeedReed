"use strict";

/**
 * Base webservice class
 */
function webservice() {
}

/**
 * Handles a http request by getting all the data from the request ensuring that
 * the data isn't too large and registers the callback to be called when the
 * request is all read.
 * 
 * Currently only handle post methods.
 * 
 * @param request Http Request object
 * @param response Http Response object
 * @param callback Callback to call when we finish loading the data
 */
webservice.prototype.handleRequest = function (request, response, callback) {
    var queryData = "";

    if (request.method === 'POST') {
        request.on('data', function (data) {
            queryData += data;
            if (queryData.length > 1e6) {
                queryData = "";
                webservice.sendError(response, 413);
                request.connection.destroy();
            }
        });

        request.on('end', function () {
            callback(queryData);
        });
    } else {
        // We only expect json post data
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
};

/**
 * Send a JSON response.
 * 
 * @param response HTTP response object
 * @param object Object to return to the client
 */
webservice.prototype.sendJSON = function (response, object) {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(object));
};

/**
 * Send an empty error response.
 * 
 * @param response HTTP response object
 * @param errorCode HTTP error code
 */
webservice.prototype.sendError = function (response, errorCode, string) {
    response.writeHead(errorCode, {"Content-Type": "text/plain"});
    response.end(string);
};

/**
 * Send a JSON error response.
 * 
 * @param response HTTP response object
 * @param errorCode HTTP error code
 * @param object Object to return to the client
 */
webservice.prototype.sendErrorJSON = function (response, errorCode, object) {
    response.writeHead(errorCode, {"Content-Type": "application/json"});
    response.end(JSON.stringify(object));
};

exports.webservice = new webservice();