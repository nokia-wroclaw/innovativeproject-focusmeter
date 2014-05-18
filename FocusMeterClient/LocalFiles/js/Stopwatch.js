

var Stopwatch = function(elem, options, startTime) {
  
  var timer       = createTimer(),
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
    /*
  Funkcja start ustawia odpowiednie wartoœci zmiennej offset. Jest ona nastêpnie odejmowana od bie¿¹cej daty, co pozwoli na uzyskanie czasu trwania spoktania. 
  */
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

    }
  }
    /*
  Funkcja stop czyœci zmienne isntancji obiektu Stopwatch oraz modyfikuje wygl¹d przycisku koñcz¹cego b¹dŸ zaczynaj¹cego spotkanie
  */
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

    /*
    Funkcja execute jest wywo³ywana po naciœniêciu przycisku rozpoczynaj¹cego b¹dŸ koñcz¹cego spotkanie. 
    Jej zadaniem jest zakoñczenie b¹dŸ rozpocz¹cie pracy stopera aplikacji, jak równie¿ stosowne do statusu spotkania zmodyfikowanie elementów jego widoku.
    */
  function execute(){
    if(isRunning){
      this.stop();
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
    /*
  Funkcja powiêksza liczony czas o d³ugoœæ odœwie¿eñ zegara, a nastêpnie wywo³uje funkcjê render (1.2.7.3)

  */
  function update() {
    clock += delta();
    render();
  }
    /*
    funkcja wywo³ywana co sekunde. Odczytuje obecny czas trwania spotkania, przelicza go na sekundy, 
    a wywo³uj¹c funkcjê String.toHHMMSS zamienia go na format przyjazny dla u¿ytkownika. Zmienna timeToAdd odczytywana 
    z pamiêci urz¹dzenia gwarantuje nam, ¿e informacje o rzeczywistym czasie trwania spotkania zostan¹ uwzglêdnione nawet
    po zakoñczeniu obecnej sesji oraz zniszczeniu aktualnego obiektu Stopwatch
    */
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
    /*
  Funkcja oblicza aktualn¹ ró¿nicê czasu dla koljenych odœwie¿eñ stopera.

  */
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

/*
funkcja operuja na oniektach typu string. Dowolna iloœæ (liczba ca³kowita dodatnia) mo¿e byæ zamieniona na format czytelny dla oka ludzkiego,
a tak¿e akceptowalny przez input typu time obiektu HTML5, czyli czas w postaci HH:MM:SS (np. 10:32:11)
*/

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