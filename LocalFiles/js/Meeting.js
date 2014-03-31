MeetingCode="";

function goBackToStartScreen() {
    window.location = './index.html';
}
function goToGradeScreen() {
    window.location = './GradeMeeting.html';
}

function autotab(current, to) {
    if (current.getAttribute &&
      current.value.length == "1") {
        to.focus()
    }
}

$("#codeReadyButton").bind("click", 

function Send() {

    MeetingCode = $("#code_1").attr("value");
    MeetingCode = MeetingCode + $("#code_2").attr("value");
    MeetingCode = MeetingCode + $("#code_3").attr("value");
    MeetingCode = MeetingCode + $("#code_4").attr("value");

    $.ajax({
        type: "POST",
        url: "http://156.17.234.85:3000/addMeeting",
        data: {

            "mac": mac,
            "meetingCode": MeetingCode
        },
        processData: true,
        success: function (meetingCode) {
            alert("Witamy na spotkaniu! " + meetingCode);


        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error, status: " + textStatus + ", errorThrown: " + errorThrown);
        }
    });
});

//////////////////////////////
////Grade meeting area////////
//////////////////////////////

function ShowVoteModal() {

    $('#ThanksForVoteModal').modal('toggle');

 
}




function SendVote(vote) {

    var gradeName = $(vote).attr("id");
    var grade = gradeName.substr(9, gradeName.length);

    $.ajax({
        type: "POST",
        url: "http://156.17.234.85:3000/addMeeting",
        data: {

            "mac": mac,
            "meetingCode": MeetingCode,
            "grade": grade
        },
        processData: true,
        success: function (meetingCode) {
            alert("Witamy na spotkaniu! " + meetingCode);


        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error, status: " + textStatus + ", errorThrown: " + errorThrown);
        }
    });

    ShowVoteModal();
};