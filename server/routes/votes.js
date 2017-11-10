'use strict';

const r = require('rethinkdb');
const router = require('express').Router();
const connect = require('../lib/connect');
const config = require('../config.json');
const jwt = require('jsonwebtoken');


function mapDataToD3Struct(data) {
    let d3_data = [];
    for(let i=0; i<data.length; i++){
        d3_data.push(
            {
                title: String(data[i]["project_number"]),
                value: data[i]["counter"]
            });
    }

    return d3_data;
}

function filter_votes_by_project_type(req, res, project_type) {
    return connect.connect()
        .then(conn => {
            r
                .table('voting')
                .filter({project_type: project_type})
                .run(conn)
                .then(cursor => cursor.toArray())
                .then(result => {
                    res.send(mapDataToD3Struct(result));
                });

        });
}

router.get('/votes/:project_type', function(req, res) {
    let project_type = req.params.project_type;
    filter_votes_by_project_type(req, res, project_type)
        .error(err => {
            res.status(400);
            res.json({error: err});
        });
});

// ==============================================

function update_db_for_votes(isVoted, project_title,
                             project_type, submitter_name,
                             user_id, project_number, voter_name,
                             id, info_url) {
    let counter = {};
    if(isVoted === true){
        counter = {counter: r.row('counter').add(1)};
    } else {
        counter = {counter: r.row('counter').sub(1)};
    }

    let new_record = {
        voter_name: voter_name,
        project_title: project_title,
        project_number: project_number,
        timestamp: new Date().toLocaleString(),
        voted: isVoted
    };

    let updated_vote_values = {};

    if(isVoted === true && project_type === "alpha"){
        updated_vote_values = {
            alpha_votes_counter: r.row('alpha_votes_counter').add(1)
        };

    }
    if(isVoted === false && project_type === "alpha"){
        updated_vote_values = {
            alpha_votes_counter: r.row('alpha_votes_counter').sub(1)
        };
    }

    if(isVoted === true && project_type === "tech_funnel") {
        updated_vote_values = {
            tech_funnel_votes_counter: r.row('tech_funnel_votes_counter').add(1)
        };
    }
    if(isVoted === false && project_type === "tech_funnel") {
        updated_vote_values = {
            tech_funnel_votes_counter: r.row('tech_funnel_votes_counter').sub(1)
        };
    }

    return connect.connect()
        .then(conn => {
            r.expr([
                r.table('voting')
                    .filter({project_number: project_number})
                    .update(counter),
                r.table('users')
                    .get(user_id)
                    .update(updated_vote_values),
                r.table('voting_report')
                    .insert(new_record),
                r.table('users')
                    .get(user_id)
                    .update(function (row) {
                        return {
                            projects: row('projects').filter(function (projects) {
                                return projects('project_number').ne(project_number);
                            })
                                .append({
                                    id: id,
                                    info_url: info_url,
                                    project_title: project_title,
                                    project_type: project_type,
                                    submitter_name: submitter_name,
                                    project_number: project_number,
                                    voted: isVoted
                                })
                        };
                    })

            ])
                .run(conn);
        });
}


router.post('/vote', function(req, res) {
    let isVoted = req.body.isVoted;
    let project_title = req.body.project_title;
    let project_type = req.body.project_type;
    let submitter_name = req.body.submitter_name;
    let user_id = req.body.user_id;
    let project_number = req.body.project_number;
    let voter_name = req.body.voter_name;
    let id = req.body.id;
    let info_url = req.body.info_url;
    isVoted = isVoted ? false : true;

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

                   update_db_for_votes(isVoted, project_title,
                                       project_type, submitter_name,
                                       user_id, project_number, voter_name,
                                       id, info_url)
                       .then(() => {
                           res.send({success: "looks good"});
                       })
                       .error(err => {
                           res.status(400);
                           res.json({error: err});
                       });
               });
});


module.exports = router;
