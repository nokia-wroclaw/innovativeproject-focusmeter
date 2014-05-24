
/**
 * Module dependencies.
 */
var Application = require('./Application/Application');
var Config = require('./config/config.js');

var app = new Application(Config.port, Config.remoteDatabaseAddress);

app.start();
