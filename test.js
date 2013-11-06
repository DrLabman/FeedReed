var db = require("./db");
var reader = require("./reader");

//setTimeout(function () {
//    db.database.models.feed.find(function (err, data) {
//        data.forEach(function (feed) {
//            db.database.models.item.find({feed_id: feed.id}, function (err, data) {
//                data.forEach(function (item) {
//            console.log("ID: " + item.id);
//            console.log("FeedId: " + item.feed_id);
//            console.log("ID: " + item.id);
//                    console.log("Title: " + item.title);
//            console.log("Link: " + item.link);
//            console.log("Desc: " + item.description);
//            console.dir(item);
//
//            if (item.url === null) {
//            console.log("Removing: " + item.title);
//            item.remove();
//            }
//                });
//            });
//            console.log("ID: " + item.id);
//            console.log("Title: " + item.title);
//            console.log("URL: " + item.url);
//            console.log("Link: " + item.link);
//            console.log("Desc: " + item.description);
//            console.dir(item);
//
//            if (item.url === null) {
//            console.log("Removing: " + item.title);
//            item.remove();
//            }
//        });
//    });
//
//}, 100);

setTimeout(function() {
    reader.add("http://www.engadget.com/rss.xml", console.log);
}, 1000);

setTimeout(function() {
    reader.add("http://www.overclockers.com.au/files/ocau_news.rss", console.log);
}, 2000);

setTimeout(function() {
    reader.add("http://gluonporridge.net/feed/", console.log);
}, 3000);

//setTimeout(function() {
//    reader.update();    
//}, 4000);