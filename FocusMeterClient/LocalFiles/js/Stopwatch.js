

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
  Funkcja start ustawia odpowiednie warto�ci zmiennej offset. Jest ona nast�pnie odejmowana od bie��cej daty, co pozwoli na uzyskanie czasu trwania spoktania. 
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
  Funkcja stop czy�ci zmienne isntancji obiektu Stopwatch oraz modyfikuje wygl�d przycisku ko�cz�cego b�d� zaczynaj�cego spotkanie
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
    Funkcja execute jest wywo�ywana po naci�ni�ciu przycisku rozpoczynaj�cego b�d� ko�cz�cego spotkanie. 
    Jej zadaniem jest zako�czenie b�d� rozpocz�cie pracy stopera aplikacji, jak r�wnie� stosowne do statusu spotkania zmodyfikowanie element�w jego widoku.
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
  Funkcja powi�ksza liczony czas o d�ugo�� od�wie�e� zegara, a nast�pnie wywo�uje funkcj� render (1.2.7.3)

  */
  function update() {
    clock += delta();
    render();
  }
    /*
    funkcja wywo�ywana co sekunde. Odczytuje obecny czas trwania spotkania, przelicza go na sekundy, 
    a wywo�uj�c funkcj� String.toHHMMSS zamienia go na format przyjazny dla u�ytkownika. Zmienna timeToAdd odczytywana 
    z pami�ci urz�dzenia gwarantuje nam, �e informacje o rzeczywistym czasie trwania spotkania zostan� uwzgl�dnione nawet
    po zako�czeniu obecnej sesji oraz zniszczeniu aktualnego obiektu Stopwatch
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
  Funkcja oblicza aktualn� r�nic� czasu dla koljenych od�wie�e� stopera.

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
funkcja operuja na oniektach typu string. Dowolna ilo�� (liczba ca�kowita dodatnia) mo�e by� zamieniona na format czytelny dla oka ludzkiego,
a tak�e akceptowalny przez input typu time obiektu HTML5, czyli czas w postaci HH:MM:SS (np. 10:32:11)
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