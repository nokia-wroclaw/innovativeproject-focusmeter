var mongo = require('mongodb');
var monk = require('monk');

var Database = function(address) {
	this.address = address;

	this.init();
};

Database.prototype = {
	address: null,
	db: null,
	meetingCollection: null,
	votesCollection: null,
	init: function() {

		this.db = monk(this.address);

		this.meetingCollection = this.db.get('meetings');

		this.votesCollection = this.db.get('votes');
	},
	getMeetings: function(callback) {
		this.meetingCollection.find({}, callback);
	},
	getMeetingByMeetingCode: function(meetingCode, callback) {
		this.meetingCollection.findOne({
			$or: [{
                "meetingCode": meetingCode
            }, {
                "adminCode": meetingCode
            }]
		}, callback);
	},
	getMeetingsByUuid: function(uuid, callback) {
		this.meetingCollection.find({
			"uuid": uuid
		}, callback);
	},

	addMeeting: function(meeting, callback) {
		this.meetingCollection.insert(meeting, callback);
	},

	startMeeting: function(adminCode, startTime, callback) {
		this.meetingCollection.update({
			"adminCode": adminCode 
		}, {
			$set: {
				"start": startTime
			}
		}, callback);
	},
	endMeeting: function(adminCode, endTime, callback) {
		this.meetingCollection.update({
			"adminCode": adminCode 
		}, {
			$set: {
				"end": endTime
			}
		}, callback);
	},

	deleteMeeting: function(meetingCode, callback) {
		this.meetingCollection.remove({
			"meetingCode": meetingCode
		}, callback);
	},

	getVotesByMeetingCode: function(meetingCode, callback) {
		this.votesCollection.find({
			"meetingCode": meetingCode
		}, callback);
	},

	addVote: function(vote, callback) {
		this.votesCollection.insert(vote, callback);
	}
};

module.exports = Database;