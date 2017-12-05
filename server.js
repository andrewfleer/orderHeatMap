// server.js

// set up ===================
var express = require('express');
var app = express();                                                                // create our app w/ express
var morgan = require('morgan');                                                     // log requests to the console (express4)
var bodyParser = require('body-parser');                                            // pull information from HTML POST (express4)
var methodOverride = require('method-override');                                    // simulate DELETE and PUT(express4)
var fs = require('fs');                                                             // file reader? idk.
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();


// configuration ================


app.use(express.static(__dirname + '/public'));                                     // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                                             // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));                                // parse application/x-www-form-urlencoded 
app.use(bodyParser.json());                                                         // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json' }));                      // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ==============================
app.listen(8080);
console.log("App listening on port 8080");

// build cache of zip codes
var zipContents = fs.readFileSync('zips.json');
var zipJson = JSON.parse(zipContents);
for (var zip in zipJson) {
	var coords = {lat: zip.latitude, lng: zip.longitude};
	
	myCache.set(zip.zipCode, coords, function( err, success) {
		if (!err && success) {
			console.log( success);
		}
	});
}

// routes ==============
    // api ------------------------------------------
    // get orders
    app.get('/api/orders', function(req, res) {
        var contents = fs.readFileSync('sample.json');
        var json = JSON.parse(contents);

        res.json(json.orders);
    });
	
	// get zip coordinates
	app.get('api/zip/:zip_id', function(req, res) {
		myCache.get( req.params.zip_id, function (err, value) {
			if ( !err) {
				if (value == undefined) {
				} else {
					res.json(value);
				}
			}
		});
	});
	

    // application ------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html');
    });
