
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var meetings = require('./routes/meetings');
var votes = require('./routes/votes');
var http = require('http');
var path = require('path');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('http://antivps.pl:27017/focusmeter', 
	{
		username: 'focusmeter',
		password: 'focusmeter'
	});

var app = express();

app.configure(function() {
  app.use(express.bodyParser());
  app.use(app.router);
});

// all environments
app.set('port', process.env.PORT || 3033);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

/**
 * GET
 * Wysyła do klienta tablicę zawierającą dane o wszystkich zarejestrowanych spotkaniach.
 */
app.get('/meetings', meetings.find(db));

/**
 * GET
 * Jeśli spotkanie o zadanym kodzie istnieje w bazie danych, wysyła dane tego spotkania do klienta.
 * @param m - kod spotkania
 */
app.get('/meeting/:m', meetings.exists(db));

/**
 * GET
 * Wysyła do klienta średnią ocen spotkania o zadanym kodzie spotkania.
 * @param meeting - kod spotkania
 */
app.get('/vote/average/:meeting', meetings.getMeetingVotesValue(db));

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
app.get('/vote/:meeting', votes.getVotes(db));

/**
 * POST
 * Dodaje głos do bazy danych.
 * @param meetingCode - kod spotkania, którego dotyczy głos
 * @param voteTime - dokładny czas dodawania głosu
 * @param value - wartość głosu z zakresu [-2, 2]
 */
app.post('/vote', votes.addVote(db));

/**
 * POST
 * Rejestruje w bazie danych nowe spotkanie. Generuje kod spotkania i kod admina, a następnie wysyła do klienta kompletną informację o nowo
 * utworzonym spotkaniu
 * @param title - tytuł spotkania
 */
app.post('/meeting', meetings.addMeeting(db));

/**
 * POST
 * Wpisuje do spotkania czas jego rozpoczęcia.
 * @param adminCode - kod admina danego spotkania
 * @param start - dokładny czas rozpoczęcia spotkania
 */
app.post('/meeting/start', meetings.startMeeting(db));

/**
 * POST
 * Wpisuje do spotkania czas jego zakończenia,
 * @param adminCode - kod admina danego spotkania
 * @param end - dokładny czas zakończenia spotkania
 */
app.post('/meeting/end', meetings.endMeeting(db));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
