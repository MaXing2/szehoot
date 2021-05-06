var bar=0;
var data;
var elem;
window.onload = (event) => {

}

function doAjax(testSzoveg) {
  alldel();
    testSzoveg = document.getElementById("tippem").value;
    return $.ajax({
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


// felugro valasztas
  $("#BT5").click(function(e) {
    $("#popUpDiv").show();
});

$("#popupSelect").change(function(e) {
  console.log(($("#popupSelect").val()));
  document.getElementById("type").value = ($("#popupSelect").val());
    $("#baseDiv").html($("#popupSelect").val() + ' clicked. Click again to change.');
    $("#popUpDiv").hide();
});

//hozza ad
  function doadd() {
    add("Új kérdés");
    rest();
    elem = bar-1;
    dosave();
    --elem;
    dofunc(elem);
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
  if (document.getElementById("kepurl").value != "URL"){
    tomb [11] = document.getElementById("kepurl").value;
  }else{
    tomb [11] = "";
  }

  //valaszment
  var fuz = 0;
  if( tomb [9] != 1 ){
    if(document.getElementById("box1").checked || document.getElementById("r1").checked ){
      fuz = fuz + 1;
    };
    if(document.getElementById("box2").checked || document.getElementById("r2").checked){
      fuz = fuz* 10 + 2;
    };
    if(document.getElementById("box3").checked || document.getElementById("r3").checked){
      fuz = fuz * 10 + 3;
    };
    if(document.getElementById("box4").checked || document.getElementById("r4").checked){
      fuz = fuz * 10 + 4;
    };
    tomb[10] = fuz;
  }else{
    if (document.getElementById("megold").value =="") {
      tomb[10] = 0;
    } else {
      tomb[10] = document.getElementById("megold").value;
    }
  }
  

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
          doAjax().then(function() {
            dofunc(elem);
          });
      },
      dataType: "json"
    });
}

$("#dnd").click(function(e) {
  $("#fileUploadField").trigger('click');
});

$("#fileUploadField").on('change', function () {
  var formdata = new FormData($('#uploadForm')[0]);
  formdata.append('tippem', $("#tippem").val());
  formdata.append('elem', elem+1);

  $.ajax({
    url:'/upload',
    type: 'POST',
    contentType: false,
    processData: false,
    cache: false,
    data: formdata,
    success: function(res){
        alert(res);
        doAjax().then(function() {
          dofunc(elem);
        });
    },
    error: function(){
        alert('Error: In sending the request!');
    }
  })
  //dofunc(elem);
  //$("#uploadForm").submit();
})

$("#kepurl").click(function() {
  if ($("#kepurl").val()=="URL"){
    document.getElementById("kepurl").value="";
  }
});

//kepment
function preventszar(ev) {
  ev.preventDefault();
  doAjax();
}

function dropped(ev) {
  var uploadField = document.getElementById("fileUploadField");
  uploadField.files = ev.dataTransfer.files;
  //$("#uploadForm").submit();
  var formdata = new FormData($('#uploadForm')[0]);
  formdata.append('tippem', $("#tippem").val());
  formdata.append('elem', elem+1);

  //useless?!
  for (var pair of formdata.entries()) {
    console.log(pair[0]+ ', ' + pair[1]); 
  }

  $.ajax({
    url:'/upload',
    type: 'POST',
    contentType: false,
    processData: false,
    cache: false,
    data: formdata,
    success: function(res){
        alert(res);
        doAjax().then(function() {
          dofunc(elem);
        });
    },
    error: function(){
        alert('Error: In sending the request!');
    }
})

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
      doAjax().then(function() {
        dofunc(elem-1);
      });
    },
    dataType: "json"
  });

}


//inputvalide
function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}

setInputFilter(document.getElementById("tippem"), function(value) {
  return /^-?\d*$/.test(value); 
});

setInputFilter(document.getElementById("megold"), function(value) {
  return /^-?\d*$/.test(value); 
});


function rest(){
  document.getElementById('elem').value = "";
  document.getElementById('BT1').value = "";
  document.getElementById('BT2').value = "";
  document.getElementById('BT3').value = "";
  document.getElementById('BT4').value = "";
  document.getElementById('megold').value = "";
  document.getElementById('box1').checked = false;
  document.getElementById('box2').checked = false;
  document.getElementById('box3').checked = false;
  document.getElementById('box4').checked = false;
  document.getElementById("r1").checked = false;
  document.getElementById("r2").checked = false;
  document.getElementById("r3").checked = false;
  document.getElementById("r4").checked = false;
  document.getElementById('kepurl').value = "URL";
}


function dofunc(szam){
    document.getElementById("BT1").style.display = "";
    document.getElementById("BT2").style.display = "";
    document.getElementById("BT3").style.display = "";
    document.getElementById("BT4").style.display = "";
  if(szam>=data[0].idtest){
      rest();
  }else{
      document.getElementById('elem').value = data[szam].question;
      document.getElementById('BT1').value = data[szam].answer_1;
      document.getElementById('megold').value = data[szam].correct_answer_no;
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
        case 1: //tippmix
            document.getElementById("megold").style.display = "";
            document.getElementById("r1").style.display = "none";
            document.getElementById("r2").style.display = "none";
            document.getElementById("r3").style.display = "none";
            document.getElementById("r4").style.display = "none";

            document.getElementById("box1").style.display = "none";
            document.getElementById("box2").style.display = "none";
            document.getElementById("box3").style.display = "none";
            document.getElementById("box4").style.display = "none";

            document.getElementById("BT1").style.display = "none";
            document.getElementById("BT2").style.display = "none";
            document.getElementById("BT3").style.display = "none";
            document.getElementById("BT4").style.display = "none";
          break;
          case 2:
            document.getElementById("BT3").style.display = "none";
          case 3:
            document.getElementById("BT4").style.display = "none";
          case 4:
            document.getElementById("r1").style.display = "";
            document.getElementById("r2").style.display = "";
            document.getElementById("r3").style.display = "";
            document.getElementById("r4").style.display = "";

            if(data[szam].type==2){
              document.getElementById("r3").style.display = "none";
              document.getElementById("r4").style.display = "none";
            }
            if(data[szam].type==3){
              document.getElementById("r4").style.display = "none";
            }          
            document.getElementById("box1").style.display = "none";
            document.getElementById("box2").style.display = "none";
            document.getElementById("box3").style.display = "none";
            document.getElementById("box4").style.display = "none";
            document.getElementById("megold").style.display = "none";
            switch (data[szam].correct_answer_no){
              case 1:
                document.getElementById('r1').checked = true;
              break;
              case 2:
                document.getElementById('r2').checked = true;
                break;
              case 3:
                document.getElementById('r3').checked = true;               
                break;
              case 4:
                document.getElementById('r4').checked = true;             
                break;
           }
          break;
          case 5: //tobb lehetoseg
            document.getElementById("megold").style.display = "none";
            document.getElementById("r1").style.display = "none";
            document.getElementById("r2").style.display = "none";
            document.getElementById("r3").style.display = "none";
            document.getElementById("r4").style.display = "none";
            document.getElementById("box1").style.display = "";
            document.getElementById("box2").style.display = "";
            document.getElementById("box3").style.display = "";
            document.getElementById("box4").style.display = "";
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
      document.getElementById('dnd').innerHTML = "Huzd ide vagy kattints a tallozásért";
      document.getElementById('kepurl').value = "URL";
    }else{
      document.getElementById('dnd').innerHTML = "<img id='kepBox' style='height: 100%; width: 100%; object-fit: contain' src='" + data[szam].image + "'/>";
      document.getElementById('kepurl').value = data[szam].image;
    }
  }
}