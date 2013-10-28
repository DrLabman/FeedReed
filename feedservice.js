var reader = require("./reader");

// every hour update the feed data lists
setInterval(function () {
    "use strict";

    reader.update();
}, 15 * 60 * 1000);
