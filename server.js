var http = require("http");
var url = require("url");

function start(port, route) {
    "use strict";

    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");

        route(pathname, request, response);
    }

    http.createServer(onRequest).listen(port);
    console.log("HTTP Server has started on port: " + port);
}

exports.start = start;
