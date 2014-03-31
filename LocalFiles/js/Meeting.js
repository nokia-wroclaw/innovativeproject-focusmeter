MeetingCode = "";

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

    MeetingCode = $("#code_1").val();
    MeetingCode = MeetingCode + $("#code_2").val();
    MeetingCode = MeetingCode + $("#code_3").val();
    MeetingCode = MeetingCode + $("#code_4").val();

    //inserting into session html memory

    if (typeof (Storage) != "undefined") {

        localStorage.setItem("MeetingCode", MeetingCode);

    }
    $.ajax({
        type: "POST",
        url: "http://antivps.pl:3033/addMeeting",
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



    //retriving MeetingCode from session memoty
    if (typeof (Storage) != "undefined") {
        MeetingCode = localStorage.getItem("MeetingCode");
    }
    else {
        MeetingCode = "dupa";
    }



    $.ajax({
        type: "POST",
        url: "http://antivps.pl:3033/addMeeting",
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