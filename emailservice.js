var nodemailer = require("nodemailer");
var fs = require('fs');

// Config file should contain .config and .defaults
var configFile = JSON.parse(fs.readFileSync("emailconfig.json","utf8"));

// default mail settings, replace the text and optionally html with the message
// This app doesn't need to change the to/from details
function defaults() {
    "use strict";

    // Clone defaults and return
    return JSON.parse(JSON.stringify(configFile.defaults));
}

// TODO: work out the best time to create this and some kind of lifecycle
// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", configFile.config);

function send(mailOptions, callback) {
    "use strict";

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            callback("An error occured while trying to send your message, this error has been logged on our server and we will look into it.");
        } else {
            console.log("Message sent: " + response.message);
            callback("Your message has been sent.");
        }

        // TODO: work out when to close the pool
        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
}

exports.defaults = defaults;
exports.send = send;