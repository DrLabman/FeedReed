var url = require("url");
var path = require("path");
var fs = require("fs");
var mime = require("mime");

// TODO: ensure we can't use relative paths to get out of the base folder
function fsHandler(request, response) {
    "use strict";
    console.log("Request handler 'fsHandler' was called.");

    var pathBase, filename, exists, mimetype, fileStream;

    pathBase = "html";
    filename = pathBase + url.parse(request.url).pathname;
    exists = fs.existsSync(filename);

    if (exists) {
        // If a folder was requested, add the default filename
        if (fs.lstatSync(filename).isDirectory()) {
            filename += "index.html";
            exists = fs.existsSync(filename);
        }
    }

    if (exists) {
        mimetype = mime.lookup(filename);
        fileStream = fs.createReadStream(filename);

        response.writeHead(200, {"Content-Type": mimetype});
        fileStream.pipe(response);
        //response.end(data);
    } else {
        console.log("No file found for " + filename);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
    }
}

exports.service = fsHandler;