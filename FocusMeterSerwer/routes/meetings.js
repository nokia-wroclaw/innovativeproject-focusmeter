
/*
 * GET users listing.
 */


exports.find = function (db){
	return function(req, res) {
		var coll = db.get('meetings');

		coll.find({}, function(e,docs) {
			if(e) {
				res.send("Błąd w dostępie do bazy danych.");
			}
			else {
				res.json(docs);
			}
			
		});
	};
	 	
 	} ,

/**
Funkcja zwraca spotkanie o zadanym kodzie spotkania
*/
exports.fff = function(db) {
	return function(req, res) {
		var coll = db.get('meetings');

		coll.find({"meetingCode" : req.params.m}, function(e, docs) {
			res.json(docs);
		});
	};
},


exports.addMeeting = function(db) {
	return function(req, res) {
		var mac = req.body.mac;
		var date = req.body.date;
		var startHour = req.body.startHour;
		var endHour = req.body.endHour;
		var title = req.body.title;
		var meetingCode = "POIX";

		var coll = db.get('meetings');

		//check mac XX:XX:XX:XX:XX:XX
		if(mac.length != 17)
		{
			res.json({"message" : "incorrect meeting mac"});
			return;
		}

		//check date value DD/MM/YYYY
		if(date.length != 10)
		{
			res.json({"message" : "incorrect meeting date"});
			return;
		}

		//check startHour xX:XX XX
		if(startHour.length < 6 || startHour.length > 8)
		{
			res.json({"message" : "incorrect meeting startHour"});
			return;
		}

		//check endHour xX:XX XX
		if(endHour.length < 6 || endHour.length > 8)
		{
			res.json({"message" : "incorrect meeting endHour"});
			return;
		}

		//check title (length=40)
		if(title.length < 1 || title.length > 40)
		{
			res.json({"message" : "incorrect meeting title"});
			return;
		}

		//check meeting code XXXX
		if(meetingCode.length != 4)
		{
			res.json({"message" : "incorrect meeting meetingCode"});
			return;
		}

		coll.insert({
			"mac" : mac,
			"date" : date,
			"startHour" : startHour,
			"endHour" : endHour,
			"title" : title,
			"meetingCode" : meetingCode
		}, function(err, docs) {
			if(err) {
				res.send("Blad przy dodawaniu spotkania.");
			}
			else
			{
				res.json({"meetingCode": meetingCode});
			}
		});
	}
},

exports.deleteAllMeetings = function(db) {
	return function(req, res) {
		var collection = db.get('meetings');

		collection.drop();

		res.send("Skasowano wszystkie spotkania.");
	}
	
}

