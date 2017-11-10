'use strict';
const r = require( 'rethinkdb' );
const router = require( 'express' ).Router();
const config = require('../config.json');
const jwt = require('jsonwebtoken');
const connect = require('../lib/connect');


function filter_by_user(req, res, user) {
    return connect.connect()
        .then(conn => {
            r
                .table('users')
                .filter({id: user})
                .run(conn)
                .then(cursor => cursor.toArray())
                .then(result => {
                    res.send(result);
                });
        });
}

function get_project_info(req, res, user, project_id) {
    let id = parseInt(project_id);
    console.log(id)
    return connect.connect()
        .then(conn => {
            r
                .table('users')
                .get(user)("projects")
                .filter({id: id})
                .run(conn)
                .then(cursor => cursor.toArray())
                .then(result => {
                    res.send(result);
                });
        });
}

router.get('/projects/alpha/:user', function(req, res) {
    let user = req.params.user;
    let token = req.headers['x-auth-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(
        token,
        config.secret,
        (err, decoded) => {
            if(err) {
                return res.status(500).send({
                    auth: false,
                    message: 'Failed to authenticate token.'
                });
            }

            filter_by_user(req, res, user)
                .error(err => {
                    res.status(400);
                    res.json({error: err});
                });
        });
});

router.get('/projects/tech_funnel/:user', function(req, res) {
    let user = req.params.user;
    let token = req.headers['x-auth-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(
        token,
        config.secret,
        (err, decoded) => {
            if(err) {
                return res.status(500).send({
                    auth: false,
                    message: 'Failed to authenticate token.'
                });
            }

            filter_by_user(req, res, user)
                .error(err => {
                    res.status(400);
                    res.json({error: err});
                });
        });

});

router.post('/projects/details', function(req, res) {
    let project_id = req.body.proj_id;
    let user = req.body.user;
    let token = req.headers['x-auth-token'];
    if(!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token,
               config.secret,
               (err, decoded) => {
                   if(err) {
                       return res.status(500).send({
                           auth: false,
                           message: 'Failed to authenticate token.'
                       });
                   }
                   get_project_info(req, res, user, project_id)
                       .error(err => {
                           res.status(400);
                           res.json({error: err});
                       });

              });

});


module.exports = router;
