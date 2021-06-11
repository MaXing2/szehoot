exports.adat = function (jsPDF,app,connection) {
// pdf
app.post('/pdf', function (req, res) {
    var test = req.body.postTippem;
    console.log(test);
    var json;
  
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
          var i = 20;   // starter height
          var last = 0;
          const doc = new jsPDF();
          const font = require("../public/javascripts/arial-normal")
          doc.addFileToVFS("arial-normal.ttf", font);
          doc.addFont("arial-normal.ttf", "arial", "normal");
          doc.setFont("arial", "normal");
          doc.text("Matematika 1 vizsga 2021!", 105, 10 ,"center");     //name
          doc.setFontSize(10);
          doc.text("Név:", 20, 10);
          doc.line(180, 12, 30, 12); 
  
          //test all time
          json.forEach(element => {
            alltimes = alltimes + element.time;
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
              case 1:
                typ="Tippeld meg a választ!";
              break; 
              case 2:
              case 3:
              case 4:
                typ="Egy jó válasz lehetőség!";
              break; 
              case 5:
                typ="Több jó válasz lehetőség!";
              break; 
            };
  
            //bbcode parser 
            var data = element.question;
            var parsed = data.replace(/\[(\w+)[^w]*?](.*?)\[\/\1]/g, '$2');
            parsed = parsed.replace(/\:(.*?)\:/g, "");    //emoji
            // console.log(parsed)
  
            //questions
            var egesz = element.question_number + ". "  + parsed;
            var tort = doc.splitTextToSize(egesz, 150);
            last = tort.length - 1;
            doc.text(tort,  10, (curPos)*2 + i);
            curPos += last;
            doc.setFontSize(8);
            doc.text("(" + typ + ")", 195, ((curPos)*2 + i)-1,"right");
            doc.text("(" + element.score + " Pont)", 195, ((curPos)*2 + i)+5,"right");
            doc.setFontSize(10);
            //answers
            if(element.answer_1 != null){
              var egesz = "A. "+element.answer_1;
              var tort = doc.splitTextToSize(egesz, 150);
              last = tort.length - 1;
              doc.text(tort, 20, (curPos)*2 + i+8);
              curPos += last;
            }
            if(element.answer_2 != null){
              var egesz = "B. "+element.answer_2;
              var tort = doc.splitTextToSize(egesz, 150);
              doc.text(tort, 20, (curPos)*2 + i + 16);
              last = tort.length -1;
              curPos += last;
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
              doc.text("Matematika 1 vizsga 2021!", 105, 10, "center");
              doc.line(180, 12, 30, 12); 
            }
          });
          //send pdf
          doc.save("a4.pdf"); 
          res.download('./a4.pdf');
        });
      }
    });
  });
}