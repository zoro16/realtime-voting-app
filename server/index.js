'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

// Serve static assets
app.use(express.static(path.resolve(__dirname, '../client/build')));

const httpServer = http.createServer(app);
const port = process.env.API_PORT || 3001;

const r = require('rethinkdb');
const config = require('./config.json');
const connect = require('./lib/connect');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods',
                  'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers',
                  'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

    //and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

const projects = require('./routes/projects');
const votes = require('./routes/votes');
const users = require('./routes/users');

app.use('/api', users);
app.use('/api', projects);
app.use('/api', votes);

app.use( ( err, req, res, next ) => {
    res.status( err.status || 500 );
    res.json( {
        error: err.message
    } );
} );

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


app.use((req, res, next ) => {
    let error = new Error('Not Found');
    error.status = 404;
    res.json(error);
});

var server = app.listen(port, function() {
    console.log(`api running on port ${port}`);
});

const io = require('socket.io')(server);

io.on("connection", function(socket) {
    var conn;
    console.log("socket connected..");
    r.connect(config.rethinkdb).then((c) => {
        conn = c;
        r.table("voting").changes().run(conn)
            .then(function(cursor) {
                cursor.each(function(err, item) {
                    console.log('Change detected' + JSON.stringify(item));
                    if (item && item.new_val)
                         socket.emit("voting_updated", item.new_val);
                });
            });
    })
        .error(function(err) { console.log("Failure:", err); });
});
