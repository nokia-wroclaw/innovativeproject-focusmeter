var assert = require("assert");
var votes = require("../routes/votes.js")
var meetings = require("../routes/meetings.js")
var request = require("request");

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
});

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