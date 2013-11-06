"use strict";

var webservice = require("./webservicebase").webservice;
var db = require("./db");
var async = require("async");
var reader = require("./reader");

function feedService(request, response) {
    console.log("Request handler 'feedwebservice' was called.");

    webservice.handleRequest(request, response, function (queryData) {
        function handleError(error) {
            webservice.sendErrorJSON(response, 400, {msg: error});
        }

        var data = JSON.parse(queryData);

        switch (data.cmd) {
        case "list":
            db.database.models.feed.find(function (error, records) {
                var calls = [], output = [];

                if (error !== null) {
                    handleError(error);
                } else {
                    records.forEach(function (feed) {
                        calls.push(function (callback) {
                            db.database.models.item.count({feed_id: feed.id}, function (err, count) {
                                feed.unread = count;
                                callback(null, feed);
                            });
                        });
                    });
                    async.series(calls, function (error, results) {
                        if (error !== null) {
                            handleError(error);
                        } else {
                            webservice.sendJSON(response, results);
                        }
                    });
                }
            });
            break;
        case "getItems":
            if (data.id !== undefined && data.id === null) {
                handleError("Missing feed id");
            } else {
                db.database.models.item.find({feed_id: data.id}, function (error, results) {
                    if (error !== null) {
                        handleError(error);
                    } else {
                        webservice.sendJSON(response, results);
                    }
                });
            }
            break;
        case "test":
            if (data.url !== undefined) {
                reader.get(data.url, function (error, metadata, articles) {
                    if (error !== null) {
                        handleError(error);
                    } else {
                        webservice.sendJSON(response, metadata);
                    }
                });
            } else {
                handleError("Missing RSS url");
            }
            break;
        case "add":
            if (data.url !== undefined) {
                reader.add(data.url, function (error, data) {
                    if (error !== null) {
                        handleError(error);
                    } else {
                        webservice.sendJSON(response, {msg: "Feed added."})
                    }
                });
            } else {
                handleError("Missing RSS url");
            }
            break;
        default:
            handleError("Unknown command.");
            break;
        }
    });
}

exports.service = feedService;