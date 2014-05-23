var assert = require("assert");
var votes = require("../routes/votes.js")
var meetings = require("../routes/meetings.js")
var request = require("request");

describe('GET meeting', function() {
	it("should respond with message", function(done) {
		request('http://antivps.pl:3033/meeting/RUBYMISZCZ', function(err, resp, body) {
			assert(!err);
			var message = JSON.parse(body);
			assert(message.message, "There's no meeting with that code.");
			done();
		});
	});
});

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