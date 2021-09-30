var bar=0;
var data = [];
var elem;
var work = false;
window.onload = (event) => {

}

//pdf
function PDF(testSzoveg) {
    testSzoveg = document.getElementById("tippem").value;
    console.log(testSzoveg);
    var form = $('#testPost');
    var hiddencucc = $('#postTippem');
    hiddencucc.val(testSzoveg);
    console.log(hiddencucc.val());
    form.trigger('submit', function(){});
  }


//EXP
function EXP(testSzoveg) {
  testSzoveg = document.getElementById("tippem").value;
  console.log(testSzoveg);
  var form = $('#testexp');
  var hiddencucc = $('#postexp');
  hiddencucc.val(testSzoveg);
  console.log(hiddencucc.val());
  form.trigger('submit', function(){});
}

//RESEXP
function RESEXP(testSzoveg) {
  testSzoveg = document.getElementById("tippem").value;
  console.log(testSzoveg);
  var form = $('#testresexp');
  var hiddencucc = $('#postresexp');
  hiddencucc.val(testSzoveg);
  console.log(hiddencucc.val());
  form.trigger('submit', function(){});
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
            var counttime = 0;
            for (i = 0; i <data[0].idtest ; i++) {
              counttime = counttime + data[i].time;
              typeselect(i);
            }
            alltime(counttime);
        },
        dataType: "json"
      });
  }

function typeselect(i){
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

function alltime(counttime) {
   //teszt ossszes ideje
   var minutes = Math.floor(counttime / 60);
   var seconds = counttime % 60;
  if(seconds == 0){
    document.getElementById("CountTime").innerHTML = data[0].idtest + " db kérdés -" + " Kitöltési idő: " + minutes + ":" + seconds + "0" ;
  }else{
    if(seconds<10){
    document.getElementById("CountTime").innerHTML = data[0].idtest + " db kérdés -" + " Kitöltési idő: " + minutes + ":0" + seconds ;
    }else{
      document.getElementById("CountTime").innerHTML = data[0].idtest + " db kérdés -" + " Kitöltési idő: " + minutes + ":" + seconds ;
    }
  }
}

//bbcode
var textarea = document.getElementById("bbcode-textarea");
sceditor.create(textarea, {
  format: 'bbcode',
  plugins: 'undo',
  
  style: '/minified/themes/content/default.min.css',
  width: '100%',
  height: '338',
  resizeEnabled: false,
  id: 'bbcode',
  emoticonsRoot: '/'
});

// toolbar: 'bold,italic,underline|font,size,subscript,superscript|color,emoticon|left,center,right,justify',

var instance = sceditor.instance(textarea);
// instance.readOnly(true);

//auto change type layout
$("#type").change(function(e) {
  qsave(bbcode-textarea);
  dofunc(bbcode-textarea);
});

//hozza ad
// felugro valasztas
  $("#BT5").click(function(e) {
    $("#popUpDiv").show();
});

$("#popupSelect").change(function(e) {
  console.log(($("#popupSelect").val()));
  // document.getElementById("type").value = ($("#popupSelect").val());
    $("#baseDiv").html($("#popupSelect").val() + ' clicked. Click again to change.');
    $("#popUpDiv").hide();
    doadd(($("#popupSelect").val()));
});

  function doadd(type) {
    console.log(data.length + " ez a hossza");
    console.log(data);
    console.log("-------");
    if (data == "nincs adat"){
      data = [];
      data.push({answer_1:"", answer_2:"", answer_3:"", answer_4:"", correct_answer_no:parseInt(""), image:"", question:"",
    question_number: 0, score:"100", test_id: document.getElementById("tippem").value,  time:"10", type:parseInt(type) });
    }else{
    data.push({answer_1:"", answer_2:"", answer_3:"", answer_4:"", correct_answer_no:parseInt(""), image:"", question:"",
    question_number: (data[data.length - 1].question_number) + 1, score:"100", test_id:(data[data.length - 1].test_id),  time:"10", type:parseInt(type) });
    }
    console.log("hozza adva");
    console.log(data);
    add("uj elem");                
    // rest();                  //ki kell szervezni ezt kell szerkezteni az uj letrehozashoz
    // elem = bar-1;
    dosave();
    // --elem;
    // dofunc(elem);
    document.getElementById("popupSelect").value = "none";
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
        var modified = elem;
        elem=element.name;
        if (work){
          qsave (modified);
        }else{
          work=true;
        }
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

//save after onclick
function qsave (modified){
  data[modified].question = instance.val();
  data[modified].answer_1 = document.getElementById("BT1").value;
  data[modified].answer_2 = document.getElementById("BT2").value;
  data[modified].answer_3 = document.getElementById("BT3").value;
  data[modified].answer_4 = document.getElementById("BT4").value;
  // data[modified]. = modified+1;
  // data[modified]. = document.getElementById("tippem").value;
  data[modified].time = document.getElementById("timeset").value;
  data[modified].score = document.getElementById("points").value;
  data[modified].type = parseInt(document.getElementById("type").value);
  if (document.getElementById("kepurl").value != "URL"){
    data[modified].image = document.getElementById("kepurl").value;
  }else{
    data[modified].image = "";
  }
  //valaszment
  var fuz = 0;
  if( data[modified].type != 1 ){
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
    data[modified].correct_answer_no = fuz;
  }else{
    if (document.getElementById("megold").value =="") {
      data[modified].correct_answer_no = 0;
    } else {
      data[modified].correct_answer_no = document.getElementById("megold").value;
    }
  }
}


function dosave (){
  qsave(elem);
  // console.log(JSON.stringify(data));
  $.ajax({
      type: "POST",
      url: 'save',
      data:  {"ment": JSON.stringify(data)},
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
  var txt;
  //for confirm del
  if (confirm("Biztosan Törlöd?")) {
    txt = 1;
  } else {
    txt = 0;
  }

  if (txt == 1){
  var tomb=[];
  tomb[0] =  document.getElementById("tippem").value;
  tomb[1] = data[elem].question_number;
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
  //document.getElementById('elem').innerText = "";
  instance.val("")
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
    rest();
    document.getElementById("BT1").style.display = "";
    document.getElementById("BT2").style.display = "";
    document.getElementById("BT3").style.display = "";
    document.getElementById("BT4").style.display = "";
      //document.getElementById('elem').innerText = data[szam].question;
      instance.val(data[szam].question);
      // document.getElementById('cim').innerHTML = instance.fromBBCode(data[szam].question, true);
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