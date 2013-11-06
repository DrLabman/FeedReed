"use strict";

var webservice = require("./webservicebase").webservice;
var emailService = require('./emailservice');

// TODO: make base webservice which is reuseable
function contactService(request, response) {
    console.log("Request handler 'contactService' was called.");

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
            var data = JSON.parse(queryData),
                email = emailService.defaults();

            email.html = "<b>Name: </b> " + data.name + "<br/>\n" +
                "<b>Email: </b> " + data.email + "<br/>\n" +
                "<b>Message: </b> " + data.message;
            email.text = "Name: " + data.name + "\n" +
                "Email: " + data.email + "\n" +
                "Message: " + data.message;

            emailService.send(email, function (message) {
                response.writeHead(200, {"Content-Type": "application/json"});
                response.write(JSON.stringify({msg: message}));
                response.end();
            });
        });
    } else {
        // We only expect json post data
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

exports.service = contactService;