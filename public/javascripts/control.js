const socket = io();
var actual = 0;
var getCookieValue;
var atad;
var helyes = 0;
var osszvalasz;
var globalid;
var teacher = 0;
var pontom = 0;
var time = 0 ;
window.onload = (event) => {
    var name = "kod";
    getCookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
    console.log(getCookieValue);
    kerdesadatok(65241);
    sqlm();
    color = '#'+Math.random().toString(16).substr(-6);
    document.body.style.background = color;

    // var name = "pass";
    // var ad = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
    ad="65241";
    if (ad != "65241"){
        vezerlo();
        name = "username";
        getCookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
        console.log(getCookieValue);
        socket.emit('ujkitoltes',getCookieValue);

    }else{
        document.getElementById("BT1").disabled = true;
        document.getElementById("BT2").disabled = true;
        document.getElementById("BT3").disabled = true;
        document.getElementById("BT4").disabled = true;
        document.getElementById("BT7").disabled = true;
        document.getElementById("BT8").disabled = true;
        teacher = 1;
    };
  };

//kerdesek
function sqlm (){
    actual++;
    socket.emit('sgetter',actual);
}

socket.on('getter',ered => {
    show();
    hiv(ered);
});

function hiv (ered) {
    if (typeof ered !== 'undefined') {
        atad = ered;
        var idom = ered[0].ido;
        display = document.querySelector('#time');
        clearInterval(globalid);
        startTimer(idom, display);
        starterbutton();
        document.getElementById('sorszam').innerHTML = ered[0].idtest + "./" + osszvalasz +".kérdés"; 
        document.getElementById('elem').innerHTML = ered[0].kerdes;
        //picture 
        if (ered[0].kep==null || ered[0].kep==""){
          document.getElementById("kep").style.display = "none";
        }else{
          document.getElementById('kep').innerHTML = "<img style='height: 100%; width: 100%; object-fit: contain' src='" + ered[0].kep + "'/>";
        }
        switch (ered[0].tipus) {
            case 1:         //tipp
                document.getElementById("tipp").style.display = "";
                document.getElementById('tippem').value = "";
                document.getElementById("BT1").style.display = "none";
                document.getElementById("BT2").style.display = "none";
                document.getElementById("BT3").style.display = "none";
                document.getElementById("BT4").style.display = "none";
              break;
            case 2:         //igazhamis
                document.getElementById('BT1').innerHTML = ered[0].valasz1;
                document.getElementById('BT2').innerHTML = ered[0].valasz2;
                document.getElementById("BT3").style.display = "none";
                document.getElementById("BT4").style.display = "none";
              break;
            case 3:         //harom
                document.getElementById('BT1').innerHTML = ered[0].valasz1;
                document.getElementById('BT2').innerHTML = ered[0].valasz2;
                document.getElementById('BT3').innerHTML = ered[0].valasz3;
                document.getElementById("BT4").style.display = "none";
              break;
            case 4:         //negy
                document.getElementById('BT1').innerHTML = ered[0].valasz1;
                document.getElementById('BT2').innerHTML = ered[0].valasz2;
                document.getElementById('BT3').innerHTML = ered[0].valasz3;
                document.getElementById('BT4').innerHTML = ered[0].valasz4;
              break;
            case 5:
                document.getElementById("check").style.display = "";
                document.getElementById('box1').checked = false;
                document.getElementById('box2').checked = false;
                document.getElementById('box3').checked = false;
                document.getElementById('box4').checked = false;
                document.getElementById('labbox1').innerHTML = ered[0].valasz1;
                document.getElementById('labbox2').innerHTML = ered[0].valasz2;
                document.getElementById('labbox3').innerHTML = ered[0].valasz3;
                document.getElementById('labbox4').innerHTML = ered[0].valasz4;
                document.getElementById("BT1").style.display = "none";
                document.getElementById("BT2").style.display = "none";
                document.getElementById("BT3").style.display = "none";
                document.getElementById("BT4").style.display = "none";
              break;
        }
    }
}

//ido
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var interid = setInterval(idozit, 1000);       //Interval
        globalid=interid;
        function idozit () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        time = minutes*60 + seconds;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            //sqlm();
            //subm(0);
            if (teacher==0){
                valaszolt();
                subm(0);
            }
            clearInterval(interid);
        }
    };
}

//adatok_rogzitese
function subm (ertek){
    socket.emit('rogzit',ertek,getCookieValue);
    if (atad[0].pont == null){
       if (ertek == atad[0].jovalasz){
           helyes++;
           document.getElementById('jo').innerHTML = "A jó válaszok száma: " + helyes;
       };
       if ((osszvalasz) == atad[0].idtest){
           var szazalek = Math.floor((helyes / osszvalasz * 100) * 10) / 10;
           document.getElementById('vege').innerHTML = "A teszt végetért és " + helyes + " pontot és " + szazalek + "%-ot értél el.";
       }
    }else{
      if (ertek == atad[0].jovalasz){
        helyes++;
        document.getElementById('jo').innerHTML = "A jó válaszok száma: " + helyes;
        pontom = pontom + ((atad[0].pont / atad[0].ido) * time);
        console.log(pontom)
      };
    }
};

//kerdesadatok
function kerdesadatok(kod){
    socket.emit('stablakerdes', kod);
    socket.on('tablakerdes',ered => {
        osszvalasz= ered[0].tabla_kerdes;
        console.log(osszvalasz);
    });
};

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

//control_hide
function vezerlo() {
    document.getElementById("vezerlo").style.display = "none";
  }

  function valaszolt(){
    document.getElementById("lehetosegek").style.display = "none";
    document.getElementById("elem").style.display = "none";
    document.getElementById("tipp").style.display = "none";
    document.getElementById("check").style.display = "none";
    document.getElementById("kep").style.display = "none";
  }
   
  function show(){
     document.getElementById("lehetosegek").style.display = "block";
     document.getElementById("elem").style.display = "block";
     document.getElementById("kep").style.display = "block";
  }

//show all button in start
  function starterbutton(){
    document.getElementById("BT1").style.display = "";
    document.getElementById("BT2").style.display = "";
    document.getElementById("BT3").style.display = "";
    document.getElementById("BT4").style.display = "";
    document.getElementById("tipp").style.display = "none";
    document.getElementById("check").style.display = "none";
  }

//button
document.getElementById("BT1").onclick = function doSub () { 
    subm(1);
    valaszolt();
    clearInterval(globalid);
};

document.getElementById("BT2").onclick = function doSub () { 
    subm(2);
    valaszolt();
    clearInterval(globalid);
};

document.getElementById("BT3").onclick = function doSub () { 
    subm(3);
    valaszolt();
    clearInterval(globalid);
};

document.getElementById("BT4").onclick = function doSub () { 
    subm(4);
    valaszolt();
    clearInterval(globalid);
};

document.getElementById("BT7").onclick = function doSub () { 
    subm(document.getElementById("tippem").value);
    valaszolt();
    clearInterval(globalid);
};

document.getElementById("BT8").onclick = function doSub () { 
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
  subm(fuz);
  valaszolt();
  clearInterval(globalid);
};

//vezerlo_gombok
document.getElementById("BT5").onclick = function back () { 
    if (actual != 1){
        actual--;
        actual--;
        sqlm(); 
    }
    //subm(0);    
};

document.getElementById("BT6").onclick = function next () { 
    if (actual < osszvalasz)
     sqlm(); 
     //subm(0);       
};