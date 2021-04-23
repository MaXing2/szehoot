var bar=0;
var data;
window.onload = (event) => {

}

function doAjax(testSzoveg) {
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
    add("Kerdes");
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
        dofunc(element.name);
    };

    var foo = document.getElementById("Bar");
    foo.appendChild(element);
    bar++;
  }

  function dofunc(szam){
    document.getElementById('elem').value = data[szam].question;
    document.getElementById('BT1').value = data[szam].answer_1;
    document.getElementById('BT2').value = data[szam].answer_2;
    document.getElementById('BT3').value = data[szam].answer_3;
    document.getElementById('BT4').value = data[szam].answer_4;

    if (data[szam].image==null || data[szam].image==""){
        document.getElementById("kep").style.display = "none";
      }else{
        document.getElementById('kep').innerHTML = "<img style='height: 100%; width: 100%; object-fit: contain' src='" + data[szam].image + "'/>";
      }
  }