var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// MySQL kapcsolati beállítások
var mysql = require ('mysql');
var config = require('./inc/db.js');
var connection = mysql.createConnection(config.databaseOptions);
var bcrypt = require('bcrypt');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

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
app.get('/ajaxtest',function (req, res) {
   res.render('ajaxtest.ejs',{});
})

app.post('/ajaxtest',function (req, res) {
  res.send('Hello');
})

// Dashboard esetén
app.get('/dashboard',function (req, res) {
    if (req.session.loggedIn) { // be van jelentkezve?
      res.render('dashboard.ejs',{});
    } 
    else
      res.redirect('/');
  })

// Signup esetén
app.get('/signup',function (req, res) {
  if (req.session.loggedIn) { // be van jelentkezve?
    res.render('dashboard.ejs',{});
  } 
  else {
    res.render('signup.ejs',{});
  } 
})

// Logout esetén
app.get('/logout', function (req, res) { // logout get kérés esetén a session bontása
  req.session.destroy(function (err) { 
    if (err) throw err;
    else {
     res.send('Sikeresen kijelentkeztél!');
    }
  })
})
//-------------------------------------------------------POST kérések kezelése-----------------------------------------------------------
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

app.post('/signup_validator',function (req, res) {
  if (req.body.target == 'username') {
    var username = req.body.username;
    connection.query("SELECT * FROM users WHERE username=" + connection.escape(username) + "",
      function(err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {res.json({exists: true})} else {res.json({exists: false})}
      })
  }
  if (req.body.target == 'email') {
    var email = req.body.email;
    connection.query("SELECT * FROM users WHERE email=" + connection.escape(email) + "",
      function(err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {res.json({exists: true})} else {res.json({exists: false})}
      })
  }
})

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
