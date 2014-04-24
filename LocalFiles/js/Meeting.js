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
                    alert("Witamy na spotkaniu.");

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
                    alert("Spotkanie o kodzie \"" + MeetingCode + "\" się skończyło albo jeszcze się nie zaczęło.")
                }
            }
            else {
                alert("Nie ma spotkania o kodzie: " + MeetingCode);
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

    ShowVoteModal();
};

function initControlPanel() {
                

}