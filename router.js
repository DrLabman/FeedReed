"use strict";

var webservice = require('./webservicebase');

// TODO: Add support for regular expressions
function routeSetup(handlers) {
    this.handlers = handlers;

    function route(pathname, request, response) {
        if (typeof handlers[pathname] === 'function') {
            handlers[pathname](request, response);
        } else {
            if (typeof handlers.default === 'function') {
                handlers.default(request, response);
            } else {
                console.log("No request handler found for " + pathname);
                webservice.sendError(response, 404, "404 Not found");
            }
        }
    }
    
    return route;
}

exports.getRouter = routeSetup;