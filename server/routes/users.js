'use strict';

const r = require( 'rethinkdb' );
const router = require( 'express' ).Router();
const connect = require( '../lib/connect' );
const projects = require('../data/projects.json');
const jwt = require('jsonwebtoken');
const config = require('../config');


function create_new_user(coreid) {
    let user = Object.assign( {}, {
        coreid: coreid
    });

    let data = [{
        id: user.coreid,
        alpha_votes_counter: 0,
        tech_funnel_votes_counter: 0,
        projects: projects
    }];

    return connect.connect()
        .then(conn => {
            r
                .table('users')
                .insert(data)
                .run(conn);
        });
}


router.post('/users', function(req, res, err) {
    create_new_user(req.body.coreid)
        .then(() => {
            // create a token
            var token = jwt.sign(
                {id: req.body.coreid},
                config.secret,
                {expiresIn: 86400} // expires in 24 hours
            );
            res.status(200).send({ auth: true, token: token, user_coreid: req.body.coreid});
        })
        .error(err => {
            res.status(400);
            res.json({error: err});
        });
});


module.exports = router;
