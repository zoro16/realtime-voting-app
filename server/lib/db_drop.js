'use strict';

const r = require('rethinkdb');
const config = require('../config.json');


var conn;
var p;
r.connect(config.rethinkdb)
    .then((c) => {
        conn = c;
        r.dbDrop(config.rethinkdb.db).run(conn)
    })
    .error((err) => {
        if (err.msg.indexOf("already exists") == -1)
            console.log(err);
    });

