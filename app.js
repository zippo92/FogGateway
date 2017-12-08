// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var ip = require('ip');
var user = require('./model/users');


// create a new express server
var app = express();
app.use(bodyParser.json());
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the port from environment
var port = process.env.PORT || 6602;

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);
    if (req.method.match(/get/i)) {
        // Set header for prevent caching
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

        res.setHeader("Pragma", "no-cache");

        res.setHeader("Expires", 0);
    }
    next();
});

require('./routes/Route')(app);

// start server on the specified port and binding host
app.listen(port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on localhost. Ip: "+ip.address());
});

var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-2",
    endpoint: "https://dynamodb.us-east-2.amazonaws.com"
});

var ddb = new AWS.DynamoDB();

//TODO Adesso creo user table all'avvio del gateway, se risolto il todo in registrationController.js, si può cancellare e far creare table quando si fa una nuova registrazione.
user.createUsersTable();