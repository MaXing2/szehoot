const socket = io();
var actual = 0;
// var getCookieValue;
var atad;
var helyes = 0;
var osszvalasz;
var globalid;
var teacher = 0;
var point = 0;
var time = 0 ;
var char;
var allpoint = 0;
window.onload = (event) => {
  socket.emit('scode',pincode);
  $(".test-title").text(testname);
  console.log(cname + " - ez a neve");
  console.log(pincode + " - ez a szama");
  console.log(mod + " - ez a jatek modja");
  };

  socket.on('code',ered => {
    console.log(ered);
    pincode=ered;
    kerdesadatok(pincode);
    if (ad != cname){       //tanár teszt vezerlo!!
      vezerlo();
      $('#control_div').hide();
  }else{
      document.getElementById("btn1").disabled = true;
      document.getElementById("btn2").disabled = true;
      document.getElementById("btn3").disabled = true;
      document.getElementById("btn4").disabled = true;
      document.getElementById("btn5").disabled = true;
      document.getElementById("btn6").disabled = true;
      document.getElementById("btn7").disabled = true;
      document.getElementById("btn8").disabled = true;
      document.getElementById("btn9").disabled = true;
      document.getElementById("btn9").style.display = "none";
      $('#control_div').show();
      teacher = 1;
    };
    //wating on start
    if (mod != 1){
      start();
    }
  });

  function start (){
    sqlm();
  }

//kerdesek
function sqlm (){
    socket.emit('sgetter',actual,pincode,mod);
}

socket.on('getter',ered => {
  actual++;
  taskDuration("start")
    show();
    hiv(ered);
});

function hiv (ered) {
    if (typeof ered !== 'undefined') {
        atad = ered;
        var idom = ered[0].time;
        display = document.querySelector('#time');
        clearInterval(globalid);
        startTimer(idom);
        allpoint +=  ered[0].score;
        // startTimer(idom, display);
        starterbutton();
        $("#qnumber_courrent").text((ered[0].question_number+1));
        $("#score").text((ered[0].score)+" pont"); 
        // instance.val(ered[0].question);
        $("#questionText").html(ered[0].question);

        //picture 
        if (ered[0].image==null || ered[0].image==""){
          $("#questionImage").hide();
        }else{
          $("#questionImage").show();
          $("#questionImage").attr("src",ered[0].image);
        }
        $(window).resize();
        console.log("ez a tipusa: "+ered[0].type);
        taskType(ered[0].type);
        if(ered[0].type==0){
          $("#btn1-text").text("Igaz");
          $("#btn2-text").text("Hamis");
        }else{
        $("#btn1-text").text(ered[0].answer_1);
        $("#btn2-text").text(ered[0].answer_2);
        $("#btn3-text").text(ered[0].answer_3);
        $("#btn4-text").text(ered[0].answer_4);
        $("#btn5-text").text(ered[0].answer_1);
        $("#btn6-text").text(ered[0].answer_2);
        $("#btn7-text").text(ered[0].answer_3);
        $("#btn8-text").text(ered[0].answer_4);
        $(window).resize();
      }
    }
}


//Chart
function resChart() {
  socket.emit('sresChart',actual,pincode); 
}

socket.on('resChart',yValues => {
  //chart_data
  if(char)
  {
    char.destroy();
  }
  if (mod == 1){
    // document.getElementById("myChart").style.display = "";
    $('.question-content-group').hide();
    $('.chart-content-group').show();
  }
  var xValues = [];
  xValues.push(atad[0].answer_1)
  xValues.push(atad[0].answer_2)
  if(atad[0].type==13 || atad[0].type==14 || atad[0].type==2){
    xValues.push(atad[0].answer_3)
  }
  if(atad[0].type==14 || atad[0].type==2){
    xValues.push(atad[0].answer_4)
  }

  var parser = atad[0].question;
  for (var i = 0; i <((atad[0].question.match(/]/g)||[]).length)/2; i++){
    parser = parser.replace(/\[(\w+)[^w]*?](.*?)\[\/\1]/g, '$2');
    parser = parser.replace(/\:(.*?)\:/g, "");    //emoji
  }

  //chart_gen
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [{
          // backgroundColor: barColors,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(100, 114, 186, 0.5)',
            'rgba(30, 177, 76, 0.5)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(100, 114, 186)',
            'rgb(30, 177, 76)',
          ],
          borderWidth: 3
        ,
          data: yValues
        }]
      },
      options: {
        //zero
          scales: {
              yAxes: [
                  {
                      ticks: {
                          beginAtZero: true,
                          min: 0,
                          suggestedMin: 0
                      }
                  }
              ],
              yAxes: [
                  {
                      ticks: {
                          beginAtZero: true,
                          min: 0,
                          suggestedMin: 0
                      }
                  }
              ]
          },
        //zero
        legend: {display: false},
        responsive: true,
        title: {
          display: true,
          text: parser
        },
      }
    });
    char=myChart;
});


//adatok_rogzitese
function subm (ertek){
var pond = taskDuration("end");
ertek == 0 ? pond--: pond=pond;
console.log(pond);
console.log(nick);
    socket.emit('rogzit',ertek,pincode,actual,ad,attempt,pond,nick,process_id);   
  };

//score from sever side
socket.on('points',ans => {
  helyes++;
  point += ans; 
  if (actual == osszvalasz){
    //if you change need to change in valaszolt()
   $("#result_percent").text(Math.round((point/allpoint)*100.0)+"%");          //%
   $("#result_score").text((point)+"/"+(allpoint));                    //pont
   // $("#result_rating").text("alma");                                        Osztályzat beállítás (Jeles)
  }
  // document.getElementById('correct').innerHTML = "A jó válaszok száma: " + helyes;
  // document.getElementById('end').innerHTML = "Elert pontszám: " + point;
});


//kerdesadatok
function kerdesadatok(kod){
    socket.emit('stablakerdes', kod);
    socket.on('tablakerdes', (ered, onliNum)  => {
        osszvalasz= ered[0].question_num;
        $("#qnumber_count").text(osszvalasz);
        console.log(osszvalasz);
        console.log(onliNum);
        $("#users_count").text(onliNum); 
    });
};

//online user counter
socket.on('online', (onliNum)  => {
  console.log("data is coming");
  console.log(onliNum);
  $("#users_count").text(onliNum);
});


//control_hide
function vezerlo() {
  $('#controlbar').hide();
  }

  function valaszolt(){
    if (mod != 1){ //mod for auto next
      if (actual < osszvalasz)
      sqlm();
    }else {
    if (ad != cname) {
      $('.answer-content-group').hide(); 
    }  
  }
  if (actual == osszvalasz){
    console.log("vége"); //finised test
    showResult();
    console.log(allpoint);
    //if you change need to change in score from sever side
    $("#result_percent").text(Math.round((point/allpoint)*100.0)+"%");          //%
    $("#result_score").text((point)+"/"+(allpoint));                            //pont
    // $("#result_rating").text("alma");                                        Osztályzat beállítás (Jeles)
    console.log(point);
    }
  }
   
  function show(){
    //megjelenítés
    $("#lobby").hide();
    $("#test").show();
    $('.answer-content-group').show();
    $('.question-content-group').show();
    $('.chart-content-group').hide();
    $(window).resize();
  }

//show all button in start
  function starterbutton(){
    $('.chart-content-group').hide();
    document.getElementById("btn1").style.display = "";
    document.getElementById("btn2").style.display = "";
    document.getElementById("btn3").style.display = "";
    document.getElementById("btn4").style.display = "";
    // document.getElementById("tipp").style.display = "none";
    // document.getElementById("check").style.display = "none";
  }

//button
document.getElementById("btn1").onclick = function doSub () { 
    subm(1);
    valaszolt();
    clearInterval(globalid);
};

document.getElementById("btn2").onclick = function doSub () { 
    subm(2);
    valaszolt();
    clearInterval(globalid);
};

document.getElementById("btn3").onclick = function doSub () { 
    subm(3);
    valaszolt();
    clearInterval(globalid);
};

document.getElementById("btn4").onclick = function doSub () { 
    subm(4);
    valaszolt();
    clearInterval(globalid);
};

document.getElementById("btn9").onclick = function doSub () { 
  var fuz = 0;
  if($("#btn5").hasClass('btn-choosed')){
    fuz = fuz + 1;
  };
  if($("#btn6").hasClass('btn-choosed')){
    fuz = fuz* 10 + 2;
  };
  if($("#btn7").hasClass('btn-choosed')){
    fuz = fuz * 10 + 3;
  };
  if($("#btn8").hasClass('btn-choosed')){
    fuz = fuz * 10 + 4;
  };
  console.log(fuz);
  subm(fuz);
  valaszolt();
  clearInterval(globalid);
};

//vezerlo_gombok
document.getElementById("back").onclick = function back () { 
    if (actual != 1){
        actual--;
        actual--;
        sqlm(); 
    }
    //subm(0);    
};

document.getElementById("next").onclick = function next () { 
    if (actual < osszvalasz){
      sqlm();
    }else{
      valaszolt()
    }
     //subm(0);       
};