function webservice(request, response) {
    "use strict";
    console.log("Request handler 'webserver' was called.");

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("hello world webserver");
    response.end();
}

exports.webservice = webservice;