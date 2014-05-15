



$(document).ready(function() {

    var MeetingCode;
    var adminCode;
    var started;

    initTimer();

    initStartEndButton();

    if (typeof(Storage) != "undefined") {
        MeetingCode = localStorage.getItem("MeetingCode");
        adminCode = localStorage.getItem("meetingCodeControl");
    } else {
        MeetingCode = "dupa";
    }

    $("#code_1").val(MeetingCode.charAt(0));
    $("#code_2").val(MeetingCode.charAt(1));
    $("#code_3").val(MeetingCode.charAt(2));
    $("#code_4").val(MeetingCode.charAt(3));
    $("#code_5").val(MeetingCode.charAt(4));

    $("#adminCode_1").val(adminCode.charAt(0));
    $("#adminCode_2").val(adminCode.charAt(1));
    $("#adminCode_3").val(adminCode.charAt(2));
    $("#adminCode_4").val(adminCode.charAt(3));
    $("#adminCode_5").val(adminCode.charAt(4));

    getVotes(MeetingCode);

    setInterval(function(){getVotes(MeetingCode)}, 30000);

    $("#changeTime").click(function() {startAndStop(adminCode)});

    
});


function getVotes(MeetingCode) {
    $.ajax({
        type: "GET",
        url: "http://antivps.pl:3033/vote/average/" + MeetingCode,
        success: function(data) {
            refreshProgressBar(data.value);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error, status: " + textStatus + ", errorThrown: " + errorThrown);
        }
    });

    $.ajax({
        type: "GET",
        url: "http://antivps.pl:3033/vote/" + MeetingCode,
        success: function(data) {
            drawHistogram(data);
        },
        error: function(jqXHRm, textStatus, errorThrown) {
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
};


function refreshProgressBar(average) {
    var gradePercent = ((average + 2) / 4) * 100;
            
    $("#meetingGrade").attr('style', "width: " + gradePercent + "%");

    switch (true) {
        case (gradePercent <= 20):
            $('#meetingGrade').attr('class', "progress-bar progress-bar-danger");
            break;
        case (gradePercent < 40 && gradePercent > 20):
            $('#meetingGrade').attr('class', "progress-bar progress-bar-warning");
            break;
        case (gradePercent <= 60 && gradePercent >= 40):
            $('#meetingGrade').attr('class', "progress-bar progress-bar-info");
            break;
        case (gradePercent < 80 && gradePercent > 60):
            $('#meetingGrade').attr('class', "progress-bar progress-bar-success");
            break;
        case (gradePercent >= 80):
            $('#meetingGrade').attr('class', "progress-bar progress-bar-success");
            break;
        default:
            $('#meetingGrade').attr('class', "progress-bar");
    }
};

function drawHistogram(data) {

    //google charts..
    google.load("visualization", "1", {
        packages: ["corechart"]
    });
    google.setOnLoadCallback(drawHistogram);

    var data = google.visualization.arrayToDataTable(
        convertJsonToGoogleFormat(data));

    var options = {
        title: "Histogram",
        width: "100%",
        height: "100%",
        bar: {
            groupWidth: "85%"
        },
        // chartArea: {
        //     width: "80%",
        //     height: "70%"
        // },
        legend: {
            position: "none"
        },
        dataOpacity: 0.9,
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('hist_div'));
    chart.draw(data, options);
}


/**
 * Function converting the JSON object returned by Focus Meter Server to an array
 * needed by Google Charts API.
 * @param votesData - object with number of votes
 * @return an array.
 */
function convertJsonToGoogleFormat(votesData) {
    var resultArray = [['Grade', 'Votes', {role: 'style'}]];

    resultArray.push(['Disaster', votesData.disaster, 'color: #E0553B']);
    resultArray.push(['Boring', votesData.boring, 'color: #E58955']);
    resultArray.push(['OK', votesData.ok, 'color: #27B0F4']);
    resultArray.push(['Great', votesData.great, 'color: #458BF6']);
    resultArray.push(['Awesome', votesData.awesome, 'color: #0FC085']);

    return resultArray;
}


google.load("visualization", "1", {
    packages: ["corechart"]
});
google.setOnLoadCallback(drawGraph);

function drawGraph() {
    var data = google.visualization.arrayToDataTable([
        ['Time', 'Opinion',],
        ['12:30', 0],
        ['12:35', 1],
        ['12:40', 1.7],
        ['12:50', 1.6],
        ['13:05', 0.7],
        ['13:10', 0.2],
        ['13:15', - 0.5],
        ['13:20', 0],
        ['13:25', 0.2],
        
    ]);

    var options = {
    title: 'Graph',
    curveType: 'function',
    legend: { position: 'none' },
    vAxis: {
        minValue: -2,
        maxValue: 2
    },
    // chartArea: {
    //         width: "80%",
    //         height: "70%"
    //     },
    dataOpacity: 0.9,
  };

    var chart = new google.visualization.LineChart(document.getElementById('graph_div'));
    chart.draw(data, options);
}
//..google charts


function goBackToStartScreen() {
    window.location = './index.html';
}





function initTimer() {
    var isStarted = localStorage.getItem("started");
    
    if(isStarted == '0'){
      localStorage.removeItem("timeToAdd");
      $('#htmlTimer').attr("value", '00:00:00' );

    }
    //if it was started before and meeting is running
     else{

        var startingTimeString = localStorage.getItem("startTime");
       

        // var startingTime = Date.now(startingTimeString);
        var startingTime = parseInt(startingTimeString);

        var currentMeetingDuration;

        // If the meeting is finished we want to show on timer the length of it.
        // If the meeting is still running, we want to show the time from start of meeting till now.
        if(isStarted == '1') {
            currentMeetingDuration = (new Date()).getTime() - startingTime;
        }
        else if(isStarted == '2') {
            var endTimeString = localStorage.getItem("endTime");

            var endingTime = parseInt(endTimeString);

            currentMeetingDuration = endingTime - startingTime;
        }

        var SecondsTillBegin = Math.floor(currentMeetingDuration/1000);
        var SecondsString = SecondsTillBegin.toString();
        var TimeTillBegin = SecondsString.toHHMMSS();
        $('#htmlTimer').attr("value", TimeTillBegin );

        var startingTimeString = localStorage.setItem("timeToAdd", currentMeetingDuration );
        //ustawic offset odliczania oraz wystartowac timer
        d = document.getElementById("d-timer");
        dTimer = new Stopwatch(d, { delay: 1000 }, Date.now(currentMeetingDuration));
        dTimer.offset = currentMeetingDuration;

        // Run timer if meeting isn't finished.
        if(isStarted == '1') {
            dTimer.execute();
        }


    }
}


function initStartEndButton() {
    var isStarted = localStorage.started;

    // If the meeting is finished, disable timer button.
    if (isStarted == '2') {
        $('#changeTime').toggleClass('btn-info');
        $('#changeTime').attr('value', 'meeting finshed');
        $('#changeTime').attr('disabled', 'true');
    }

    // If the meeting is still running, we don't need to change button, because it is already done in 
    // dTimer.execute()
}

/**
 * Function gets average vote value from server with specific meeting code and changes progress bar
 * which shows average grade.
 * @param {string} MeetingCode - meeting code generated by server.
 */





/**
 * Function sends request to the server to start or stop specific meeting.
 */
var startAndStop = function(adminCode) {
    var date = new Date();

    var url;
    var key;

    if (typeof(Storage) != "undefined") {
        started = localStorage.getItem("started");
    }

    if (started == "0") {
        url = "http://antivps.pl:3033/meeting/start";
        $.ajax({
            type: "POST",
            url: url,
            data: {
                "adminCode": adminCode,
                "start": date
            },
            processData: true,
            success: function(data) {
                alert(JSON.stringify(data));

                if (typeof(Storage) != "undefined") {
                    localStorage.setItem("started", "1");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error, status: " + textStatus + ", errorThrown: " + errorThrown);
            }
        });
    } else if (started == "1") {
        url = "http://antivps.pl:3033/meeting/end";

        $.ajax({
            type: "POST",
            url: url,
            data: {
                "adminCode": adminCode,
                "end": date
            },
            processData: true,
            success: function(data) {
                alert(JSON.stringify(data));

                if (typeof(Storage) != "undefined") {
                    localStorage.setItem("started", "2");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error, status: " + textStatus + ", errorThrown: " + errorThrown);
            }
        });
    } else {
        alert("Forbidden.");
    }
};