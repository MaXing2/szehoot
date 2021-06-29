exports.resexp = function (fs,app,connection) {
    // result_export
    app.post('/resexp', function (req, res) {
        var test = req.body.postresexp;
        console.log(test);
        var json;
      
        var sql = "SELECT COUNT (*) as 'db' FROM test_results WHERE process_id="+connection.escape(test)+ "";
        connection.query(sql, function (err, result) {
            if (err) throw err;
            json = JSON.parse(JSON.stringify(result));
            var darab = json[0].db;
          if (darab == 0){
            res.json("nincs adat");
          }else{
            sql = "SELECT * FROM test_results WHERE process_id="+connection.escape(test)+ "";
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
                 element.process_id + '\t' + element.answers + '\t' +
                 element.ts + '\t' + element.nick_name + '\t' + 
                 element.answer_number +
                 '\r\n','utf8' ,function (err) {
                  if (err) return console.log(err);                                           // ÁT ÍRNI A LEKERDEZETT ADATOKAT
                  console.log('exported!');
                });
              
              });
              
              //send pdf
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