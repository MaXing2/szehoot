var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// MySQL kapcsolati beállítások
var mysql = require ('mysql');
var config = require('./inc/db.js');
// Get kérések
var get = require ('./inc/get_request.js');
// Post kérések
//var post = require ('./inc/post_request.js');
var connection = mysql.createConnection(config.databaseOptions);
var bcrypt = require('bcrypt');
var session = require('express-session');
const app = express();
//fileupload
const fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(session({secret:'Szehoot2021'
,name:'uniqueSessionID'
,saveUninitialized:false
,cookie: {
  maxAge: 1000*60*60} // 1 óráig él a session
}))


//------------------------------------------------------GET kérések kezelése-----------------------------------------------------------
get.adat(app);
//-------------------------------------------------------POST kérések kezelése-----------------------------------------------------------

app.post('/fastjoin',function (req, res) {
    var pincode = req.body.pincode;
    connection.query("SELECT * FROM test_process_list WHERE pincode=" + connection.escape(pincode) + "",
      function(err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
          if (result[0].mode == 0 || result[0].mode == 1) {//ha a pinhez tartozó tesztfolyamat módja 0 (gyakorlási) vagy 1 (tantermi)
            res.render('fastjoin.ejs',{'access': true, 'pincode': pincode}); //elküldjük, hogy engedélyezett a csatlakozás és mellé a pinkódot       
          } else {
            res.redirect('/?error=1'); //hiba: létezik a pinkód, de a teszt módja nem engedélyezi a gyors belépést
           return;
          }
        } else {
          res.redirect('/?error=2'); //hiba: nem létezik a pinkód, így a belépés sem engedélyezett (nincs hova belépni)
          return;
        }
      })
})

// Gyökérre való post esetén (bejelentkezés)
app.post('/', function(req, res) {
  var username = req.body.username; // felhasználónév, jelszó lekérés a postból
  var password = req.body.password;
  const saltRounds = 10; // a hashelés költsége, ami exponenciálisan nő az érték növelése esetén (biztonság vs sebesség)
  bcrypt.hash(password, saltRounds, function(err, hash) {// hashelés
    password = hash;
    console.log(password);
  });
  console.log(username + " " + password);
  console.log("SELECT * FROM users WHERE password=" + connection.escape(password) + " AND username=" + connection.escape(username) + "");
  connection.query("SELECT * FROM users WHERE username=" + connection.escape(username) + "", // sql lekérdezés a fenti értékekkel (létezik a user?)
 // callback függvény
  function(err, result, fields) {
      if (err) throw err;
      else {
        console.log(result.length);
        if (result.length > 0) { // ha van eredménye a lekérdezésnek, akkor létezik és jöhet a jelszóellenőrzés
          bcrypt.compare(password, result[0].password).then(function(result) {
            if (result) {
              console.log("Sikeres bejelentkezés: "+username);
              req.session.loggedIn = true; // a sessionban a loggedIn bool mostantól igaz értékű lesz
              req.session.username = username; // betesszük a username -t is
              console.log(req.session);
              res.redirect('/dashboard')
            } else {
                console.log("Hibás jelszó: "+username);
                console.log(result);
                res.render('index.ejs',{});
            } 
          });
        // res.render('dashboard.ejs',{username: result[0].username });
        } else { // ha nem lenne visszatérő érték az sql -ből, akkor a kezdőlapra irányítás
          console.log(result);
          console.log("Nem létező felhasználónév: "+username);
          res.render('index.ejs',{});
        }
      }
  });
});
// Signup post esetén
app.post('/signup', function(req, res) {
  var username = req.body.username; // felhasználónév, jelszó lekérés a postból
  var password = req.body.password;
  var passwordc = req.body.passwordc;
  var email = req.body.email;
  if ((password == passwordc) && (password != "") && (passwordc != "") && (email != ""))  { //backend ellenőrzések
    connection.query("SELECT * FROM users WHERE username=" + connection.escape(username) + "",
    function(err, result, fields) {
      if (err) throw err;
      else { 
        if (result.length == 0) {
          connection.query("SELECT * FROM users WHERE email=" + connection.escape(email) + "",
          function(err, result, fields) {
            if (err) throw err;
            else { 
              if (result.length == 0) {
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds, function(err, hash) {// hashelés
                  password = hash;
                  console.log(password);
                  connection.query("INSERT INTO users (username, password, email) VALUES (" + connection.escape(username) + ", " + connection.escape(password) + ", " + connection.escape(email) + ")",
                  function(err, result, fields) {
                    if (err) throw err;  
                  else res.send("Minden ok!"); //sikeres reg
                  })
                }) 
              } else res.send("Az e-mail már foglalt");
            } 
          })
          } else res.send("A felhasználónév már foglalt");
    }
  }
  )} else res.send("Súlyos hiba!");
});
//Ezt hívja meg az AJAX
app.post('/signup_validator',function (req, res) {
  if (req.body.target == 'username') {//felhasználónév létezik -e?
    var username = req.body.username;
    connection.query("SELECT * FROM users WHERE username=" + connection.escape(username) + "",
      function(err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {res.json({exists: true})} else {res.json({exists: false})}
      })
  }
  if (req.body.target == 'email') {//email létezik-e?
    var email = req.body.email;
    connection.query("SELECT * FROM users WHERE email=" + connection.escape(email) + "",
      function(err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {res.json({exists: true})} else {res.json({exists: false})}
      })
  }
})

//-----------------------------------------------------------editor-----------------------------------------------------------//
//list post kezelese
app.post('/list', function (req, res) {
  var test = req.body.asd;
  var json;

  var sql = "SELECT COUNT (*) as 'db' FROM test_questions WHERE test_id='"+test+ "'";
  connection.query(sql, function (err, result) {
      if (err) throw err;
      json = JSON.parse(JSON.stringify(result));
      var darab = json[0].db;
    if (darab == 0){
      res.json("nincs adat");
    }else{
      sql = "SELECT * FROM test_questions WHERE test_id='"+test+ "'";
      connection.query(sql, function (err, result) {
        if (err) throw err;
        json = JSON.parse(JSON.stringify(result));
        json[0].idtest=darab;
        res.json(json);
    });
}
});
});



//file upload
app.use(fileUpload({ fileSize: 5 * 1024 * 1024 , responseOnLimit: 'File size limit has been reached', abortOnLimit: true, safeFileNames: true, preserveExtension: true }));
app.post('/upload', function(req, res) {
  
  let sampleFile;
  let uploadPath;
  let sqlimg;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/public/picture/' + new Date().getTime()+"_"+ sampleFile.name;
  //sql insert file path
  sqlimg ="../picture/"+ new Date().getTime()+"_"+ sampleFile.name;

  let elem = req.body.elem;
  let tippem = req.body.tippem;
  console.log(elem, tippem);

  var sql = "SELECT COUNT (*) as 'db' FROM test_questions WHERE test_id='" +tippem+ "' and question_number='"+elem+"'";
  connection.query(sql, function (err, result) {
      if (err) throw err;
      json = JSON.parse(JSON.stringify(result));
      var darab = json[0].db;
      console.log(darab);
    if (darab == 0){
      var sql = "INSERT INTO test_questions (test_id ,question_number,image) VALUES  ('"+tippem+ "','"+elem+ "'','"+sqlimg+ "')";
      connection.query(sql, function (err, result) {
          if (err) throw err;
      });
    }else{
      //van adat
      var sql = "UPDATE test_questions SET image='"+sqlimg+"' WHERE test_id='" +tippem+ "' and question_number='"+elem+"'";
      connection.query(sql, function (err, result) {
          if (err) throw err;
      });
  }
});

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send("sikeres feltoltes");
  });
});


//delet post kezelese
app.post('/delet', function (req, res) {
  var test = JSON.parse(req.body.del);
  console.log(test);

  var sql = "DELETE FROM test_questions WHERE test_id='" +test[0]+ "' and question_number='"+test[1]+"'";
  connection.query(sql, function (err, result) {
      if (err) throw err;
      json = JSON.parse(JSON.stringify(result));
      // var darab = json[0].db;
      res.json(json);
  });
});


//save post kezelese
app.post('/save', function (req, res) {
  var test = JSON.parse(req.body.ment);
  console.log(test);

  var sql = "SELECT COUNT (*) as 'db' FROM test_questions WHERE test_id='" +test[6]+ "' and question_number='"+test[5]+"'";
  connection.query(sql, function (err, result) {
      if (err) throw err;
      json = JSON.parse(JSON.stringify(result));
      var darab = json[0].db;
    if (darab == 0){
      // nincs adat
      var sql = "INSERT INTO test_questions (test_id ,question,answer_1 ,answer_2 ,answer_3 ,answer_4 ,question_number, time, score, type, correct_answer_no) VALUES  ('"+test[6]+ "','"+ test[0]  + "','"+ test[1]  +  "','"+ test[2]  +  "','"+ test[3]  + "','"+ test[4]  +  "','" +test[5]+  "','"+test[7]+"','"+test[8]+"','"+test[9]+"','"+test[10]+"')";
      connection.query(sql, function (err, result) {
          if (err) throw err;
          json = JSON.parse(JSON.stringify(result));
          res.json(json);
      });
    }else{
      //van adat
      var sql = "UPDATE test_questions SET test_id ='"+test[6]+"',question ='"+test[0]+"',answer_1='"+test[1]+"',answer_2='"+test[2]+"',answer_3='"+test[3]+"',answer_4='"+test[4]+"',question_number='"+test[5]+"',time='"+test[7]+"',score='"+test[8]+"',type='"+test[9]+"',correct_answer_no='"+test[10]+"' WHERE test_id='" +test[6]+ "' and question_number='"+test[5]+"'";
      connection.query(sql, function (err, result) {
          if (err) throw err;
          // json = JSON.parse(JSON.stringify(result));
          // res.json(json);
      });
    res.json(darab);
};
});
});
//-----------------------------------------------------------editor_end-----------------------------------------------------------//


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
