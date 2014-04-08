/*
 * GET users listing.
 */


exports.find = function(db) {
    return function(req, res) {
        var coll = db.get('meetings');

        coll.find({}, function(e, docs) {
            if (e) {
                res.send("Błąd w dostępie do bazy danych.");
            } else {
                res.json(docs);
            }

        });
    };

};

/**
Funkcja zwraca spotkanie o zadanym kodzie spotkania
*/
exports.exists = function(db) {
    return function(req, res) {
        var coll = db.get('meetings');

        coll.findOne({
            "meetingCode": req.params.m
        }, function(e, docs) {
            res.json(docs);
        });
    };
};

// Zwraca średnią wartość głosów na daną konferencje
exports.getMeetingVotesValue = function(db) {
    return function(req, res) {
        var coll = db.get('votes');

        coll.find({ "meetingCode" : req.params.meeting }, function(e, docs) {
            if(e) {
                res.send("Błąd w dostępie do bazy danych.")
            }
            else
            {
                var srednia = parseFloat(0);
                for (var i = docs.length - 1; i >= 0; i--) {
                    srednia += parseFloat(docs[i].value);
                };
                srednia = srednia/docs.length;
                res.json({"value": srednia}); 
            }
            
        });
    };
};


var appendIf = function(condition, array, message) {
    if (condition) {
        array.push(message);
    }
};

var validateMeeting = function(meeting) 
{
    var messages = [];
    appendIf(meeting.date.length != 10 , messages, "incorrect meeting date");           //DD/MM/YYYY
    appendIf(meeting.startHour.length != 8 , messages, "incorrect meeting startHour");  //HH:MM:SS
    appendIf(meeting.endHour.length != 8 , messages, "incorrect meeting endHour");      //HH:MM:SS
    appendIf(meeting.title.length > 40 
        || meeting.title.length < 2 , messages, "incorrect meeting title");             //40 symbols
    appendIf(meeting.mac.length != 17, messages, "incorrect meeting mac");              //XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX
    
    return messages;
};

// Collection(collectionName)
var hasMeetingWithCode = function(collection, code, callbackNotExists, callbackExists) {
    collection.findOne({
        "meetingCode": code
    }, function(e, doc) {
        if (e) {
            // handle error
        } else {
            if (doc) {
                callbackExists();
            } else {
                callbackNotExists();
            }
        }
    });
};


exports.addMeeting = function(db) {
    return function(req, res) {

        var meeting = {
            mac: req.body.mac,
            date: req.body.date,
            startHour: req.body.startHour,
            endHour: req.body.endHour,
            title: req.body.title
        };

        var validationMessages = validateMeeting(meeting);
        //return in some errors appeared
        if (validationMessages.length != 0) {
            res.send({
                'errors': validationMessages
            });
            return
        }

        var str = Math.random().toString(36).substring(2, 6).toUpperCase();
        var collection = db.get('meetings');


        var successCallback = function() {
            meeting.meetingCode = str;
            collection.insert(meeting, function(err, docs) {
                if (err) {
                    res.send("Blad przy dodawaniu spotkania.");
                } else {
                    res.json({
                        "meetingCode": meeting.meetingCode
                    });
                }
            });
        };


        var failureCallback = function() {
            str = Math.random().toString(36).substring(2, 6).toUpperCase();
            hasMeetingWithCode(collection, str, successCallback, failureCallback);
        };

        hasMeetingWithCode(collection, str, successCallback, failureCallback);

    }
},

exports.deleteAllMeetings = function(db) {
    return function(req, res) {
        var collection = db.get('meetings');

        collection.drop();

        res.send("Skasowano wszystkie spotkania.");
    }

}