'use strict';

const r = require( 'rethinkdb' );
const config = require( '../config.json' );


exports.connect = function() {
  return r.connect(config.rethinkdb);
};
