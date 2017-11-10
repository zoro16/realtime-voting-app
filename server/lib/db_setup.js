'use strict';

const r = require('rethinkdb');
const config = require('../config.json');

const projects = require('../data/projects.json');
const voting = require('../data/voting.json');


var conn;
r.connect(config.rethinkdb).then((c) => {
    conn = c;
    r.dbCreate(config.rethinkdb.db).run(conn);
})
    .then(() => {
        return r.tableCreate('users').run(conn)
    })
    .then(() => {
        return r.tableCreate('voting').run(conn)
    })
    .then(() => {
        return r.tableCreate('voting_report').run(conn)
    })
    .then(() => {
        return r
            .table('voting')
            .insert(voting)
            .run(conn)
    })
    .then(() => {
        conn.close();
    })
    .error((err) => {
        if (err.msg.indexOf("already exists") == -1)
            console.log(err);
    });
