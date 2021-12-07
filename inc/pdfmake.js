exports.adat = function (jsPDF,app,connection,fs) {
// pdf
app.post('/pdf', function (req, res) {
    var test = req.body.test_id_pt;
    var print_points = req.body.print_points; // 1 az értéke, ha kell nyomtatni a pontokat, 0 ha nem
    var print_test_name = req.body.print_test_name; // 1 az értéke, ha kell nyomtatni a teszt nevét, 0 ha nem
    console.log(print_test_name);
    console.log(print_points);
    console.log(test);
    var json;

    sql = "SELECT test_name AS tname FROM test_list WHERE id="+connection.escape(test)+ "";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      var res;
      res = JSON.parse(JSON.stringify(result));
      console.log(res[0].tname);
      test_name=res[0].tname;
    });

    var sql = "SELECT COUNT (*) as 'db' FROM test_questions WHERE test_id="+connection.escape(test)+ "";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        json = JSON.parse(JSON.stringify(result));
        var darab = json[0].db;
      if (darab == 0){
        res.json("nincs adat");
      }else{
        sql = "SELECT * FROM test_questions WHERE test_id="+connection.escape(test)+ "";
        connection.query(sql, function (err, result) {
          if (err) throw err;
          json = JSON.parse(JSON.stringify(result));
          json[0].idtest=darab;
          
          //PDF
          var alltimes = 0;
          var curPos = 0; 
          // var test_name = "Matematika 1 vizsga 2021.06.12!";
          var i = 20;   // starter height
          var last = 0;
          var maxpoint = 0;
          const doc = new jsPDF();
          const font = require("../public/javascripts/arial-normal")
          doc.addFileToVFS("arial-normal.ttf", font);
          doc.addFont("arial-normal.ttf", "arial", "normal");
          doc.setFont("arial", "normal");
          if (print_test_name==1){
            doc.text(test_name, 105, 10 ,"center");     //name
          }
          doc.setFontSize(10);
          doc.text("Név:", 20, 10);
          doc.line(180, 12, 30, 12); 
  
          //test all time
          json.forEach(element => {
            alltimes = alltimes + element.time;
            maxpoint = maxpoint + (element.score);
          });
            var minutes = Math.floor(alltimes / 60);
            var seconds = alltimes % 60;
           if(seconds == 0){
             alltimes = minutes + ":" + seconds + "0" ;
           }else{
             if(seconds<10){
              alltimes =  minutes + ":0" + seconds ;
             }else{
              alltimes =  minutes + ":" + seconds ;
            }
          }
          doc.setFontSize(8);
          doc.text("(Kitöltési idő: " + alltimes + ")",195,10, "right")
  

  
          //for
          json.forEach(element => {
            //type
            doc.setFontSize(14);
            var typ="";
            switch(element.type) {
              case 0:
                typ="Igaz/Hamis"
              break;
              case 2:
                typ="Több jó válasz lehetőség!";
              break;
              case 13:
              case 14:
                typ="Egy jó válasz lehetőség!";                
              break; 
            };
  
            //bbcode parser 
            var parser = element.question;
              parser = parser.replace(/<[^>]+>/g, '');
            
            //questions
            var egesz = (element.question_number)+1 + ". "  + parser;
            var tort = doc.splitTextToSize(egesz, 150);
            last = tort.length - 1;
            doc.text(tort,  10, (curPos)*2 + i);
            curPos += last;
            doc.setFontSize(8);
            doc.text("(" + typ + ")", 195, ((curPos)*2 + i)-1,"right");
            if(print_points==1){
              doc.text("(" + (element.score) + " Pont)", 195, ((curPos)*2 + i)+5,"right");
            }
            doc.setFontSize(10);
            //answers
            if(element.type==0){
              var egesz = "A. "+"Igaz";
              var tort = doc.splitTextToSize(egesz, 150);
              last = tort.length - 1;
              doc.text(tort, 20, (curPos)*2 + i+8);
              curPos += last;
            }else{
            if(element.answer_1 != null){
              var egesz = "A. "+element.answer_1;
              var tort = doc.splitTextToSize(egesz, 150);
              last = tort.length - 1;
              doc.text(tort, 20, (curPos)*2 + i+8);
              curPos += last;
              }
            }
            if(element.type==0){
              var egesz = "B. "+"Hamis";
              var tort = doc.splitTextToSize(egesz, 150);
              doc.text(tort, 20, (curPos)*2 + i + 16);
              last = tort.length -1;
              curPos += last;
            }else{
            if(element.answer_2 != null){
              var egesz = "B. "+element.answer_2;
              var tort = doc.splitTextToSize(egesz, 150);
              doc.text(tort, 20, (curPos)*2 + i + 16);
              last = tort.length -1;
              curPos += last;
              }
            }
            if(element.answer_3 != null){
              var egesz = "C. "+element.answer_3;
              var tort = doc.splitTextToSize(egesz, 150);
              doc.text(tort, 20, (curPos)*2 + i + 24);
              last = tort.length -1;
              curPos += last;
            }else{
              i=i-8;
            }
            if(element.answer_4 != null){
              var egesz = "D. "+element.answer_4;
              var tort = doc.splitTextToSize(egesz, 150);
              doc.text(tort, 20, (curPos)*2 + i + 32);
              last = tort.length -1;
              curPos += last;
            }else{
              i=i-8;
            }
            doc.line(200, (curPos)*2 + i+35, 10, (curPos)*2 + i+35); 
            i=i+43
            //new page
            if(((curPos)*2 + i)>=270){
              curPos = 0;
              doc.addPage("a4");
              i=20;
              doc.text("Név:", 20, 10);
              doc.setFontSize(8);
              doc.text("(Kitöltési idő: " + alltimes + ")",195,10, "right")
              doc.setFontSize(16);
              if (print_test_name==1){
                doc.text(test_name, 105, 10, "center");
              }
              doc.line(180, 12, 30, 12); 
            }
          });

          //marks table
          doc.setFontSize(10);
          if(print_points==1){
            doc.text("Pontozás:", 58, (curPos)*2 + i-2, "center");
            doc.text("Elérhető pont: "+maxpoint, 158, (curPos)*2 + i-2, "right");
          }
          function createHeaders(keys) {
            var result = [];
            for (var i = 0; i < keys.length; i += 1) {
              result.push({
                id: keys[i],
                name: keys[i],
                prompt: keys[i],
                width: 65,
                align: "center",
                padding: 0
              });
            }
            return result;
          }
          var generateData = function() {
            var outs = [];
            var marks = {
              Elégtelen: "0-50%",
              Elégséges: "50-65%",
              Közepes: "65-80%",
              Jó: "80-90%",
              Jeles: "90-100%",
            };
            outs.push(Object.assign({}, marks));
            return outs;
          };
          var headers = createHeaders([
            "Elégtelen",
            "Elégséges",
            "Közepes",
            "Jó",
            "Jeles"
          ]);
          if(print_points==1){
            doc.table(50, (curPos)*2 + i, generateData(), headers,{ autoSize: true });
          }

          var filename = new Date().getTime();

          
          //send pdf
          doc.save('./public/usersdata/' + filename + '.pdf'); 
          res.download('./public/usersdata/' + filename + '.pdf');
           //wait and delet
           setTimeout(function() {
            fs.unlink('./public/usersdata/' + filename + '.pdf', (err) => {
              if (err) throw err;
              console.log('file was deleted');
            });
          }, 5000);          
          
        });
      }
    });
  });
}