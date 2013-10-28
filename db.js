var orm = require("orm");

var database = orm.connect("sqlite://database.sql", function (err, db) {
    "use strict";

    if (err) {
        throw err;
    }

    /* TYPES: String, Number, Boolean, ["list","of","values"] (ENUM), Buffer (BLOB/BINARY), Object (JSON encoded) */
    var feed, item;

    feed = db.define("feed", {
        url: String,
        title: String,
        link: String,
        description: String,
        image: String
    });

    item = db.define("item", {
        feed_id: Number,
        title: String,
        link: String,
        description: String
    });
    item.hasOne("feed", feed);

    db.sync();
});

exports.database = database;
