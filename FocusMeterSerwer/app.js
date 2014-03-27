
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

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

// 
app.get('/meetings', meetings.find(db));
app.get('/meeting/:m', meetings.fff(db));
app.get('/votes/:meeting', votes.getVotes(db));

app.post('/addVote', votes.addVote(db));
app.post('/addMeeting', meetings.addMeeting(db));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
