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
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("404 Not found");
                response.end();
            }
        }
    }
    
    return route;
}

exports.getRouter = routeSetup;