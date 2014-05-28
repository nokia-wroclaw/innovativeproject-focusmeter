// handling view of history (history.html)

function goBackToStartScreen() {
    window.location = './index.html';
}


$(document).ready(function () {

   
    var meetings = ["uno", "duo"];//zamiast tego funkcja ktora zwroci meetings dla danego UUID

    var index = 0;
    $(meetings).each(function () {
        InsertMeetingIntoHistory(this, index);
        index++;
    })

    //after clicking at any text button
    $('button[id*="nameButtonElement"]').click(function () {
        alert("meeting code do przeslania na serwer to: " + $(this).attr('data-meetingcode'));
    });

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

});

function InsertMeetingIntoHistory(meeting, index) {
    //dane tylko testowe, decolowo maj¹ przyjœæ w odpowiedzi
    meetingNames = ["Co w zbozu pisziczy ", "W pustyni i w puszzy"];
    meetingDates = ["19-01-2013", "01-07-2014"];
    meetingCodes = ["KUKU7", "BULWA"];

    var historyContainer = $(".HistoryContent");

    var newSpan = document.createElement("span");
    newSpan.className = "input-prepend meetingElementInHistory";
    newSpan.id = "historyElement" + index;

    $(historyContainer).append(newSpan);

    var meetingNameButton = document.createElement("button");
    meetingNameButton.type = "button";
    meetingNameButton.id = "nameButtonElement" + index;
    meetingNameButton.className = "btn btn-success buttonNameInHistory";
    $(meetingNameButton).text(meetingNames[index]);
    $(meetingNameButton).attr('data-meetingcode', meetingCodes[index]);

    $(newSpan).append(meetingNameButton);

    var meetingDateButton = document.createElement("button");
    meetingDateButton.type = "button";
    meetingDateButton.id = "dateButtonElement" + index;
    meetingDateButton.className = "btn btn-success buttonDateInHistory";
    $(meetingDateButton).text(meetingDates[index]);

    $(newSpan).append(meetingDateButton);

}



