var id = 141450;
// var data;
var xValues = [];
var yValues = [];
var temp = [];

//---------------------------------------data_get--------------------------------
function getdata(testSzoveg) {
  return $.ajax({
      type: "POST",
      url: 'chart',
      data: {"chart": testSzoveg},
      success: function (response, error) {
          // console.log(response);
          // $("#tablak").text(response[0].kerdes); 
          // data = response;
          xValues.push(response[0].nick_name);
          response.forEach(element => {
            var bool = false;
            xValues.forEach(i =>{                   //collect unique name
              if (i == element.nick_name){
                bool = true;
              }
            })
            if(bool == false){
              xValues.push(element.nick_name)
            }
          });
          xValues.forEach(element => {
            temp.push([id,element]);
          });
          listdata(temp);
      },
      dataType: "json"
    });
}

function listdata(names) {

    $.ajax({
      type: "POST",
      url: 'scores',
      data:  {"scores": JSON.stringify(names)},
      success: function (response, error) {
          // $("#tablak").text(response[0].kerdes); 
          // yValues.push(response[0].points);
          response.forEach(element => {
            yValues.push(element[0].points);
          });
      },
      dataType: "json"
    });
}

//-----------------------------------CHART-----s---------------------------
// getdata(id);

getdata(id).then(function() {
  alma();
});
setTimeout(function(){
  alma();
}, 2000);

function alma() {
  

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
// var xValues = ["Italy", "France", "Spain", "USA", "Argentina","Japan","China","England","India"];
// var yValues = [55, 49, 44, 61, 30, 76, 14, 67, 38];
// var barColors = ["red", "green","blue","orange","brown","purple"];

    type: "bar",
    data: {
      labels: xValues,
      datasets: [{
        // backgroundColor: barColors,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(201, 203, 207, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(201, 203, 207, 0.5)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)',
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 3
      ,
        data: yValues
      }]
    },
    options: {
      // skipNull : false,
      // scales: {
      //   y: {
      //     beginAtZero: true,
      //   }
      // },
      legend: {display: false},
      responsive: true,
      title: {
        display: true,
        text: "A " + id + " azonosítójú eredményei "
      },
    }
  });
}
