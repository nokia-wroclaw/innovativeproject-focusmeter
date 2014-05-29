
/**
 * Module dependencies.
 */
var Application = require('./Application/Application');
var Database = require('./Application/Database');
var Config = require('./config/config.js');

var db = new Database(Config.remoteDatabaseAddress);

var app = new Application(Config.port, db);

app.start();
