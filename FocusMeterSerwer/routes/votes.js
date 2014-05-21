var MESSAGES = require("../messages.js");
var message = MESSAGES.message;

/**
 * Function sending the response with JSON object with complete information about meeting votes. The keys of the
 * object are names of grades and the corresponding values are the numbers of that votes.
 */

exports.getVotes = function(db) {
	return function(req, res) {
		var collection = db.get('votes');

		collection.find({"meetingCode" : req.params.meeting}, function(e, docs) {
			if(e) {
				res.send("An error occurred while trying to access the database.")
			}
			else
			{
				var result = {
					"awesome" : 0,
					"great" : 0,
					"ok" : 0,
					"boring" : 0,
					"disaster" : 0
				};

				docs.forEach(function(vote) {
					switch(vote.value) {
						case "2":
							result.awesome += 1;
							break;
						case "1":
							result.great += 1;
							break;
						case "0":
							result.ok += 1;
							break;
						case "-1":
							result.boring += 1;
							break;
						case "-2":
							result.disaster += 1;
							break;
					}
				});

				res.json(result);
			}			
		});
	};
};

var appendIf = function(condition, array, message) {
    if (condition) {
        array.push(message);
    }
};

var validateVote = function(vote, db, callbackFunction)
{	
	var messages = [];
	appendIf(vote.value < -2 || vote.value > 2 || isNaN(vote.value), messages, "incorrect vote value");	// value: [-2; 2]
	//appendIf(vote.mac.length != 17, messages, "incorrect vote mac");				//XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX
	appendIf(vote.meetingCode.length != 5, messages, "incorrect vote meetingCode");	//XXXX
	
	var collection = db.get('meetings');

	var meeting = null;

	collection.findOne({
		meetingCode: vote.meetingCode
	}, function(err, docs) {
		if(err) {
			appendIf(true, messages, message.DB_ERROR);
			
		}
		else
		{
			if(docs) {
				appendIf("end" in docs, messages, message.MT_END);
			}
			else {
				appendIf(true, messages, message.NO_MEETING);
			}
		}

		callbackFunction(messages);
	});
};

exports.addVote = function(db) {
	return function(req, res) {
		var meetingCode = req.body.meetingCode;
		var voteTime = req.body.voteTime;
		var value = req.body.value;

		var collection = db.get('votes');
		
		var vote = {
			meetingCode : req.body.meetingCode,
			voteTime : req.body.voteTime,
			value : req.body.value
        };

        
        validateVote(vote, db, function(validationMessages) {
        	if (validationMessages.length != 0) {
	            res.send({
	                'errors': validationMessages
	            });
	        }
	        else {
				collection.insert({
					"voteTime" : vote.voteTime,
					"meetingCode" : vote.meetingCode,
					"value" : vote.value
					}, function(err, doc) {
						if(err) {
							res.send(message.VOTE_FAIL);
						}
						else
						{
							res.send(message.VOTE_OK);
						}
					});
		        };
    	});
	}
}
