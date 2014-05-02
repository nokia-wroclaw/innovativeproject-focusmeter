MeetingCode = "";

function goBackToStartScreen() {
    window.location = './index.html';
}
function goToGradeScreen() {
    //window.location = './GradeMeeting.html';
}

function autotab(current, to) {
    if (current.getAttribute &&
      current.value.length == "1") {
        to.focus()
    }
}

$("#codeReadyButton").bind("click",

function LoginToMeeting() {

    MeetingCode = $("#code_1").val();
    MeetingCode = MeetingCode + $("#code_2").val();
    MeetingCode = MeetingCode + $("#code_3").val();
    MeetingCode = MeetingCode + $("#code_4").val();
    MeetingCode = MeetingCode + $("#code_5").val();
    MeetingCode = MeetingCode.toUpperCase();

    //inserting into session html memory

    
    
    $.ajax({
        type: "GET",
        url: "http://antivps.pl:3033/meeting/" + MeetingCode,
        success: function (data){
            if(data) {
                if (checkDateAndHour(data) == 1) {
                    alert("Welcome on the meeting.");

                    if (typeof (Storage) != "undefined") {

                        localStorage.setItem("MeetingCode", data.meetingCode);

                        localStorage.setItem("meetingCodeControl", data.adminCode);
                    }

                    if(MeetingCode === data.meetingCode) {
                        window.location = './GradeMeeting.html';
                    }
                    else if(MeetingCode === data.adminCode) {
                        window.location = './ControlMeeting.html';
                    }

                    
                }

                else {
                    alert("Meeting with code \"" + MeetingCode + "\" has been finished or hasn't been started yet.")
                }
            }
            else {
                alert("There's no meeting with code: " + MeetingCode);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
                alert("Error, status: " + textStatus + ", errorThrown: " + errorThrown);
        }
    });

});

function checkDateAndHour(meeting) {
    //var dateArr = meeting.date.split("/");

    //var date = new Date(dateArr[2], dateArr[1]-1, dateArr[0]);
    var today = new Date();
    var date = new Date(meeting.date);

    if (date.getYear() == today.getYear()
        && date.getMonth() == today.getMonth()
        && date.getDate() == today.getDate()) {
        return 1;
    }

    else {
        return 0;
    }
};



//////////////////////////////
////Grade meeting area////////
//////////////////////////////

function ShowVoteModal() {

    $('#ThanksForVoteModal').modal('toggle');


}




function SendVote(vote) {

    var gradeName = $(vote).attr("id");
    var grade = gradeName.substr(9, gradeName.length);
    var timeOfVote;

    var minutes = 5;
    var milliseconds = minutes * 60 * 1000;



    //retriving MeetingCode from session memoty
    if (typeof (Storage) != "undefined") {
        MeetingCode = localStorage.getItem("MeetingCode");

        if (localStorage.getItem("voteTime") != null) {
            timeOfVote = new Date(localStorage.getItem("voteTime"));
        }
        else {
            timeOfVote = new Date();
        }
    }
    else {
        MeetingCode = "dupa";
        timeOfVote = new Date();
    }

    var diff = (new Date()).getTime() - timeOfVote.getTime();

    if (diff > milliseconds) {
        if (typeof (Storage) != "undefined") {
            localStorage.removeItem("voteTime");
            localStorage.setItem("voteTime", (new Date()).toString());
        }

        var mac = "23-23-23-23-23-23";

        $.ajax({
            type: "POST",
            url: "http://antivps.pl:3033/vote",
            data: {

                "mac": mac,
                "meetingCode": MeetingCode,
                "value": grade
            },
            processData: true,
            success: function (message) {
                alert(message);


            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Error, status: " + textStatus + ", errorThrown: " + errorThrown);
            }
        });
    }
    else {
        alert("You can't vote for this meeting yet. You can add new vote after " + ((milliseconds-diff)/1000) + " s");
    }



    //ShowVoteModal();
};

function initControlPanel() {
                

}