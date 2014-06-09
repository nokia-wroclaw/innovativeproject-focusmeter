var assert = require("assert");
var votes = require("../routes/votes.js")
var meetings = require("../routes/meetings.js")
var request = require("request");
var Application = require("../Application/Application");
var Database = require("../Application/Database");
var config = require("../config/config.js");

describe('Validate meeting', function(){
	describe('Check title length', function() {
		it('Should return a message about incorrect title when title is too small', function() {
			var smallTitle = "a";

			var meeting = {
				mac: "23-12-32-12-32-12",
				title: smallTitle
			};

			var messages = meetings.validateMeeting(meeting);

			assert.equal(messages.length, 1);
			assert.equal(messages[0], "incorrect meeting title");

		});

		it('Should return a message about incorrect title when title is too big', function() {
			var maxLength = 40;
			var bigTitle = "";

			for(var i = 0; i <= maxLength + 7; i++) {
				bigTitle += "a";
			}
			var meeting = {
				mac: "23-12-32-12-32-12",
				title: bigTitle
			};

			var messages = meetings.validateMeeting(meeting);

			assert.equal(messages.length, 1);
			assert.equal(messages[0], "incorrect meeting title");

		});

		it('Should return no message if title is correct', function() {
			var maxLength = 40;
			var maxTitle = "";

			for(var i = 0; i < maxLength; i++) {
				maxTitle += "Q";
			}

			var meeting = {
				mac: "23-12-32-12-32-12",
				title: maxTitle
			};

			var messages = meetings.validateMeeting(meeting);

			assert.equal(messages.length, 0);
		})
	});
});

describe("Test if meeting is in database", function() {
	var app, db;
	before(function(done) {
		db = new Database(config.localDatabaseAddress);
		app = new Application(config.port, db);

		app.start();

		db.addMeeting({
				title: "Test meeting",
				uuid: "1234",
				meetingCode: "MONGO",
				adminCode: "BONGO"
			}, function(err, doc) {
				if(!err) {
					done();
				}
			});
	});

	after(function(done) {
		db.deleteMeeting("MONGO", function() {
			app.stop();
			done();
		});
	});

	it("Should return message if there's no meeting with code", function(done) {
		request('http://localhost:3033/meeting/RUBYMISZCZ', function(err, resp, body) {
			assert(!err);
			var message = JSON.parse(body);
			//console.log(message);
			assert(message.message, "There's no meeting with that code.");
			done();
		});
	});

	it("Should return meeting data if the meeting is in db", function(done) {
		request('http://localhost:3033/meeting/MONGO', function(err, resp, body) {
			assert(!err);

			var result = JSON.parse(body);

			assert(result.title, "Test meeting");
			assert(result.uuid, "1234");
			assert(result.meetingCode, "MONGO");
			assert(result.adminCode, "BONGO");

			done();
		});

	});
});
