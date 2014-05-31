/*
 * GET users listing.
 */

var messages = require("../messages.js");
var message = messages.message;

exports.find = function(db) {
    return function(req, res) {
        db.getMeetings(function(e, docs) {
            if(e) {
                res.json({
                    "message": message.DB_ERROR
                });
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
        var meetingCode = req.params.m;

        db.getMeetingByMeetingCode(meetingCode, function(e, docs) {
            if(e) {
                res.json({"message": message.DB_ERROR});
            } else {
                if (docs) {
                    res.json(docs);
                }
                else {
                    res.json({"message" : message.NO_MEETING});
                }
            }
        });
    };
};



/**
 * Zwraca liste spotkan o zadanym uuid.
 */
 exports.getMeetingsWithUuid = function(db) {
    return function(req, res) {
        var uuid = req.params.uuid;

        db.getMeetingsByUuid(uuid, function(e, docs) {
            if (e) {
                res.json({"message" : message.DB_ERROR});
            } else {
                if (docs) {
                    res.json(docs);
                }
                else {
                    res.json({"message" : message.NO_UUID});
                }
            }
        });
    }
 }






var appendIf = function(condition, array, message) {
    if (condition) {
        array.push(message);
    }
};

var validateMeeting = function(meeting) {
    var messages = [];
    //regular expressions
    //var reHour = /^[0,1]*[0-9]:[0-5][0-9]\s[a,p,A,P][m,M]$/;
    var reDate = /^[0-2][0-9]\/[0,1][0-9]\/2[0-9]{3}$/;
    var reMac = /^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$/;
    var reTitle = /^.{2,40}$/;

    //appendIf(meeting.date.length != 10 , messages, "incorrect meeting date");           //DD/MM/YYYY

    //appendIf(!reHour.test(meeting.startHour) , messages, "incorrect meeting startHour");  //HH:MM:SS

    //appendIf(!reHour.test(meeting.endHour) , messages, "incorrect meeting endHour");      //HH:MM:SS

    appendIf(!reTitle.test(meeting.title), messages, "incorrect meeting title"); //40 symbols

    //appendIf(!reMac.test(meeting.mac), messages, "incorrect meeting mac"); //XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX

    return messages;
};
module.exports.validateMeeting = validateMeeting;

// Collection(collectionName)
var hasMeetingWithCode = function(db, code, callbackNotExists, callbackExists) {
    db.getMeetingByMeetingCode(code, function(e, doc) {
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

exports.startMeeting = function(db) {
    return function(req, res) {
        var adminCode = req.body.adminCode,
            start = req.body.start;

        db.startMeeting(adminCode, start, function(e, docs) {
            if(e) {
                res.json({
                    "message": message.DB_ERROR
                });
            } else {
                res.json({
                    "message": message.MT_START
                });
            }
        });
    }
};

exports.endMeeting = function(db) {
    return function(req, res) {
        var adminCode = req.body.adminCode,
            end = req.body.end;

        db.endMeeting(adminCode, end, function(e, docs) {
            if(e) {
                res.json({
                    "message": message.DB_ERROR
                });
            } else {
                res.json({
                    "message": message.MT_END
                });
            }
        });
    }
};

exports.addMeeting = function(db) {
    return function(req, res) {

        //var dateArr = req.body.date.split("/");

        //var date = new Date(Date.UTC(dateArr[2], dateArr[1]-1, dateArr[0]));

        var meeting = {
            uuid: req.body.uuid,
            //date: date,
            //startHour: req.body.startHour,
            //endHour: req.body.endHour,
            title: req.body.title
        };

        var validationMessages = validateMeeting(meeting);
        //return if some errors appeared
        if (validationMessages.length != 0) {
            res.send({
                'errors': validationMessages
            });
            return
        }

        var str = Math.random().toString(36).substring(2, 7).toUpperCase();

        var codeFree = function() {
            meeting.meetingCode = str;

            var adminCode = Math.random().toString(36).substring(2, 7).toUpperCase();

            // collection.insert(meeting, function(err, docs) {
            //     if (err) {
            //         res.send("Blad przy dodawaniu spotkania.");
            //     } else {
            //         res.json({
            //             "meetingCode": meeting.meetingCode
            //         });
            //     }
            // });

            var adminFree = function() {
                meeting.adminCode = adminCode;

                db.addMeeting(meeting, function(err, docs) {
                    if (err) {
                        // Who cares :)
                    } else {
                        res.json(meeting);
                    }
                });
            };

            var adminTaken = function() {
                adminCode = Math.random().toString(36).substring(2, 7).toUpperCase();

                hasMeetingWithCode(db, adminCode, adminFree, adminTaken);
            };

            hasMeetingWithCode(db, adminCode, adminFree, adminTaken);
        };

        var codeTaken = function() {
            str = Math.random().toString(36).substring(2, 7).toUpperCase();
            hasMeetingWithCode(db, str, codeFree, codeTaken);
        };

        hasMeetingWithCode(db, str, codeFree, codeTaken);



    }
},

exports.deleteAllMeetings = function(db) {
    return function(req, res) {
        var collection = db.get('meetings');

        collection.drop();

        res.send("All meetings has been deleted.");
    }

}