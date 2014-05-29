var meetingCode = "";

function goBackToStartScreen() {
    window.location = './index.html';
}
function goToGradeScreen() {
    //window.location = './GradeMeeting.html';
}
/*
Funkcja umo¿liwia szybsze i bardziej intuicyjne wpisywanie kodu. Przyjmuj¹c w argumencie 2 elementy: Ÿród³owy i docelowy,
zaznacza docelowy jako aktywny po wpisaniu jednego znaku w elemencie Ÿród³owym.
*/
function autotab(current, to) {
    if (current.getAttribute &&
      current.value.length == "1") {
        to.focus()
    }
}

/**
 * Funkcja odpowiedzialna za zalogowanie na spotkanie. Do serwera wysyłane jest zapytanie, czy spotkanie o danym kodzie
 * jest zarejestrowane w bazie danych. W zależności od tego, czy wpisano kod spotkania, czy kod admina, użytkownik przenoszony
 * jest odpowiednio do panelu głosowania lub do panelu prowadzącego spotkanie.
 */
$("#codeReadyButton").bind("click",

function LoginToMeeting() {

    meetingCode = $("#code_1").val();
    meetingCode = meetingCode + $("#code_2").val();
    meetingCode = meetingCode + $("#code_3").val();
    meetingCode = meetingCode + $("#code_4").val();
    meetingCode = meetingCode + $("#code_5").val();
    meetingCode = meetingCode.toUpperCase();

    //inserting into session html memory

    
    // Having adminCode in response is insecure (!)
    $.ajax({
        type: "GET",
        url: "http://antivps.pl:3033/meeting/" + meetingCode,
        success: function (data){
            if("_id" in data) {
                
                    

                    if (typeof (Storage) != "undefined") {

                        localStorage.setItem("meetingCode", data.meetingCode);

                        localStorage.setItem("meetingCodeControl", data.adminCode);
                        localStorage.setItem("meetingTitle", data.title);
                    }

                    if(meetingCode === data.meetingCode) {
                        if(!("start" in data)) {
                            alert("The meeting hasn't been started yet.");
                        }
                        else if("end" in data) {
                            alert("The meeting has been finished.");
                        }
                        else {
                            alert("Welcome on the meeting.");
                            window.location = './GradeMeeting.html';
                        }
                    }
                    else if(meetingCode === data.adminCode) {
                            if (typeof (Storage) != "undefined") {
                                var dateTmp;

                                if("end" in data) {
                                    localStorage.setItem("started", "2");
                                    dateTmp = new Date(data.end);
                                    localStorage.setItem("endTime", dateTmp.getTime().toString());

                                    dateTmp = new Date(data.start);
                                    localStorage.setItem("startTime", dateTmp.getTime().toString());
                                }
                                else if("start" in data) {
                                    localStorage.setItem("started", "1");
                                    dateTmp = new Date(data.start);
                                    localStorage.setItem("startTime", dateTmp.getTime().toString());
                                }
                                else {
                                    localStorage.setItem("started", "0");
                                      //clearing localStorage options for watcher
                                    localStorage.removeItem("startingTime");
                                    localStorage.removeItem("timeToAdd");
                                }

                            }
                        window.location = './Charts.html';
                    }

                    
                

            }
            else {
                alert("There's no meeting with code: " + meetingCode);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        	if (jqXHR.status === 0) {
                alert("Verify network.");
            } else if (jqXHR.status == 404) {
                alert("Requested page not found.");
            } else if (jqXHR.status == 500) {
                alert("Internal Server Error.");
            } else if (textStatus === "timeout") {
                alert("Time out error.");
            } else {
                alert("Uncaught Error.\n" + jqXHR.responseText);
            }
                
                
        }
    });

});



//////////////////////////////
////Grade meeting area////////
//////////////////////////////

function ShowVoteModal() {

    $('#ThanksForVoteModal').modal('toggle');


}



/**
 * Funkcja odpowiedzialna za wysłanie głosu na serwer.
 */
function SendVote(vote) {

    var gradeName = $(vote).attr("id");
    var grade = gradeName.substr(9, gradeName.length);
    var timeOfVote;

    var minutes = 0.1;
    var milliseconds = minutes * 60 * 1000;

    var diff;



    //retriving meetingCode from session memoty
    if (typeof (Storage) != "undefined") {
        meetingCode = localStorage.getItem("meetingCode");

        if (localStorage.getItem("voteTime") != null) {
            timeOfVote = new Date(localStorage.getItem("voteTime"));
            diff = (new Date()).getTime() - timeOfVote.getTime();
        }
        else {
            timeOfVote = new Date();
            diff = 300001;
        }
    }
    else {
        meetingCode = "dupa";
        timeOfVote = new Date();
    }

    

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
                "voteTime" : (new Date()),
                "meetingCode": meetingCode,
                "value": grade
            },
            processData: true,
            success: function (message) {
                if ("errors" in message) {
                    alert(message.errors);
                }
                else {
                    alert(message.message);
                }


            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 0) {
                    alert("Verify network.");
                } else if (jqXHR.status == 404) {
                    alert("Requested page not found.");
                } else if (jqXHR.status == 500) {
                    alert("Internal Server Error.");
                } else if (textStatus === "timeout") {
                    alert("Time out error.");
                } else {
                    alert("Uncaught Error.\n" + jqXHR.responseText);
                }
            }
        });
    }
    else {
        alert("You can't vote for this meeting yet.\nYou can add new vote after " + ((milliseconds-diff)/1000) + " s");
    	
    }



    //ShowVoteModal();
};

function initControlPanel() {
                

}