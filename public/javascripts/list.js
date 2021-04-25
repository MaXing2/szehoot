var bar=0;
var data;
var elem;
window.onload = (event) => {

}

function doAjax(testSzoveg) {
  alldel();
    testSzoveg = document.getElementById("tippem").value;
    $.ajax({
        type: "POST",
        url: 'list',
        data: {"asd": testSzoveg},
        success: function (response, error) {
            console.log(response);
            // $("#tablak").text(response[0].kerdes); 
            data=response;
            $("#tabla_szam").text(data[0].idtest);
            for (i = 0; i <data[0].idtest ; i++) {
                switch(data[i].type) {
                    case 1:
                        add("Tipp mix");
                      break;
                      case 2:
                        add("Igaz / hamis");
                      break;
                      case 3:
                        add("Felelet választós 3 lehetőség");
                      break;
                      case 4:
                        add("Felelet választós 4 lehetőség");
                      break;
                      case 5:
                        add("Több jó válasz");
                      break;

                }
            }
        },
        dataType: "json"
      });
  }

  function doadd() {
    add("Új kérdés");
  }

  function dodel(){
        var list = document.getElementById("Bar");
        if (list.hasChildNodes()) {
          list.removeChild(list.childNodes[bar-1]);
          --bar;
        }
      }

  function add(type) {
    //Create item dynamically.   
    var element = document.createElement("div");
    element.type = type;
    element.innerHTML = type;
    element.name = bar; 
    element.id = "myDIV";
    element.onclick = function() { 
        console.log(element.name);
        elem=element.name;
        dofunc(element.name);
    };

    var foo = document.getElementById("Bar");
    foo.appendChild(element);
    bar++;
  }

function alldel(){
  var list = document.getElementById("Bar");
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
    --bar;
  };
}

function dosave (){
  //console.log(elem+"mentem");
  var tomb =[];
  tomb [0] = document.getElementById("elem").value;
  tomb [1] = document.getElementById("BT1").value;
  tomb [2] = document.getElementById("BT2").value;
  tomb [3] = document.getElementById("BT3").value;
  tomb [4] = document.getElementById("BT4").value;
  tomb [5] = elem+1;
  tomb [6] = document.getElementById("tippem").value;
  tomb [7] = document.getElementById("timeset").value;
  tomb [8] = document.getElementById("points").value;
  tomb [9] = document.getElementById("type").value;

  //valaszment
  var fuz = 0;
  if(document.getElementById("box1").checked){
    fuz = fuz + 1;
  };
  if(document.getElementById("box2").checked){
    fuz = fuz* 10 + 2;
  };
  if(document.getElementById("box3").checked){
    fuz = fuz * 10 + 3;
  };
  if(document.getElementById("box4").checked){
    fuz = fuz * 10 + 4;
  };
  
  tomb[10] = fuz;

  console.log(JSON.stringify(tomb));
  $.ajax({
      type: "POST",
      url: 'save',
      data:  {"ment": JSON.stringify(tomb)},
      dataType: "json",
      success: function (response, error) {
          // console.log(response);
          // $("#tablak").text(response[0].kerdes); 
          // data=response;
          // $("#tabla_szam").text(response);
          doAjax();
      },
      dataType: "json"
    });
}

//kepment
function preventszar(ev) {
  ev.preventDefault();
}

function dropped(ev) {
  var uploadField = document.getElementById("fileUploadField");
  uploadField.files = ev.dataTransfer.files;
  $("#uploadForm").submit();
  ev.preventDefault();
}

//torol kerdes
function dotrol() {
  var tomb=[];
  tomb[0] =  document.getElementById("tippem").value;
  tomb[1] = elem+1;
  $.ajax({
    type: "POST",
    url: 'delet',
    data:  {"del": JSON.stringify(tomb)},
    success: function (response, error) {
        doAjax();
    },
    dataType: "json"
  });

}


function dofunc(szam){
    console.log(szam);
  if(szam>=data[0].idtest){
      document.getElementById('elem').value = "";
      document.getElementById('BT1').value = "";
      document.getElementById('BT2').value = "";
      document.getElementById('BT3').value = "";
      document.getElementById('BT4').value = "";
      document.getElementById('box1').checked = false;
      document.getElementById('box2').checked = false;
      document.getElementById('box3').checked = false;
      document.getElementById('box4').checked = false;
  }else{
      document.getElementById('elem').value = data[szam].question;
      document.getElementById('BT1').value = data[szam].answer_1;
      document.getElementById('BT2').value = data[szam].answer_2;
      document.getElementById('BT3').value = data[szam].answer_3;
      document.getElementById('BT4').value = data[szam].answer_4;
      document.getElementById('timeset').value = data[szam].time;
      document.getElementById('points').value = data[szam].score;
      document.getElementById('type').value = data[szam].type;
      document.getElementById('box1').checked = false;
      document.getElementById('box2').checked = false;
      document.getElementById('box3').checked = false;
      document.getElementById('box4').checked = false;

      // if () for correct answer
      switch(data[szam].type) {
        case 1:
            console.log("Tipp mix");
          break;
          case 2:
          case 3:
          case 4:
            switch (data[szam].correct_answer_no){
              case 1:
                document.getElementById('box1').checked = true;
              break;
              case 2:
                document.getElementById('box2').checked = true;
                break;
              case 3:
                document.getElementById('box3').checked = true;
                break;
              case 4:
                document.getElementById('box4').checked = true;
                break;
           }
          break;
          case 5:
              if ((data[szam].correct_answer_no).toString().includes("1")){
                document.getElementById('box1').checked = true;
              }
              if ((data[szam].correct_answer_no).toString().includes("2")){
                document.getElementById('box2').checked = true;
              }
              if ((data[szam].correct_answer_no).toString().includes("3")){
                document.getElementById('box3').checked = true;
              }
              if ((data[szam].correct_answer_no).toString().includes("4")){
                document.getElementById('box4').checked = true;
              }
          break;
    }

  if (data[szam].image==null || data[szam].image==""){
      // document.getElementById("kep").style.display = "none";
      document.getElementById('dnd').innerHTML = "";
    }else{
      document.getElementById("dnd").style.display = "";
      document.getElementById('dnd').innerHTML = "<img style='height: 100%; width: 100%; object-fit: contain' src='" + data[szam].image + "'/>";
    }
  }
}