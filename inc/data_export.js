exports.exp = function (fs,app,connection) {
    // data_export
    app.post('/exp', function (req, res) {
        var test = req.body.postexp;
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

              var filename = new Date().getTime();
              
              //clear last
              fs.writeFile('./public/usersdata/' + filename + '.txt', '', { flag: 'w+' }, err => {})

              json.forEach(element => {
                //write
                fs.appendFileSync('./public/usersdata/' + filename + '.txt','\ufeff' +  
                 element.question + '\t' + element.answer_1 + '\t' +
                 element.answer_2 + '\t' + element.answer_3 + '\t' + 
                 element.answer_4 + '\t' + element.correct_answer_no + '\t' +
                 element.score + '\t' + element.type + '\t' + 
                 element.time  + 
                 '\r\n','utf8' ,function (err) {
                  if (err) return console.log(err);
                  console.log('exported!');
                });
              
              });
              
              //send txt
              res.download('./public/usersdata/' + filename + '.txt');
              //wait and delet
              setTimeout(function() {
                fs.unlink('./public/usersdata/' + filename + '.txt', (err) => {
                  if (err) throw err;
                  console.log('file was deleted');
                });
              }, 5000);          
              
            });
          }
        });
      });
    }