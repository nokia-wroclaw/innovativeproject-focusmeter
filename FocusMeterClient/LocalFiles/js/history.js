// handling view of history (history.html)

function goBackToStartScreen() {
    window.location = './index.html';
}


$(document).ready(function () {

   
    var meetings = ["uno", "duo"];//zamiast tego funkcja ktora zwroci meetings dla danego UUID

    //after clicking at any text button
    $('button[id*="nameButtonElement"]').live('click', function () {
        alert("Welcome again on your previous meeting: " + $(this).attr('data-meetingcode'));


        //17 characters of names in id and last N as index
        var index = this.id.substring(17, this.id.lenght);
        var adminCode = localStorage.getItem('Element[' + index + '].adminCode');
        localStorage.setItem('meetingCodeControl', adminCode);

        localStorage.setItem('meetingCode', $(this).attr('data-meetingcode'));

        window.location = './Charts.html';
    });

    //getMeetingsWithUuid();
    document.addEventListener(
                "ondeviceready",
                getMeetingsWithUuid,
                true);
    
    // var index = 0;
    // $(meetings).each(function () {
    //     InsertMeetingIntoHistory(this, index);
    //     index++;
    // })

   

    $("input[name='nameSearcher'").keyup(function() {

    var query = $(this).val().toLowerCase();
    //selecting all buttons in table
    $(this).parent().parent().find("button[id*='nameButtonElement']").each(function () {
        var elementName = $(this).text();

        if (elementName.toLowerCase().indexOf(query) >= 0) {
            $(this).parent().show();
        } else {
            $(this).parent().hide();
        }
    });
    });

    //after clicking at any text button
    $('button[id*="nameButtonElement"]').click(function () {
        alert("Welcome again on your previous meeting: " + $(this).attr('data-meetingcode'));


        //17 characters of names in id and last N as index
        var index = this.id.substring(17, this.id.lenght);
        var adminCode = localStorage.getItem('Element[' + index + '].adminCode');
        localStorage.setItem('meetingCodeControl', adminCode);

        localStorage.setItem('meetingCode', $(this).attr('data-meetingcode'));

        window.location = './Charts.html';
    });

});

function getMeetingsWithUuid() {
    var device = device || {
        uuid: "1234567890abcdef"
    };

    $.ajax({
        type: "GET",
        url: "http://antivps.pl:3033/meeting/uuid/" + device.uuid,
        success: function(data) {
            var index = 0;
            $(data).each(function () {
                //only the meetings which had been started 
                if (typeof this.start != 'undefined') {
                    InsertMeetingIntoHistory(this, index);
                    index++;
                }
            });
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
};

function InsertMeetingIntoHistory(meeting, index) {
    //dane tylko testowe, decolowo maj� przyj�� w odpowiedzi
    //meetingNames = ["Co w zbozu pisziczy ", "W pustyni i w puszzy"];
    //meetingDates = ["19-01-2014", "01-07-2014", "01-05-2014", "02-05-2014", "03-05-2014", "03-05-2014", "13-05-2014", "01-05-2014", "01-05-2014", "08-05-2014", "04-05-2014" ];
    //meetingCodes = ["9JH1T", "GA18X"];
    //adminCodes = ["DE3ED", "A74H4"];

    var historyContainer = $(".HistoryContent");

    var newSpan = document.createElement("span");
    newSpan.className = "input-prepend meetingElementInHistory";
    newSpan.id = "historyElement" + index;

    $(historyContainer).append(newSpan);

    var meetingNameButton = document.createElement("button");
    meetingNameButton.type = "button";
    meetingNameButton.id = "nameButtonElement" + index;
    meetingNameButton.className = "btn btn-success buttonNameInHistory";
    $(meetingNameButton).text(meeting.title);
    $(meetingNameButton).attr('data-meetingcode', meeting.meetingCode);

    $(newSpan).append(meetingNameButton);

    var meetingDateButton = document.createElement("button");
    meetingDateButton.type = "button";
    meetingDateButton.id = "dateButtonElement" + index;
    meetingDateButton.className = "btn btn-success buttonDateInHistory";

    //glue proper date format
    meetingDate = new Date(meeting.start);
    day = '' + meetingDate.getDate(),
    month = '' + (meetingDate.getMonth() + 1),
    year = meetingDate.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    meetingDate = [day, month, year].join('-');


    $(meetingDateButton).text(meetingDate);

    $(newSpan).append(meetingDateButton);

    localStorage.setItem('Element[' + index + '].adminCode', meeting.adminCode);

}





