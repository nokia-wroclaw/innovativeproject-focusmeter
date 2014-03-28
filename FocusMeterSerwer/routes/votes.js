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
},

exports.addVote = function(db) {
	return function(req, res) {
		var meetingCode = req.body.meetingCode;
		var mac = req.body.mac;
		var value = req.body.value;

		var collection = db.get('votes');
		
		//check vote value [-2:2]
		if(value<-2 || value>2 || isNaN(value))
		{
			res.json({"message" : "incorrect vote value"});
			return;
		}

		//check mac XX:XX:XX:XX:XX:XX
		 if(mac.length != 17)
		{
			res.json({"message" : "incorrect vote mac"});
			return;
		}

		//check meeting code XXXX
		if(meetingCode.length != 4)
		{
			res.json({"message" : "incorrect vote meetingCode"});
			return;
		}
		

		collection.insert({
			"mac" : mac,
			"meetingCode" : meetingCode,
			"value" : value
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
