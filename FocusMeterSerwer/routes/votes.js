/**
Funkcja zwraca glosy z danego spotkania.
*/

exports.getVotes = function(db) {
	return function(req, res) {
		var coll = db.get('votes');

		coll.find({"meetingCode" : req.params.meeting}, function(e, docs) {
			if(e) {
				res.send("Błąd w dostępie do bazy danych.")
			}
			else
			{
				res.json(docs);	
			}			
		});
	};
};

var appendIf = function(condition, array, message) {
    if (condition) {
        array.push(message);
    }
};

var validateVote = function(vote, collecion)
{	
	var messages = [];
	appendIf(vote.value < -2 || vote.value > 2 || isNaN(vote.value), messages, "incorrect vote value");	// value: [-2; 2]
	appendIf(vote.mac.length != 17, messages, "incorrect vote mac");				//XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX
	appendIf(vote.meetingCode.length != 5, messages, "incorrect vote meetingCode");	//XXXX
	return messages;
};

exports.addVote = function(db) {
	return function(req, res) {
		var meetingCode = req.body.meetingCode;
		var mac = req.body.mac;
		var value = req.body.value;

		var collection = db.get('votes');
		
		var vote = {
			meetingCode : req.body.meetingCode,
			mac : req.body.mac,
			value : req.body.value
        };

        
        var validationMessages = validateVote(vote, collection);
        //return if some error appeared
        if (validationMessages.length != 0) {
            res.send({
                'errors': validationMessages
            });
            return
        }
		
	
		collection.insert({
			"mac" : vote.mac,
			"meetingCode" : vote.meetingCode,
			"value" : vote.value
		}, function(err, doc) {
			if(err) {
				res.send("Blad przy oddawaniu glosu.");
			}
			else
			{
				res.send("Dodano glos");
		}
		})
	}
}
