var http = require('http');
var url = require("url");
var FeedParser = require('feedparser');

var xml2js = require('xml2js');
var db = require('./db.js');

/**
 * Converts a URL into parts for use with the http.request function.
 */
function fullUrlToOptions(URL) {
    "use strict";

    var parsed = url.parse(URL);
    return {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.path,
        method: 'GET'
    };
}

function getRSS(url, callback) {
    "use strict";

    console.log("Getting data for RSS Feed: " + url);
    var options, req;

    options = fullUrlToOptions(url);
    req = http.request(options, function (resp) {
        var metadata, articles, fp;

        articles = [];

        fp = new FeedParser({addmeta: false});
        resp.pipe(fp).on('error', function (error) {
            // always handle errors
            console.log("Error: " + error);
        }).on('meta', function (meta) {
            // hold the metadata
            metadata = meta;
            console.log("Meta: " + meta.title);
        }).on('readable', function () {
            // collect all the articles
            var stream = this, item;
            item = stream.read();
            while (item !== null) {
                console.log('Got article: %s', item.title || item.description);
                //console.dir(item);
                articles.push(item);
                item = stream.read();
            }
        }).on('end', function () {
            // done, callback with the metadata and articles
            console.log("Done reading stream");
            callback(metadata, articles);
        });
    }).on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    req.end();
}

function updateDatabase(feed, metadata, articles, callback) {
    "use strict";

    // Get a list of links (used as unique data for the feed items)
    var links = [];
    articles.forEach(function (item) {
        links.push(item.link);
    });
    // Find any items already in the database based on links
    db.database.models.item.find({link: links}, function (err, records) {
        if (err !== null) {
            callback(err);
        } else {
            // Pull out links that we did find
            var toInsert = [], foundLinks = [];
            records.forEach(function (item) {
                foundLinks.push(item.link);
            });
            // Create list of articles to insert
            articles.forEach(function (item) {
                if (foundLinks.indexOf(item.link) === -1) {
                    toInsert.push({
                        feed: feed,
                        title: item.title,
                        link: item.link,
                        description: item.description
                    });
                }
            });
            // Insert the links not yet in the database
            db.database.models.item.create(toInsert, function (err, instance) {
                if (err !== null) {
                    callback(err);
                } else {
                    // Records created
                    console.log("Created " + toInsert.length + " records.");
                    callback(null);
                }
            });
        }
    });
}

function updateRSS(url, articles, callback) {
    "use strict";

    if (callback === undefined || callback === null) {
        callback = articles;
        articles = null;
    }

    db.database.models.feed.find({url: url}, function (err, feed) {
        if (err !== null) {
            callback(err);
        } else {
            if (feed.length === 0) {
                // Feed url not in the database
                callback("Feed URL not in database.");
            } else {
                if (articles !== null) {
                    updateDatabase(feed[0], null, articles, callback);
                } else {
                    // Feed not in the database: Get rss data to insert feed items
                    // TODO: wrap error in get rss here
                    getRSS(url, function (metadata, articles) {
                        updateDatabase(feed[0], metadata, articles, callback);
                    });
                }
            }
        }
    });
}

function updateAllRSS(callback) {
    "use strict";

    db.database.models.feed.find(function (err, data) {
        if (err !== null) {
            console.log(err);
        } else {
            data.forEach(function (item) {
                console.log("updateAllRSS: item: " + item.id + " url: " + item.url);
                console.dir(item);
                if (item.url !== null) {
                    updateRSS(item.url, function (err) {
                        console.log(err);
                    });
                }
            });
        }
    });
}

function addRSS(url, callback) {
    "use strict";

    db.database.models.feed.find({url: url}, function (err, data) {
        if (err !== null) {
            callback(err);
        } else {
            if (data.length === 0) {
                // TODO: wrap error in get rss here
                // Get rss data
                getRSS(url, function (metadata, articles) {
                    // Create record
                    db.database.models.feed.create({
                        url: url,
                        title: metadata.title,
                        link: metadata.link,
                        description: metadata.description,
                        image: ""
                    }, function (err, instance) {
                        if (err !== null) {
                            callback(err);
                        } else {
                            // Record created, also get a list of articles
                            updateRSS(url, articles, callback);
                            //callback(null);
                        }
                    });
                });
            } else {
                // Record already exists
                callback("Record already exists.");
            }
        }
    });
}

exports.add = addRSS;
exports.update = updateAllRSS;

/**
 debug - testing
 * /
 var feedUrl = ["http://gluonporridge.net/feed/","http://www.overclockers.com.au/files/ocau_news.rss","http://www.engadget.com/rss.xml"];
 setTimeout(function(){
 feedUrl.forEach(function (item){
 console.log("Adding feed: " + item);
 addRSS(item, function(err) {
 if (err != null) {
 console.log("Error while adding RSS: " + err);
 }
 });
 });
 console.log("Updating all feeds");
 updateAllRSS();
 }, 100);
 */
