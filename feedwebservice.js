var db = require("./db");
var async = require("async");

// TODO: make base webservice which is reuseable
function feedService (request, response) {
    "use strict";
    console.log("Request handler 'feedwebservice' was called.");

    var queryData = "";

    if (request.method === 'POST') {
        request.on('data', function (data) {
            queryData += data;
            if (queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function () {
            var data;

            data = JSON.parse(queryData);

            switch (data.cmd) {
                case "listFeeds":
                    db.database.models.feed.find(function (err, records) {
                        var calls = [], output = [];

                        records.forEach(function (feed) {
                            calls.push(function (callback) {
                                db.database.models.item.count({feed_id: feed.id}, function (err, count) {
                                    feed.unread = count;
                                    callback(null, feed);
                                });
                            });
                        });
                        async.series(calls, function (err, result) {
                            response.writeHead(200, {"Content-Type": "application/json"});
                            response.write(JSON.stringify(result));
                            response.end();
                        });
                    });
                    break;
                case "getFeedItems":
                    if (data.id == null) {
                        response.writeHead(400, {"Content-Type": "application/json"});
                        response.write(JSON.stringify({msg: "Missing feed id"}));
                        response.end();
                    } else {
                        db.database.models.item.find({feed_id: data.id}, function (err, results) {
                            response.writeHead(200, {"Content-Type": "application/json"});
                            response.write(JSON.stringify(results));
                            response.end();
                        });
                    }
                    break;
                default:
                    response.writeHead(400, {"Content-Type": "application/json"});
                    response.write(JSON.stringify({msg: "Unknown command."}));
                    response.end();
                    break;
            }
        });
    } else {
        // We only expect json post data
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}

exports.service = feedService;