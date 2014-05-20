var histData = null;
var graphData = [];

// google charts..
google.load("visualization", "1", {
    packages: ["corechart"]
});
google.setOnLoadCallback(redrawCharts);


/*
Przejœcie do widoku Charts, bêd¹cego panalem widocznym tylko dla prowadz¹cego spotkanie powoduje wyzwolenie funckcji ‘$(document).ready’. 
Wywo³ywana jest  w niej funkcja initTimer() (1.2.2), a nastêpnie initStartEndButton() (1.2.3). Do obecnego widoku mo¿emy 
dostaæ siê tylko loguj¹c siê na odpowiednie spotkanie w widoku JoinMeeting. Uzupe³nia ona pamiêæ LocalStorage urz¹dzenia
o pola meetingCode oraz adminCode, które s¹ przypisywane zmiennym.
Widoczne dla u¿ytkownika pola code- informuj¹ce o kodzie bie¿¹cego spotkania oraz adminCode zostaj¹ 
uzupe³nione o odpowiednio sformatowany tekst ze zmeinnych meetinfCode oraz adminCode. 
Wywo³ana zostaje funkcja getVotes (1.2.4), która w argumencie przyjmuje kod spotkania, a tak¿e funkcje 
setInterval (1.2.6) oraz StartAndStop (1.2.6) w wypadku klikniêcia przycisku odpowiadaj¹cego za rozpoczêcia lub zakoñczenie spotkania.

*/

$(document).ready(function() {

    var meetingCode;
    var adminCode;
    var started;

    initTimer();

    initStartEndButton();

    if (typeof(Storage) != "undefined") {
        meetingCode = localStorage.getItem("meetingCode");
        adminCode = localStorage.getItem("meetingCodeControl");
    } else {
        meetingCode = "dupa";
    }

    $("#code_1").val(meetingCode.charAt(0));
    $("#code_2").val(meetingCode.charAt(1));
    $("#code_3").val(meetingCode.charAt(2));
    $("#code_4").val(meetingCode.charAt(3));
    $("#code_5").val(meetingCode.charAt(4));

    $("#adminCode_1").val(adminCode.charAt(0));
    $("#adminCode_2").val(adminCode.charAt(1));
    $("#adminCode_3").val(adminCode.charAt(2));
    $("#adminCode_4").val(adminCode.charAt(3));
    $("#adminCode_5").val(adminCode.charAt(4));

    drawHistogram();
    drawGraph();

    getVotes(meetingCode);
    getAverages(meetingCode);


    setInterval(function(){
        getVotes(meetingCode)
    }, 10000);

    setInterval(function(){
        getAverages(meetingCode)
    }, 60000);

    

    $("#changeTime").click(function() {startAndStop(adminCode)});

    // Redraw charts on tab click or resize
    $('#myTab a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
    }).on('shown.bs.tab', redrawCharts);
    $(window).resize(redrawCharts);

});


function redrawCharts() {
	if (histData !== null) {
        drawHistogram();
	}
	if (graphData !== null) {
		drawGraph();
	}
}

/**
 * Funkcja wysyłająca do serwera zapytanie o informację o głosach spotkania o zadanym w parametrze kodzie spotkania.
 * Pobiera z serwera informację o aktualnej średniej głosów, a także o dokładnym rozłożeniu głosów. Otrzymane dane są później
 * przekazywane do funkcji rysujących wykresy.
 * @param meetingCode - kod spotkania, którego głosy chcemy dostać z serwera
 */
function getVotes(meetingCode) {
    var isStarted = localStorage.getItem("started");

    if(isStarted == "1") {
        $.ajax({
            type: "GET",
            url: "http://antivps.pl:3033/vote/average/" + meetingCode,
            success: function(data) {
                refreshProgressBar(data.value);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error, status: " + textStatus + ", errorThrown: " + errorThrown);
            }
        });

        $.ajax({
            type: "GET",
            url: "http://antivps.pl:3033/vote/" + meetingCode,
            success: function(data) {
            	histData = data;
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
    }
};

/**
 * Funkcja pobierająca z serwera dane o średniej głosów z danego spotkania z ostatnich 10 minut.
 * Dane te są przekazywane do funkcji rysującej wykres liniowy.
 * @param meetingCode - kod spotkania
 */
function getAverages(meetingCode) {
    var isStarted = localStorage.getItem("started");

    if(isStarted == "1") {
        $.ajax({
            type: "GET",
            url: "http://antivps.pl:3033/lav/" + meetingCode,
            success: function(data) {
                graphData = data;
                drawGraph(data);
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
    }
};

/**
Funkcja przyjmuj¹c w argumencie aktualn¹ ocenê spotkania (liczba rzeczywista z zakresu -2 do 2), przelicza j¹ na wartoœæ procentow¹.
W oparciu o obliczon¹ wartoœæ uzupe³nia wskaŸnik jakoœci spotkania- progressBar, definiuj¹c jego rozmiar oraz nadaj¹c mu odpowiedni kolor
*/

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

/**
 * Funkcja rysująca histogram na podstawie otrzymanych z serwera danych.
 * @param data - obiekt JSON zawierający dokładną informację o głosach
 */ 
function drawHistogram(data) {

    if(histData == null) {
        histData = {
            "awesome" : 0,
            "great" : 0,
            "ok" : 0,
            "boring" : 0,
            "disaster" :0
        }
    }
	// Take data from current or previous response
	data = data || histData;

    var formatedData = google.visualization.arrayToDataTable(
        convertJsonToGoogleFormat(data));

    var options = {
        title: "Histogram",
        width: "100%",
        height: "100%",
        bar: {
            groupWidth: "85%"
        },
        chartArea: {
            width: "80%",
            height: "70%"
        },
        legend: {
            position: "none"
        },
        hAxis: {
            title: "Grade name"
        },
        vAxis: {
            title: "Number of votes"
        },
        dataOpacity: 0.9,
    };

    var chartDiv = document.getElementById('hist_div');

    var chart = new google.visualization.ColumnChart(chartDiv);

    chart.draw(formatedData, options);
}


/**
 * Funkcja konwertująca obiekt JSON otrzymany z serwera na tablicę
 * wymaganą do narysowania wykresu przez Google Chart API.
 * @param votesData - obiekt z informacją o głosach
 * @return skonwertowana tablica.
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

/**
 * Funkcja rysująca wykres liniowy na podstawie otrzymanych z serwera danych.
 * @param data - tablica obiektów JSON zawierająca informację o średniej głosów z ostatnich 10 min.
 */
function drawGraph(data) {

    if(graphData.length === 0) {
        graphData = [
        {
            "average" : 0,
            "time" : 0
        }];
    }
	// Take data from current or previous response
	data = data || graphData;

    var formatedData = google.visualization.arrayToDataTable(
        convertJsonArrayToGoogleFormat(data));

    var options = {
    title: 'Graph',
    curveType: 'none',
    legend: { position: 'none' },
    vAxis: {
        minValue: -2,
        maxValue: 2,
        title: "Average",
        ticks: [
            {v: -2, f:"Disaster"}, 
            {v: -1, f:"Boring"},
            {v: 0, f:"OK"},
            {v: 1, f:"Great"},
            {v: 2, f:"Awesome"}
        ]
    },
    hAxis: {
        title: "Minutes from the begining"
    },
    // chartArea: {
    //         width: "80%",
    //         height: "70%"
    //     },
    dataOpacity: 0.9,
  };

    var chart = new google.visualization.LineChart(document.getElementById('graph_div'));
    chart.draw(formatedData, options);
}

/**
 * Funkcja konwertująca tablicę obiektów JSON na tablicę wymaganą przez Google Charts API.
 * @param votesArray - tablica zawierająca dane o średniej głosów.
 */
function convertJsonArrayToGoogleFormat(votesArray) {
    var resultArray = [["Time from begining", "Average"]];

    for (var i = 0; i < votesArray.length; i++) {
        resultArray.push([votesArray[i].time, votesArray[i].average]);
    }

    return resultArray;
}


function goBackToStartScreen() {
    window.location = './index.html';
}

/*
Funkcja odpowiada za poprawne wyœwietlenie wartoœci na stoperze spotkania, jak równie¿ dba o ustawienie przycisku rozpoczynaj¹cego
lub koñcz¹cego spotkanie w odpowiedni stan. Jest wywo³ywana za ka¿dym razem, gdy u¿ytkownik zaloguje sie na spotkanie - obejmuje to
równie¿ przypadek, gdy urz¹dzenie prowadz¹cego zostanie odblokwane. Funkcja musi dzia³aæ poprawnie uwzglêdniaj¹c ostatni rzeczywisty 
stan spotkania. W oparciu o aktualny stan spotkania, zapamiêtany w pamiêci urz¹dzenia czas startu spotkania oraz czas bie¿¹cy, pola widoku s¹ odpowiednio konfigurowane.
Kolejna czêœæ funkcji odpowiada za poprawne wystartowanie stopera. W oparciu o czas trwania odbywaj¹cego siê spotkania uzupe³niane jest 
pole timeToAdd pamiêci urz¹dzenia. Zmienna ta zostanie dodawana za ka¿dym razem do czasu pokazywanego na stoperze. Tworzony zostaje nowy 
obiekt Stopwatch (1.2.7) z odstêpem czasu aktualizacji zegara co 1 sekundê oraz czasem trwania spotkania. Gdy status spotkania jest równy 1,
znaczy to, ¿e spotkanie trwa. Musimy wiêc wystartowaæ stoper korzystaj¹c z funkcji obiektu Stopwatch execute (1.2.7.1)

*/
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
/*
Funkcja ma za zadanie wype³nienia odpowiedni¹ zawartoœci¹ przycisku koñcz¹cego lub zaczynaj¹cego spotkanie, w wypadku jego zakoñczenia.
*/
function initStartEndButton() {
    var isStarted = localStorage.started;

    // If the meeting is finished, disable timer button.
    if (isStarted == '2') {
        $('#changeTime').toggleClass('btn-info');
        $('#changeTime').attr('value', 'Meeting finshed');
        $('#changeTime').attr('disabled', 'true');
    }

    // If the meeting is still running, we don't need to change button, because it is already done in 
    // dTimer.execute()
}

/**
 * Funkcja wysyłająca do serwera zapytanie o wystartowanie lub zatrzymanie danego spotkania.
 * @param adminCode - kod admina spotkania
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
                alert(data.message);

                if (typeof(Storage) != "undefined") {
                    localStorage.setItem("started", "1");
                    localStorage.setItem("startTime", date.getTime().toString());
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
                alert(data.message);

                if (typeof(Storage) != "undefined") {
                    localStorage.setItem("started", "2");
                    localStorage.setItem("endTime", date.getTime().toString());
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