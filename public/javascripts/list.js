var bar=0;
var data = [];
var elem;
var work = false;
var pincode;
window.onload = (event) => {
  console.log(pincode);
  doAjax(pincode);
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
function EXP(pincode) {
  // testSzoveg = document.getElementById("tippem").value;
  console.log(pincode);
  var form = $('#testexp');
  var hiddencucc = $('#postexp');
  hiddencucc.val(pincode);
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

//EMAIL
function MAIL(testSzoveg) {
  testSzoveg = document.getElementById("tippem").value;
  console.log(testSzoveg);
  var form = $('#testmail');
  var hiddencucc = $('#postmail');
  hiddencucc.val(testSzoveg);
  console.log(hiddencucc.val());
  form.trigger('submit', function(){});
}


function doAjax(testSzoveg) {
  alldel();
    // testSzoveg = document.getElementById("tippem").value;
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
            var countpoint = 0;
            for (i = 0; i <data[0].idtest ; i++) {
              counttime = counttime + data[i].time;
              countpoint = countpoint + data[i].score;
              typeselect(i);
              $("#"+ i).trigger('click');
            }
            $("#0").trigger('click');
            document.getElementById("CountPoint").innerHTML = (countpoint/100);
            alltime(counttime);
        },
        dataType: "json"
      });
  }

function typeselect(i){
  console.log("data id:"+i);
  switch(data[i].type) {
    case 0:
        add("Igaz/Hamis");
      break;
      case 2:
        add("Felelet választós (több megoldás)");
      break;
      case 13:
      case 14:
        add("Felelet választós");
      break;
  }
}

function alltime(counttime) {
   //teszt ossszes ideje
   var minutes = Math.floor(counttime / 60);
   var seconds = counttime % 60;
  if(seconds == 0){
    document.getElementById("CountTime").innerHTML = minutes + ":" + seconds + "0" ;
  }else{
    if(seconds<10){
      document.getElementById("CountTime").innerHTML = minutes + ":0" + seconds ;
    }else{
      document.getElementById("CountTime").innerHTML = minutes + ":" + seconds ;
    }
  }
}

//bbcode
var textarea = document.getElementById("bbcode-textarea");
sceditor.create(textarea, {
  format: 'bbcode',
  plugins: 'undo',
  toolbar: 'bold,italic,underline|font,size,subscript,superscript|color,emoticon|left,center,right,justify',
  style: '/minified/themes/content/default.min.css',
  width: '100%',
  height: '338',
  resizeEnabled: false,
  id: 'bbcode',
  emoticonsRoot: '/'
});

var instance = sceditor.instance(textarea);
// instance.readOnly(true);

  function doadd() {
    console.log(data.length + " ez a hossza");
    console.log(data);
    console.log("-------");
    if (data == "nincs adat"){
      data = [];
      data.push({answer_1:"", answer_2:"", answer_3:"", answer_4:"", correct_answer_no:parseInt(""), image:"", question:"",
    question_number: 0, score:"100", test_id: pincode,  time:"10", type:parseInt(document.getElementById('task_type').value) });
    }else{
    data.push({answer_1:"", answer_2:"", answer_3:"", answer_4:"", correct_answer_no:parseInt(""), image:"", question:"",
    question_number: (data[data.length - 1].question_number) + 1, score:"100", test_id:(data[data.length - 1].test_id),  time:"10", type:parseInt(document.getElementById('task_type').value) });
    }
  $("#tabla_szam").text(bar+1);
    console.log("hozza adva");
    console.log(data);  
  }


  function add(type) {
    console.log("barid -- :"+bar);
    newTask(bar,type);
    bar++;
  }


  function newTask(barid,type) {
    barid++;
     var ido = 10;
     var poi = 1; 
    if (typeof data[bar] === 'undefined'){
    }else{
      ido=data[bar].time;
      poi= (data[bar].score/100);
    }
    var slide = `<div class="row g-0 ratio ratio-16x9" onclick="dynamicDivOnClick(`+ bar +`);">
          <div class="card card-taskbar" id=`+ barid +`>
            <div class="card-header task-header">
              <span class="d-inline float-start text-dark">`+ barid +`.</span>
              <span class="iconify reward-icon d-inline float-end ms-1" data-icon="mdi:star-plus"></span>
              <span  class="d-inline float-end ms-1">0</span>
              <span class="iconify star-icon d-inline float-end ms-1" data-icon="bx:bxs-star"></span>
              <span id="spoint`+ bar +`" class="d-inline float-end ms-1">` + poi + `</span>
              <span class="iconify clock-icon d-inline float-end ms-1" data-icon="akar-icons:clock"></span>
              <span  id="stime`+ bar +`" class="d-inline float-end">`+ ido +`</span>
            </div>
            <div class="card-body p-0 m-auto align-middle d-flex task-labels">
              <span class="m-auto">`+ type +`</span>
            </div>
            <div>
              <span class="iconify modify-icon d-inline float-end" data-icon="eos-icons:content-modified"></span>
            </div>	
          </div>
        </div>`;
  
    var toastElement = htmlToElement(slide);
    var toastConainerElement = document.getElementById("Bar");
    toastConainerElement.appendChild(toastElement);
    // document.getElementById("name").value = bar;
    mobile(type);
  }


  function dynamicDivOnClick(bars) {
    // console.log(element.id);
    document.getElementById("taskNumber").textContent=+bars+1+"#";
    var modified = elem;
    elem=bars;
    if (work){
      qsave (modified);
      qsupervision(modified);
    }else{
      work=true;
    }
    dofunc(bars);
  }


//mobile list
function mobile(type) {
  $("#mobile").append(new Option( (bar+1) +". feladat | " + type, bar));
}

$("#mobile").change(function(e) {
  var i =($("#mobile").val());
  if(i == "plus"){
    console.log("hozza ad");
    $("#newTaskBtn").trigger('click');
  }else{
  $("#"+ i).trigger('click');
  }
});


// point auto change
$("#points").change(function(e) {
  qsave(elem);
  var temp = 0;
  data.forEach(calcp => {
    temp = temp + calcp.score;
  });
  temp=(temp/100);
  console.log(temp);
  $("#CountPoint").text(temp);
  $("#spoint"+elem).text((data[elem].score/100));
});


// time auto change
$("#timeset").change(function(e) {
  qsave(elem);
  var temp = 0;
  data.forEach(calcp => {
    temp = temp + parseInt(calcp.time);
  });
  console.log(temp);
  // $("#CountTime").text(temp);
  alltime(temp);
  $("#stime"+elem).text(data[elem].time);
});


function alldel(){
  var list = document.getElementById("Bar");
  console.log(list);
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
    if (bar > 0){
      --bar;
    }
  };
}

function qsupervision (ids){
  ids++;
  console.log("issd szam: " + ids);
  var fuz = false;
  switch(parseInt(document.getElementById('task_type').value)){
    case 2:
  if (
    document.getElementById("type-1-A").value =="" ||
    document.getElementById("type-1-B").value =="" ||
    document.getElementById("type-1-C").value =="" ||
    document.getElementById("type-1-D").value =="" )
    {
      fuz = true;
    };
    if( document.getElementById("type-1-A-check").checked || 
        document.getElementById("type-1-B-check").checked ||
        document.getElementById("type-1-C-check").checked ||
        document.getElementById("type-1-D-check").checked ){
        }else{
          fuz = true;
        }
  break;
  case 1:
    if (
      document.getElementById("type-2-A").value =="" ||
      document.getElementById("type-2-B").value =="" ||
      document.getElementById("type-2-C").value =="" )
      {
        fuz = true;
      };
      if(answerCount==4 ){
      if (document.getElementById("type-2-D").value ==""){
        fuz = true;
      }
    }
  if( document.getElementById("type-2-A-radio").checked || 
      document.getElementById("type-2-B-radio").checked ||
      document.getElementById("type-2-C-radio").checked ||
      document.getElementById("type-2-D-radio").checked ){
      }else{
        fuz = true;
      }
  break;
  case 0:
    if(document.getElementById("true").checked || document.getElementById("false").checked){
    }else{
      fuz=true;
    }
    break;
  }

  if(fuz==true){
    $("#" + ids).removeClass("card");
    $("#" + ids).addClass("card wrongTask");
  }else{
    $("#" + ids).removeClass("card wrongTask");
    $("#" + ids).addClass("card");
  }

};

//save after onclick
function qsave (modified){
  data[modified].question = instance.val();
  data[modified].time = document.getElementById("timeset").value;
  data[modified].score = (document.getElementById("points").value*100);
  data[modified].type = parseInt(document.getElementById('task_type').value);
  if (document.getElementById("kepurl").value != "URL megadása esetén másold ide a teljes címet!"){
    data[modified].image = document.getElementById("kepurl").value;
  }else{
    data[modified].image = "";
  }

  //valaszment
  var fuz = 0;
  console.log("Ez a type: ---- " + document.getElementById('task_type').value);
  switch(parseInt(document.getElementById('task_type').value)){
    case 2:
    data[modified].answer_1 = document.getElementById("type-1-A").value;
    data[modified].answer_2 = document.getElementById("type-1-B").value;
    data[modified].answer_3 = document.getElementById("type-1-C").value;
    data[modified].answer_4 = document.getElementById("type-1-D").value;
    if(document.getElementById("type-1-A-check").checked ){
      fuz = fuz + 1;
    };
    if(document.getElementById("type-1-B-check").checked ){
      fuz = fuz* 10 + 2;
    };
    if(document.getElementById("type-1-C-check").checked ){
      fuz = fuz * 10 + 3;
    };
    if(document.getElementById("type-1-D-check").checked ){
      fuz = fuz * 10 + 4;
    };
  break;
  case 1:
    data[modified].answer_1 = document.getElementById("type-2-A").value;
    data[modified].answer_2 = document.getElementById("type-2-B").value;
    data[modified].answer_3 = document.getElementById("type-2-C").value;
    data[modified].answer_4 = document.getElementById("type-2-D").value;
    if(document.getElementById("type-2-A-radio").checked){
      fuz=1;
    }
    if(document.getElementById("type-2-B-radio").checked){
      fuz=2;
    }
    if(document.getElementById("type-2-C-radio").checked){
      fuz=3;
    }
    if(document.getElementById("type-2-D-radio").checked){
      fuz=4;
    }
    data[modified].type= ((data[modified].type*10)+answerCount);  //13 - 14
    console.log(data[modified].type);
  break;
  case 0:
    data[modified].answer_1 ="Igaz";
    data[modified].answer_2 = "Hamis";
    if(document.getElementById("true").checked){
      fuz=1;
    }
    if(document.getElementById("false").checked){
      fuz=2;
    }
    break;
  }
  data[modified].correct_answer_no = fuz;
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
          doAjax(pincode).then(function() {
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
  formdata.append('tippem', pincode);
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
  if ($("#kepurl").val()=="URL megadása esetén másold ide a teljes címet!"){
    document.getElementById("kepurl").value="";
  }
});

$("#kepurl").change(function() {
  dynamicDivOnClick(elem);
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
  formdata.append('tippem', pincode);
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

//delet qest
function dotrol() {
  for (i = 0; i <bar ; i++) {
  var tomb=[];
  tomb[0] =  pincode;
  tomb[1] = data[i].question_number;
  $.ajax({
    type: "POST",
    url: 'delet',
    data:  {"del": JSON.stringify(tomb)},
    success: function (response, error) {
    },
    dataType: "json"
  });
}
 
  console.log(elem);
  console.log(data[elem]);
  data.splice(elem, 1);

  work = false;
  console.log(data[elem]);
  var tmpbar= bar -1;

  for (i = 0; i <tmpbar ; i++) {
    data[i].question_number=i;
    console.log(data);
  }
  console.log("data: ", data);
  $("#tabla_szam").text(tmpbar);
  alldel();
  var counttime = 0;
  var countpoint = 0;
  for (i = 0; i <tmpbar ; i++) {
    counttime = counttime + parseInt(data[i].time);
    countpoint = countpoint + data[i].score;
    typeselect(i);
    $("#"+ i).trigger('click');
  }

  $.ajax({
    type: "POST",
    url: 'save',
    data:  {"ment": JSON.stringify(data)},
    dataType: "json",
  });

  document.getElementById("CountPoint").innerHTML = (countpoint/100); 
  alltime(counttime);
}


function rest(){
  instance.val("")
  document.getElementById('type-1-A').value = "";
  document.getElementById('type-1-B').value = "";
  document.getElementById('type-1-C').value = "";
  document.getElementById('type-1-D').value = "";
  document.getElementById('type-2-A').value = "";
  document.getElementById('type-2-B').value = "";
  document.getElementById('type-2-C').value = "";
  document.getElementById('type-2-D').value = "";
  document.getElementById("true").checked = false;
  document.getElementById("false").checked = false;
  document.getElementById('type-1-A-check').checked = false;
  document.getElementById('type-1-B-check').checked = false;
  document.getElementById('type-1-C-check').checked = false;
  document.getElementById('type-1-D-check').checked = false;
  document.getElementById("type-2-A-radio").checked = false;
  document.getElementById("type-2-B-radio").checked = false;
  document.getElementById("type-2-C-radio").checked = false;
  document.getElementById("type-2-D-radio").checked = false;
  document.getElementById('kepurl').value = "URL megadása esetén másold ide a teljes címet!";
}


function dofunc(szam){
    rest();
      instance.val(data[szam].question);
      document.getElementById('type-1-A').value = data[szam].answer_1;
      document.getElementById('type-1-B').value = data[szam].answer_2;
      document.getElementById('type-1-C').value = data[szam].answer_3;
      document.getElementById('type-1-D').value = data[szam].answer_4;
      document.getElementById('type-2-A').value = data[szam].answer_1;
      document.getElementById('type-2-B').value = data[szam].answer_2;
      document.getElementById('type-2-C').value = data[szam].answer_3;
      document.getElementById('type-2-D').value = data[szam].answer_4;
      document.getElementById('timeset').value = data[szam].time;
      document.getElementById('points').value = (data[szam].score/100);
      document.getElementById('task_type').value = data[szam].type;
      if((data[szam].type)==13){
        document.getElementById('changeTaskSelect').value = 1;
        answerCountChange(3);
      }
      if((data[szam].type)==14){
        document.getElementById('changeTaskSelect').value = 1;
        answerCountChange(4);
      }      
      if((data[szam].type)<10){
        document.getElementById('changeTaskSelect').value = data[szam].type;
      }
      typeOfTask('changeTaskSelect');
      //check
      if ((data[szam].correct_answer_no).toString().includes("1")){
       document.getElementById("true").checked = true;
       document.getElementById('type-2-A-radio').checked = true;
       document.getElementById('type-1-A-check').checked = true
     }
     if ((data[szam].correct_answer_no).toString().includes("2")){
       document.getElementById("false").checked = true;
       document.getElementById('type-2-B-radio').checked = true;
       document.getElementById('type-1-B-check').checked = true
     }
     if ((data[szam].correct_answer_no).toString().includes("3")){
       document.getElementById('type-2-C-radio').checked = true;
       document.getElementById('type-1-C-check').checked = true
     }
     if ((data[szam].correct_answer_no).toString().includes("4")){
       document.getElementById('type-2-D-radio').checked = true;
       document.getElementById('type-1-D-check').checked = true
     }

  if (data[szam].image==null || data[szam].image==""){
      document.getElementById('dnd').innerHTML = "Kattints ide vagy húzd be a képet!";
      document.getElementById('kepurl').value = "URL megadása esetén másold ide a teljes címet!";
    }else{
      document.getElementById('dnd').innerHTML = "<img id='kepBox' class='img-fluid' src='" + data[szam].image + "'/>";
      document.getElementById('kepurl').value = data[szam].image;
    }
}