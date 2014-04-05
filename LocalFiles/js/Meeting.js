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

    //inserting into session html memory

    if (typeof (Storage) != "undefined") {

        localStorage.setItem("MeetingCode", MeetingCode);

    }
    
    $.ajax({
        type: "GET",
        url: "http://antivps.pl:3033/meeting/" + MeetingCode,
        success: function (data){
            if(data.length > 0) {
                alert("Witamy na spotkaniu.");

                window.location = './GradeMeeting.html';
            }
            else {
                alert("Nie ma spotkania o takim kodzie.");
            }
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

    var mac = "23-23-23-23-23-23";

    $.ajax({
        type: "POST",
        url: "http://antivps.pl:3033/addVote",
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

    ShowVoteModal();
};