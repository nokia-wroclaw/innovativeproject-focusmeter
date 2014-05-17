

var Stopwatch = function(elem, options, startTime) {
  
  var timer       = createTimer(),
      //startButton = createButton("start", start),
      //stopButton  = createButton("stop", stop),
      //resetButton = createButton("reset", reset),
      offset,
      startTime,
      clock,
      interval,
      isRunning = false;
  
  // default options
  options = options || {};
  options.delay = options.delay || 1;
 
  
  //elem.appendChild(resetButton);
  
  // initialize
  reset();
  
  // private functions
  function createTimer() {
    return document.createElement("span");
  }
  
  function createButton(action, handler) {
    var a = document.createElement("a");
    a.href = "#" + action;
    a.innerHTML = action;
    a.addEventListener("click", function(event) {
      handler();
      event.preventDefault();
    });
    return a;
  }
  
  function start() {
    if (!interval) {
      if(typeof offset == 'undefined'){
        offset = Date.now();
        _startTime = 0;
      } 
      
      else{
        offset   = Date.now(startTime);
        _startTime = startTime;
      } 
      
      interval = setInterval(update, options.delay);
      isRunning = true;

      //saving time of meeting for the first time only
      // if(localStorage.started == '0'){
      //      localStorage.setItem("startTime", (new Date()).getTime().toString());
      // }
    }
  }
  
  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
      isRunning = false;


      $('#changeTime').toggleClass('btn-danger');
      $('#changeTime').toggleClass('btn-info');
      $('#changeTime').attr('value', 'Meeting finshed');
      $('#changeTime').attr('disabled', 'true');

    }
  }
  
  function execute(){
    if(isRunning){
      this.stop();
      //changing style and text of button
     
      
    }
    else {
      

      if(localStorage.started == '2')
      {

      $('#changeTime').toggleClass('btn-success');
      $('#changeTime').toggleClass('btn-info');
      $('#changeTime').attr('value', 'Meeting finshed');
      $('#changeTime').attr('disabled', 'true');

      }
      else
      {
        this.start();
      $('#changeTime').toggleClass('btn-danger');
      $('#changeTime').toggleClass('btn-success');
      
      $('#changeTime').attr('value', 'End meeting');
      }
      


      //localStorage.setItem("startingTime", (new Date()).getTime().toString());
    }
  }
  
  
  function reset() {
    clock = 0;
    render(0);
  }
  
  function update() {
    clock += delta();
    render();
  }
  
  function render() {
    
    //w formacie ilosci sekund
    //
    if(localStorage.getItem("timeToAdd") != null && localStorage.getItem("timeToAdd") != '0'){
    var secondsToAdd = localStorage.getItem("timeToAdd");

   //secondsToAdd = Date.now(secondsToAdd) - Date.now();
    var SecondsTillBegin = Math.floor((clock + parseInt(secondsToAdd)) / 1000);
    }
    else{
    var SecondsTillBegin = Math.floor(clock / 1000);
    }
    var SecondsString = SecondsTillBegin.toString();
    var TimeTillBegin = SecondsString.toHHMMSS();
    $('#htmlTimer').attr("value", TimeTillBegin );
  }
  
  function delta() {
    var now = Date.now(),
        d   = now - offset;
    
    offset = now;
    return d;
  }
  
  // public API
  this.start  = start;
  this.stop   = stop;
  this.reset  = reset;
  this.execute = execute;
};

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}


d = document.getElementById("d-timer");
dTimer = new Stopwatch(d, { delay: 1000 }, Date.now());
//dTimer.start();

//$('#startTime').click(function () {
//    dTimer.start()
//});

//$('#stopTime').click(function () {
//    dTimer.stop()
//});