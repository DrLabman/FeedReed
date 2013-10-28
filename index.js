var reader = require("./reader");
var server = require("./server");
var router = require("./router");

var webserver = require("./webservice");
var contactWebservice = require("./contactwebservice");
var feedWebservice = require("./feedwebservice");
var fsHandler = require("./fileservice");

// updates feeds every 30 minutes
var feeds = require("./feedservice");

var routes = {
    'default': fsHandler.service,
    '/webserver': webserver.webserver,
    '/contact': contactWebservice.service,
    '/feeds': feedWebservice.service
};

var port = 8888;
server.start(port, router.getRouter(routes));