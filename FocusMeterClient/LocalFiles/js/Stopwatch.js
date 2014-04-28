

var Stopwatch = function(elem, options) {
  
  var timer       = createTimer(),
      //startButton = createButton("start", start),
      //stopButton  = createButton("stop", stop),
      resetButton = createButton("reset", reset),
      offset,
      clock,
      interval,
      isRunning = false;
  
  // default options
  options = options || {};
  options.delay = options.delay || 1;
 
  
  elem.appendChild(resetButton);
  
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
      offset   = Date.now();
      interval = setInterval(update, options.delay);
      isRunning = true;
    }
  }
  
  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
      isRunning = false;
    }
  }
  
  function execute(){
	  if(isRunning){
		  this.stop();
		  //changing style and text of button
		  $('#changeTime').toggleClass('btn-success');
		  $('#changeTime').toggleClass('btn-danger');
		  
		  $('#changeTime').attr('value', 'start meeting');
		  
	  }
	  else {
		  this.start();
		  
		  $('#changeTime').toggleClass('btn-danger');
		  $('#changeTime').toggleClass('btn-success');
		  
		  $('#changeTime').attr('value', 'end meeting');
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
    timer.innerHTML = clock/1000; 
    //w formacie ilosci sekund
    var SecondsTillBegin = Math.floor(clock/1000);
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
dTimer = new Stopwatch(d, { delay: 1000 });
//dTimer.start();

//$('#startTime').click(function () {
//    dTimer.start()
//});

//$('#stopTime').click(function () {
//    dTimer.stop()
//});