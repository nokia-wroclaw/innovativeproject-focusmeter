//google charts..
google.load("visualization", "1", {
    packages: ["corechart"]
});
google.setOnLoadCallback(drawHist);

function drawHist() {
    var data = google.visualization.arrayToDataTable([
        ['Element', 'Votes', {
            role: 'style'
        }],
        ['Disaster', 8, 'color: #E0553B'],
        ['Boring', 10, 'color: #E58955'],
        ['OK', 5, 'color: #27B0F4'],
        ['Great', 7, 'color: #458BF6'],
        ['Awesome', 9, 'color: #0FC085'],
    ]);

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

var MeetingCode;
var adminCode;
var started;

function goBackToStartScreen() {
    window.location = './index.html';
}

$(document).ready(function() {


    $(function() {
        startRefresh();
    });



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

    function startRefresh() {
        setTimeout(startRefresh, 30000);
        getVotes(MeetingCode);
    };

    // getVotes(MeetingCode);

    // setTimeout(getVotes(MeetingCode), 10000);

    $("#changeTime").click(startAndStop);
});


/**
 * Function gets average vote value from server with specific meeting code and changes progress bar
 * which shows average grade.
 * @param {string} MeetingCode - meeting code generated by server.
 */

function getVotes(MeetingCode) {
    $.ajax({
        type: "GET",
        url: "http://antivps.pl:3033/vote/" + MeetingCode,
        success: function(data) {
            var gradePercent = ((data.value + 2) / 4) * 100;
            //$(".progressbar-value").css("height", tmp + "px");
            //$(".progressbar-value").css("top", (210-tmp) + "px");
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

        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error, status: " + textStatus + ", errorThrown: " + errorThrown);
        }
    });
};

/**
 * Function sends request to the server to start or stop specific meeting.
 */
var startAndStop = function() {
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