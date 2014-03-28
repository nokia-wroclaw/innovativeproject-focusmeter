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

},

/**
Funkcja zwraca spotkanie o zadanym kodzie spotkania
*/
exports.fff = function(db) {
    return function(req, res) {
        var coll = db.get('meetings');

        coll.find({
            "meetingCode": req.params.m
        }, function(e, docs) {
            res.json(docs);
        });
    };
},


var appendIf = function(condition, array, message) {
    if (condition) {
        array.push(message);
    }
};

var validate = function(meeting) {

    var messages = [];
    appendIf(meeting.mac.length != 17, messages, "incorrect meeting mac");
    appendIf(meeting.date~ / huhuhuhu / , messages, "incorrect meeting mac");

    // //check mac XX:XX:XX:XX:XX:XX
    // if (mac.length != 17) {
    //     res.json({
    //         "message": "incorrect meeting mac"
    //     });
    //     return;
    // }

    // //check date value DD/MM/YYYY
    // if (date.length != 10) {
    //     res.json({
    //         "message": "incorrect meeting date"
    //     });
    //     return;
    // }

    // //check startHour xX:XX XX
    // if (startHour.length < 6 || startHour.length > 8) {
    //     res.json({
    //         "message": "incorrect meeting startHour"
    //     });
    //     return;
    // }

    // //check endHour xX:XX XX
    // if (endHour.length < 6 || endHour.length > 8) {
    //     res.json({
    //         "message": "incorrect meeting endHour"
    //     });
    //     return;
    // }

    // //check title (length=40)
    // if (title.length < 1 || title.length > 40) {
    //     res.json({
    //         "message": "incorrect meeting title"
    //     });
    //     return;
    // }

    // //check meeting code XXXX
    // if (meetingCode.length != 4) {
    //     res.json({
    //         "message": "incorrect meeting meetingCode"
    //     });
    //     return;
    // }

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
}


exports.addMeeting = function(db) {
    return function(req, res) {

        var meeting = {
            mac: req.body.mac,
            date: req.body.date,
            startHour: req.body.startHour,
            endHour: req.body.endHour,
            title: req.body.title
        };

        var validationMessages = validate(meeting);
        if (!validate(meeting)) {
            res.send({
                'errors': validationMessages
            });
            return;
        }

        var str = Math.random().toString(36).substring(2, 6).toUpperCase();
        var collection = db.get('meetings');

        var successCallback = function() {
            meeting.meetingCode = str;
            coll.insert(meeting, function(err, docs) {
                if (err) {
                    res.send("Blad przy dodawaniu spotkania.");
                } else {
                    res.json({
                        "meetingCode": meetingCode
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