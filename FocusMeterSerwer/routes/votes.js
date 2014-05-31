var MESSAGES = require("../messages.js");
var message = MESSAGES.message;

/**
 * Function sending the response with JSON object with complete information about meeting votes. The keys of the
 * object are names of grades and the corresponding values are the numbers of that votes.
 */

exports.getVotes = function(db) {
	return function(req, res) {
		var meetingCode = req.params.meeting;
		db.getVotesByMeetingCode(meetingCode, function(e, docs) {
			if(e) {
				res.json({
					"message": message.DB_ERROR
				});
			} else {
				if (docs) {
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
				} else {
					res.json({"message": message.NO_MEETING});
				}

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

	var meeting = null;

	db.getMeetingByMeetingCode(vote.meetingCode, function(e, docs) {
		if(e) {
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
	        	db.addVote(vote, function(e, docs) {
	        		if(e) {
						res.send({"message": message.VOTE_FAIL});
					}
					else
					{
						res.send({"message" : message.VOTE_OK});
					}
	        	});
		    };
    	});
	}
};

// Zwraca średnią wartość głosów na daną konferencje
exports.getMeetingVotesValue = function(db) {
    return function(req, res) {
    	var meetingCode = req.params.meeting;

		db.getVotesByMeetingCode(meetingCode, function(e, docs) {
            if (e) {
                res.json({
                    "message": message.DB_ERROR
                });
            } else {
                if (docs) {
                    var srednia = parseFloat(0);
                    for (var i = docs.length - 1; i >= 0; i--) {
                        srednia += parseFloat(docs[i].value);
                    };
                    srednia = srednia / docs.length;
                    res.json({
                        "value": srednia
                    });
                } else {
                    res.json({
                        "message": message.NO_MEETING
                    });
                }
            }

        });
    };
};

// Returns last 10 average vote values
exports.getLastAverageVotes = function(db) {
    return function(req, res) {
        var meetingStartTime = new Date();

        var meetingCode = req.params.meeting;

        db.getMeetingByMeetingCode(meetingCode, function(e, docs) {
        	if (e) {
                res.json({
                    "message": message.DB_ERROR
                });
            } else {
                if (docs) {
                    meetingStartTime = new Date(docs.start);

                    db.getVotesByMeetingCode(meetingCode, function(e, docs) {
                    	if (e) {
		                    res.json({
		                        "message": message.DB_ERROR
		                    });
		                } else {
		                    if (docs) {
		                        var result = [];
		                        var resultsNumber = 10;
		                        var minutes = 0;
		                        var interval = 1;

		                        for (var i = 0; i < resultsNumber; i++) {
		                            var average = parseFloat(0);
		                            var counter = 0;
		                            var found = 0;
		                            var currentDate = new Date();
		                            currentDate.setMinutes(currentDate.getMinutes() - minutes);


		                            for (var j = docs.length - 1; j >= 0; j--) {
		                                var voteTime = new Date(docs[j].voteTime);
		                                if (voteTime <= currentDate) {
		                                    average += parseFloat(docs[j].value);
		                                    counter++;
		                                    found = 1;
		                                }

		                            };

		                            minutes += interval;

		                            if (found == 1) {
		                                average = average / counter;
		                                var ONE_MINUTE = 1000 * 60;
		                                var time = Math.abs(meetingStartTime - currentDate);
		                                time = Math.round(time / ONE_MINUTE);
		                                result.push({
		                                    "time": time,
		                                    "average": average
		                                })

		                            } else {
		                                break;
		                            };
		                        };
		                        res.json(result);
		                    } else {
		                        res.json({
		                            "message": message.NO_MEETING
		                        });
		                    }
		                }
                    });
                }
            }
        });
    };
};

exports.getAllAverages = function(db) {
	return function(req, res) {
		var meetingCode = req.params.meetingCode;

		db.getMeetingByMeetingCode(meetingCode, function(e, docs) {
			if(e) {
				res.json({
					"message": message.DB_ERROR
				});
			} else {
				if (docs) {
					if(!("end" in docs)) {
						res.json({
							"message" : "Meeting not ended."
						});
						return;
					}

					var startDate = new Date(docs.start);
					var endDate = new Date(docs.end);
					var dateDifference = Math.abs(endDate - startDate);

					var interval = dateDifference/10;

					var result = [];

					db.getVotesByMeetingCode(meetingCode, function(e, docs) {
						if(e) {
							res.json({
								"message": message.DB_ERROR
							});
						} else {
							for(var i = 1; i <= 10; i++) {
								var dateTmp = new Date(startDate.getTime() + i*interval);
								var counter = 0,
									sum = 0;

								docs.forEach(function(vote) {
									var voteTime = new Date(vote.voteTime);
									if(voteTime <= dateTmp) {
										sum += parseFloat(vote.value);
										counter++;
									}
								});

								var average = counter ? (sum/counter) : 0;

								result.push({
									time: millisecondsToMinutes(i*interval),
									average: average
								});
							}

							res.json(result);
							
						}


						
					});
				}
			}
		});
	}
};

function millisecondsToMinutes(milliseconds) {
	var seconds = milliseconds/1000;

	var minutes = Math.floor(seconds/60);

	var numseconds = Math.floor(seconds % 60);

	return minutes.toString() + ":" + numseconds.toString();
}
