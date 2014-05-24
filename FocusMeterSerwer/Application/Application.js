var express = require('express');
var routes = require('../routes');
var user = require('../routes/user');
var meetings = require('../routes/meetings');
var votes = require('../routes/votes');
var http = require('http');
var path = require('path');

var monk = require('monk');
var mongodb = require('mongodb');

var Application = function (port, databaseAddress) {
	this.port = port;
	this.databaseAddress = databaseAddress;

	this.init();
};

Application.prototype = {
	port: null,
	databaseAddress: null,
	database: null,
	server: null,
	app: null,

	init: function() {
		this.database = monk(this.databaseAddress);

		this.app = express();

		this.app.use(express.bodyParser());
		this.app.use(this.app.router);
		
		// protractor
		// all environments
		this.app.set('port', process.env.PORT || this.port);
		this.app.set('views', path.join(__dirname, '../views'));
		this.app.set('view engine', 'jade');
		this.app.use(express.favicon());
		this.app.use(express.logger('dev'));
		this.app.use(express.json());
		this.app.use(express.urlencoded());
		this.app.use(express.methodOverride());
		this.app.use(this.app.router);
		this.app.use(express.static(path.join(__dirname, '../public')));

		//wow
		this.app.all('*', function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "X-Requested-With");
			next();
		});

		// development only
		if ('development' == this.app.get('env')) {
		  this.app.use(express.errorHandler());
		}

		this.app.get('/', routes.index);
		this.app.get('/users', user.list);

		/**
		 * GET
		 * Wysyła do klienta tablicę zawierającą dane o wszystkich zarejestrowanych spotkaniach.
		 */
		this.app.get('/meetings', meetings.find(this.database));

		/**
		 * GET
		 * Jeśli spotkanie o zadanym kodzie istnieje w bazie danych, wysyła dane tego spotkania do klienta.
		 * @param m - kod spotkania
		 */
		this.app.get('/meeting/:m', meetings.exists(this.database));

		/**
		 * GET
		 * Wysyła do klienta średnią ocen spotkania o zadanym kodzie spotkania.
		 * @param meeting - kod spotkania
		 */
		this.app.get('/vote/average/:meeting', meetings.getMeetingVotesValue(this.database));

		/**
		 * GET
		 * Wysyła do klienta dokładną informację o głosach oddanych na danym spotkaniu. Wynik wysyłany jest w następującej postaci:
		 * {awesome: x,
		 *  great: x,
		 *  ok: x,
		 *  boring: x,
		 *  disaster: x}
		 *
		 * @param meeting - kod spotkania 
		 */
		this.app.get('/vote/:meeting', votes.getVotes(this.database));
		this.app.get('/lav/:meeting', meetings.getLastAverageVotes(this.database));

		/**
		 * POST
		 * Dodaje głos do bazy danych.
		 * @param meetingCode - kod spotkania, którego dotyczy głos
		 * @param voteTime - dokładny czas dodawania głosu
		 * @param value - wartość głosu z zakresu [-2, 2]
		 */
		this.app.post('/vote', votes.addVote(this.database));

		/**
		 * POST
		 * Rejestruje w bazie danych nowe spotkanie. Generuje kod spotkania i kod admina, a następnie wysyła do klienta kompletną informację o nowo
		 * utworzonym spotkaniu
		 * @param title - tytuł spotkania
		 */
		this.app.post('/meeting', meetings.addMeeting(this.database));

		/**
		 * POST
		 * Wpisuje do spotkania czas jego rozpoczęcia.
		 * @param adminCode - kod admina danego spotkania
		 * @param start - dokładny czas rozpoczęcia spotkania
		 */
		this.app.post('/meeting/start', meetings.startMeeting(this.database));

		/**
		 * POST
		 * Wpisuje do spotkania czas jego zakończenia,
		 * @param adminCode - kod admina danego spotkania
		 * @param end - dokładny czas zakończenia spotkania
		 */
		this.app.post('/meeting/end', meetings.endMeeting(this.database));
	},
	start: function() {
		this.server = http.createServer(this.app).listen(this.app.get('port'), function(){
	  	console.log('Express server listening on port ');
		});
	},
	stop: function() {
		this.server.close();
	}
};

module.exports = Application;