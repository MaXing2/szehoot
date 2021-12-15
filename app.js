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
//dátum formázás
var moment = require('moment');
//mail sender
const nodemailer = require("nodemailer");


//PDF
const { jsPDF } = require("jspdf"); // will automatically load the node version
var pdfmaker = require("./inc/pdfmake.js");
var data_export = require("./inc/data_export.js");
var result_export = require("./inc/result_export.js");
var data_import = require("./inc/data_import.js");
var email_sender = require("./inc/email_sender.js");

const fs = require('fs');

var session = require('express-session');
const app = express();
//fileupload
const fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { query } = require('express');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(fileUpload());
//dátum formázás
app.locals.moment = require('moment');

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.use(session({secret:'Szehoot2021'
,name:'uniqueSessionID'
,saveUninitialized: false
,rolling: true
,cookie: {
  maxAge: 1000*60*60} // 1 óráig él a session
}))


//------------------------------------------------------GET kérések kezelése-----------------------------------------------------------

// Gyökér esetén
app.get('/',function (req, res) {
  if (req.session.loggedIn) { // be van jelentkezve? 
    res.redirect('/home'); // ebben az esetben a main.ejs sablonban a home.ejs nyílik meg
  } 
  else {
    res.render('main.ejs', {page: 'login', loggedIn: false, status: req.query.status}); // ha nincs bejelentkezve, akkor pedig a login.ejs
  }
})

// Dashboard esetén
app.get('/dashboard',function (req, res) {
  if (req.session.loggedIn) { // be van jelentkezve?
  res.render('dashboard.ejs',{});
  } 
  else
  res.redirect('/');
})

// Result esetén
app.get('/result',function (req, res) {
  if (req.session.loggedIn) { // be van jelentkezve?
  res.render('result.ejs',{});
  } 
  else
  res.redirect('/');
})

// Logout esetén
app.get('/logout', function (req, res) { // logout get kérés esetén a session bontása
req.session.destroy(function (err) { 
  if (err) throw err;
  else {
  res.redirect('/');
  }
})
})
//-------------------MAIN navigáció-----------------
//Home esetén
app.get('/home',function (req, res) {
if (req.session.loggedIn) { // be van jelentkezve?




  connection.query("CALL GetLast5Test(?)", [req.session.username], function(err, result, fields) {
    if (err) throw err;
      connection.query("CALL GetLast5Process(?)", [req.session.username], function(err, result2, fields) {
        if (err) throw err;
        connection.query("CALL GetTestCount(?)", [req.session.username], function(err, result3, fields) {
          if (err) throw err;
          connection.query("CALL GetProcessCount(?)", [req.session.username], function(err, result4, fields) {
            if (err) throw err;
            connection.query("CALL GetQuestionCount(?)", [req.session.username], function(err, result5, fields) {
              if (err) throw err;
              connection.query("CALL GetFullFilledCountByUser(?)", [req.session.username], function(err, result6, fields) {
                res.render('main.ejs',{page: 'home', userData: req.session.userData, loggedIn: true, test_data: result, process_data: result2, testCount: result3, processCount: result4, questionCount: result5, fullfilledCount: result6, username: req.session.username, status: req.query.status, title: 'Kezdőlap'}); // ebben az esetben a main.ejs sablonban a home.ejs nyílik meg
            })
          })
        })
      })
    })
  })
    









} else {
  res.redirect('/');
}
})


//Test_create esetén
app.get('/test/create',function (req, res) {
  if (req.session.loggedIn) { // be van jelentkezve?
    res.render('main.ejs',{page: 'test_create', userData: req.session.userData, test_name: 'Teszt cím példa', loggedIn: true, username: req.session.username, title: 'Teszt létrehozása'});
  } else {
    res.redirect('/');
  }
  })

//Test_create esetén
app.get('/test/profile',function (req, res) {
  if (req.session.loggedIn) { // be van jelentkezve?
    connection.query("CALL GetUserData(?)", [req.session.username], function(err, result, fields) {
      if (err) throw err;
      if (!result[0].length <= 0) {
        res.render('main.ejs',{page: 'test_profile', userData: req.session.userData, loggedIn: true, username: req.session.username, user_data: result, title: 'Profiladatok módosítása'});
      } else {
        //nem létezik a felhasználó
      }
   })
  } else {
    res.redirect('/');
  }
  })
// -------------------------EZ A TEST JOIN MAJD TÖRLENDŐ--------------------------
  app.get('/test/join',function (req, res) {
    res.render('test_join.ejs');
      })
    

//Kategóriák
app.get('/test/category',function (req, res) {
  if (req.session.loggedIn) { // be van jelentkezve?
      // kategóriák lekérdezése az adatbázisból
      connection.query("CALL GetAllCategorys(?)", [req.session.username], function(err, result, fields) {
        if (err) throw err;
        if (!result[0].length <= 0) {
          //const resultok = Object.values(JSON.parse(JSON.stringify(result)));
          console.log(result);
          console.log("Hossz:" + result[0].length);
          res.render('main.ejs',{page: 'test_category', userData: req.session.userData, data: result, loggedIn: true, username: req.session.username, status: req.query.status, maincatid: req.query.maincatid, title: 'Kategóriák'});
        } else {
          res.render('main.ejs',{page: 'test_category', userData: req.session.userData, data: result, loggedIn: true, username: req.session.username, status: '4', maincatid: req.query.maincatid, title: 'Kategóriák'});
        }
     })
  } else {
      res.redirect('/');
  } 
  })


  //Eredmények
app.get('/test/results',function (req, res) {
  var status = 0; //alapállapot
  if (req.session.loggedIn) { // be van jelentkezve?
    var test_results; // eredmények
    var test_info; //egyéb tesztinfók
    var process_id = req.query.process_id;
    if (process_id != undefined) {   
      console.log(process_id);
      //a tesztfolyamat a felhasználóhoz tartozik?
      connection.query("CALL GetProcessByIDnUser(?,?)", [req.session.username, process_id], function(err, result, fields) {
        if (err) throw err;
        //ha van visszatérő eredmény
        if (!result[0].length <= 0) {
          test_info = result;
          //ha valamelyik vizsgamódban fut
          if ((result[0][0].mode == 2) || (result[0][0].mode == 3)) {
            console.log(result[0][0].mode);
            connection.query("CALL GetResultsByProcessID(?)", [process_id], function(err, result, fields) {
              if (err) throw err;
              test_results = result;
              redirect(5); //minden rendben, megvannak az eredmények
            })              
          } else {redirect(4); } //nem vizsgamódban fut a tesztfolyamat
        } else { redirect(3); } //nem létezik a tesztfolyamat vagy nem hozzá tartozik
     }) 
    } else { redirect(2); } //nincs process_id parameter
  } else { redirect(1); } //nincs bejelentkezve
  console.log("Ez a statuskód: "+status);

  function redirect(status) {
    switch (status) {
    case 5: res.render('main.ejs',{page: 'test_results', userData: req.session.userData, test_results: test_results, test_info: test_info, loggedIn: true, username: req.session.username, status: req.query.status, title: 'Eredmények'});
    break;

    default: res.redirect('/');
    break;
  }}
})

//Aktív tesztek esetén
app.get('/test/process',function (req, res) {
if (req.session.loggedIn) { // be van jelentkezve?

  connection.query("CALL GetAllProcess(?)", [req.session.username], function(err, result, fields) {
    if (err) throw err;
    connection.query("CALL GetFullfilledCountPerProcessByUser(?)", [req.session.username], function(err, result2, fields) {
      res.render('main.ejs',{page: 'test_process', userData: req.session.userData, process_data: result, fullfilledCount: result2,  loggedIn: true, username: req.session.username, pincode: req.query.pincode, title: 'Tesztfolyamatok'});
    })

    })
} else {
  res.redirect('/');
} 
})
//Teszt bank
app.get('/test/bank',function (req, res) {
  if (req.session.loggedIn) { // be van jelentkezve?
    // tesztek lekérdezése az adatbázisból username alapján
    connection.query("CALL GetAllTest(?)", [req.session.username], function(err, result, fields) {
    if (err) throw err;
    if (!result[0].length <= 0) {
      //const resultok = Object.values(JSON.parse(JSON.stringify(result)));
      console.log(result);
      console.log("Hossz:" + result[0].length);
      connection.query("CALL GetAllProcess(?)", [req.session.username], function(err, result2, fields) {
      if (err) throw err;
      var noprocess = true; //inicializáljuk úgy, hogy nem létezik teszt folyamat
      if (!result2[0].length <= 0) {
      noprocess = false; //létezik folyamat az adott tesztből
      }
      console.log('Noprocess értéke: '+noprocess)
      console.log(result2[0]);
      res.render('main.ejs',{page: 'test_bank', userData: req.session.userData, test_data: result, noprocess: noprocess, process_data: result2, loggedIn: true, username: req.session.username, test_id: req.query.test_id, pincode: req.query.pincode, status: req.query.status, pincode: req.query.pincode, fullcat: req.query.fullcat, title: 'Tesztbank'});
      })
    } else { //nincs egyetlen teszt sem...
    res.render('main.ejs',{page: 'test_bank', userData: req.session.userData, test_data: result, loggedIn: true, username: req.session.username, test_id: req.query.test_id, pincode: req.query.pincode, status: req.query.status, fullcat: req.query.fullcat, title: 'Tesztbank'});
    }
    })
  } else {
  //nincs bejelentkezve
  res.redirect('/');
  } 
})


//Login esetén
app.get('/login',function (req, res) {
  if (req.session.loggedIn) { // be van jelentkezve?
      res.render('main.ejs',{page: 'home', userData: req.session.userData, loggedIn: true, username: req.session.username});
  } else {
      res.render('main.ejs', {page: 'login', loggedIn: false, title: 'Bejelentkezés'}); //Login betöltése
  } 
  })

//IDEIGLENES HOME2 (RÉGI TESZT ÖSSZEÁLLÍTÁS)
app.get('/home2',function (req, res) {
  if (req.session.loggedIn) { // be van jelentkezve?
      res.render('main.ejs',{page: 'home2', loggedIn: true, username: req.session.username});
  } else {
      res.render('main.ejs', {page: 'login', loggedIn: false, title: 'Bejelentkezés'}); //Login betöltése
  } 
  })

//Signup esetén
app.get('/signup',function (req, res) {
if (req.session.loggedIn) { // be van jelentkezve?
  res.redirect('/home');
} 
else {
  res.render('main.ejs', {page: 'signup', loggedIn: false, title: 'Regisztráció'}); //Regisztrációs oldal betöltése
} 
})

//-------------------------------------------------------POST kérések kezelése-----------------------------------------------------------

app.post('/joinTest',function (req, res) { //------------------------------------MÉG NINCS VIZSGÁLVA A LEJÁRATI DÁTUM--------------------------------------------------
    var pincode = req.body.pincode;
    var attemptId;
    var status = 0; //alapértelmezetten nincs hiba, ezért 0
    if (req.session.loggedIn) {
      // var username = req.session.username;
      // connection.query("CALL GetResultsAttemptIdByUsernPincode", function(err, result, fields) {
      
      // })


    }
    //Lekérek egy azonosítót, ami az attempt_id lesz (csak, ha beléphet a felhasználó gyorsbelépéssel vagy bejelentkezve)
      // connection.query("CALL GetRandomNonExistentAttemptId", function(err, result, fields) {
      //   if (err) throw err;
      //   attemptId = result[0][0].attemptId;
      // }) 

    connection.query("CALL GetProcessByPincode(?)", [pincode], function(err, result, fields) {
  
      if (!result[0].length <= 0) {
        var process_id = result[0][0].process_id;
        if (req.session.loggedIn) {
  
          var username = req.session.username;
          console.log(username);
          var userid = req.session.userid;
          status = 6; //belépés regisztrált felhasználóként
        } else {
          var nickname = req.body.nickname;
          if (result[0][0].mode == 0 || result[0][0].mode == 1) {//ha a pinhez tartozó tesztfolyamat módja 0 (gyakorlási) vagy 1 (tantermi)
            status = 5; //beléphet a tesztbe
          } else {
            status = 1; //hiba: létezik a pinkód, de a teszt módja nem engedélyezi a gyors belépést
          }
        }

      } else {
        status = 2; //hiba: nem létezik a pinkód, így a belépés sem engedélyezett (nincs hova belépni)
      }
      connection.query("CALL GetRandomNonExistentAttemptId", function(err, result2, fields) {
        attemptId = result2[0][0].attemptId;
            switch(status) {
              
              case 5:
                res.render('test_join.ejs',{userData: req.session.userData, 'access': true, 'fastjoin': true, 'pincode': pincode, 'mode': result[0][0].mode, 'attempt_id': attemptId, 'process_id': result[0][0].process_id, 'test_id': result[0][0].test_id, 'owner': result[0][0].u_id, 'test_name': result[0][0].test_name, 'userid': null,  'nickname': nickname});  //elküldjük, hogy engedélyezett a csatlakozás és mellé a pinkódot    
                break;
              case 6:
                if (result[0][0].mode == 2 || result[0][0].mode == 3) { // ha a mód valamelyik vizsgamód egyike
                    connection.query("CALL GetResultsAttemptIdByUsernProcessId(?,?)",[username, process_id], function(err, result3, fields) { //megnézzük, hogy van -e már megkezdett kitöltése
                      if (!result3[0].length <= 0) { //ha van, akkor megnézzük, hogy befejezte-e már a tesztet (hányadik kérdésnél tart)
                        console.log(result3[0][0].answer_number+ " és "+result[0][0].question_num);
                        if (result3[0][0].answer_number == result[0][0].question_num-1) { //az utolsó leadott válasz száma egyenlő az utolsó kérdés számával a tesztből, tehát befejezte
                          //jelezni kell, hogy nincs tovább status=7
                          status=7;
                          res.redirect('/home?status=' + (status));
                      } else {
                        //még nem fejezte be, de már elkezdte
                        attemptId = result3[0][0].attempt_id; //megváltoztatjuk az attemptId változó értékét a már korábban elkezdettekre
                        //átadjuk, hogy hol tart jelenleg
                        var courrentQuestion = result3[0][0].answer_number;
                        console.log('AZ AKTUÁLIS FELADAT ÉRTÉKE: '+courrentQuestion);
                        res.render('test_join.ejs',{userData: req.session.userData, 'access': true, 'fastjoin': false, 'pincode': pincode, 'mode': result[0][0].mode, 'attempt_id': attemptId, 'process_id': result[0][0].process_id, 'test_id': result[0][0].test_id, courrentQuestion: courrentQuestion,  'username': username, 'userid': userid,  'owner': result[0][0].u_id, 'test_name': result[0][0].test_name, 'nickname': null}); //bejelentkezett felhasználó esetében   
                        //mehet tovább
                      }
                    } else { //nem kezdte még el, mehet a teszt 
                      //új teszt
                      //minden megy rendesen
                      res.render('test_join.ejs',{userData: req.session.userData, 'access': true, 'fastjoin': false, 'pincode': pincode, 'mode': result[0][0].mode, 'attempt_id': attemptId, 'process_id': result[0][0].process_id, 'test_id': result[0][0].test_id, courrentQuestion: '0', 'username': username, 'userid': userid,  'owner': result[0][0].u_id, 'test_name': result[0][0].test_name, 'nickname': null}); //bejelentkezett felhasználó esetében   
                    } 
                  })
                } else {//bejelentkezett felhasználó és gyakorló vagy tantermi módban van a tesztfolyamat
                  res.render('test_join.ejs',{userData: req.session.userData, 'access': true, 'fastjoin': false, 'pincode': pincode, 'mode': result[0][0].mode, 'attempt_id': attemptId, 'process_id': result[0][0].process_id, 'test_id': result[0][0].test_id, 'username': username, 'userid': userid,  'owner': result[0][0].u_id, 'test_name': result[0][0].test_name, 'nickname': null}); //bejelentkezett felhasználó esetében   
                }
               break;
              default:
                if (req.session.loggedIn) { res.redirect('/home?status=' + (status)); } else { res.redirect('/?status=' + (status));}
            }
    }) 
    })
    })

//Teszt létrehozása
app.post('/createTest',function (req, res) {
  var userid = req.session.userid;
  var test_name = req.body.test_name;
  var sub_category = req.body.sub_category_nt;
  var valid = req.body.autoValidationCheck;
  if (valid != "1") {valid = 0};
  console.log("VALID ÉRTÉKE: "+valid);

  if (req.session.loggedIn) { // be van jelentkezve?
    
    connection.query("CALL CreateTest(?,?,?)", [userid, test_name, valid], function(err, result, fields) {
      // if (err) throw err;
      if (!result[0].length <= 0) {
        var test_id = result[0][0].test_id;
        console.log(result[0]);
        //a létrehozott test ID -t visszakapjuk
        connection.query("CALL CreateCategoryRelation(?,?)",[test_id, sub_category], function(err, result, fields) {
            // if (err) throw err;
            //megnyitjuk a tesztösszeállító oldalt, és átadjuk a létrehozott test ID -jét
            res.render('main.ejs',{page: 'test_create', userData: req.session.userData, loggedIn: true, username: req.session.username, test_id: test_id, test_name: test_name, valid: valid});
            console.log(result);
        })
      } else {
        //nincs visszakapott test ID, így valami probléma történt..
      }
  })
  } else {
    //nincs bejelentkezve az illető
  }
})

app.post('/duplicateTest',function (req, res) {
  var userid = req.session.userid;
  var username = req.session.username;
  var test_id = req.body.test_id_dt;
  var test_name = req.body.test_name_dt;
  var cat_id = req.body.cat_id_dt;

  if (req.session.loggedIn) { // be van jelentkezve?
    //
    
    connection.query("CALL GetTestByIDnUser(?,?)", [username, test_id], function(err, result, fields) {
      if (err) throw err;
      if (!result[0].length <= 0) { 
        connection.query("CALL DuplicateTest(?,?,?)", [test_name, test_id, cat_id], function(err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.redirect('/test/bank');
        })
      } else {  
        //nem tartozik ilyen teszt azonosító a felhasználóhoz
      }
    })

  } else {
    //nincs bejelentkezve az illető
  }
})

app.post('/renameCat',function (req, res) {
  var userid = req.session.userid;
  var cat_id = req.body.cat_id_rc; //ez lehet alkategória és főkategória azonosító is egyaránt
  var maincat_id = req.body.maincat_id_rc; //ez továbbra is csak amiatt kell, hogy le lehessen nyitni a főkategóriát az oldalfrissítés után
  var cat_name = req.body.catname;

  if (req.session.loggedIn) { // be van jelentkezve?
    //
        connection.query("CALL RenameCategory(?,?,?)", [cat_id, cat_name, userid], function(err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.redirect('/test/category?maincatid='+ (maincat_id)); 
        })


  } else {
    //nincs bejelentkezve az illető
  }
})

app.post('/deleteSubCat',function (req, res) {
  var userid = req.session.userid;
  var subcat_id = req.body.subcat_id_ds;
  var maincat_id = req.body.maincat_id_ds;

  if (req.session.loggedIn) { // be van jelentkezve?
    //
  
        connection.query("CALL DeleteSubCat(?,?)", [subcat_id, userid], function(err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.redirect('/test/category?maincatid='+ (maincat_id)); 
        })


  } else {
    //nincs bejelentkezve az illető
  }
})

app.post('/deleteMainCat',function (req, res) {
  var userid = req.session.userid;
  var maincat_id = req.body.maincat_id_dm;

  if (req.session.loggedIn) { // be van jelentkezve?
    //
  
        connection.query("CALL DeleteMainCat(?,?)", [maincat_id, userid], function(err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.redirect('/test/category?maincatid='+ (maincat_id)); 
        })


  } else {
    //nincs bejelentkezve az illető
  }
})

app.post('/deleteAccount',function (req, res) {
  var username = req.session.username;
  if (req.session.loggedIn) { // be van jelentkezve?
    //
    connection.query("CALL DeleteUser(?)", [username], function(err, result, fields) {
      if (err) throw err;
      req.session.destroy();
      res.redirect('/');
    })
  } else {
    //nincs bejelentkezve az illető
  }
})

app.post('/deleteTest',function (req, res) {
  var userid = req.session.userid;
  var username = req.session.username;
  var test_id = req.body.test_id_delt;

  if (req.session.loggedIn) { // be van jelentkezve?
    //
    
    connection.query("CALL GetTestByIDnUser(?,?)", [username, test_id], function(err, result, fields) {
      if (err) throw err;
      if (!result[0].length <= 0) { 
        connection.query("CALL DeleteTest(?)", [test_id], function(err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.redirect('/test/bank');
        })
      } else {  
        //nem tartozik ilyen teszt azonosító a felhasználóhoz
        res.redirect('/test/bank');
      }
    })

  } else {
    //nincs bejelentkezve az illető
  }
})

app.post('/moveTest',function (req, res) {
  var username = req.session.username;
  var test_id = req.body.test_id_mt;
  var cat_id = req.body.cat_id_mt;

  if (req.session.loggedIn) { // be van jelentkezve?
    //
    
    connection.query("CALL GetTestByIDnUser(?,?)", [username, test_id], function(err, result, fields) {
      if (err) throw err;
      if (!result[0].length <= 0) { 
        connection.query("CALL MoveTest(?,?)", [test_id, cat_id], function(err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.redirect('/test/bank');
        })
      } else {  
        //nem tartozik ilyen teszt azonosító a felhasználóhoz
      }
    })

  } else {
    //nincs bejelentkezve az illető
  }
})

app.post('/renameTest',function (req, res) {
  var userid = req.session.userid;
  var username = req.session.username;
  var test_id = req.body.test_id_rt;
  var test_name = req.body.test_name_rt;

  if (req.session.loggedIn) { // be van jelentkezve?
    //
    
    connection.query("CALL GetTestByIDnUser(?,?)", [username, test_id], function(err, result, fields) {
      if (err) throw err;
      if (!result[0].length <= 0) { 
        connection.query("CALL RenameTest(?,?)", [test_id, test_name], function(err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.redirect('/test/bank');
        })
      } else {  
        //nem tartozik ilyen teszt azonosító a felhasználóhoz
      }
    })

  } else {
    //nincs bejelentkezve az illető
  }
})

//A kiválasztott tesztből egy folyamat létrehozása
app.post('/createTestProcess',function (req, res) {
  var username = req.session.username;
  var test_id = req.body.test_id;
  var mode = req.body.mode;
  var start_date = req.body.start_date;
  var end_date = req.body.end_date;
  var classification = req.body.classification;

  if (classification == "disabled") {classification = null};

  console.log("Username: "+username+" Test_ID: "+test_id);
  if (req.session.loggedIn) { // be van jelentkezve?
    // megvizsgáljuk, hogy egyáltalán tartozik -e ilyen azonosítószámú teszt a felhasználóhoz a GetTestByUsernTest tárolt eljárással
    connection.query("CALL GetTestByIDnUser(?,?)", [username, test_id], function(err, result, fields) {
      if (err) throw err;
      if (!result[0].length <= 0) {
        //létezik a teszt és a felhasználóhoz tartozik
        //kérünk egy pinkódot, ami még nem létezik
        connection.query("CALL GetRandomNonExistentPincode", function(err, result, fields) {
            if (err) throw err;
            var pincode = result[0][0].Pincode;
              //létrehozzuk a folyamatot
            connection.query("CALL CreateProcess(?,?,?,?,?,?)",[test_id, mode, pincode, start_date, end_date, classification], function(err, result, fields) {
              if (err) throw err;


            })
            //elküldjük a pinkódot
            console.log(result);
            res.redirect('/test/bank?pincode='+result[0][0].Pincode+'&test_id='+test_id);
        })
      } else {
        //a teszt vagy nem létezik vagy nem az adott felhasználóhoz tartozik
      }
  })
  } else {
    //nincs bejelentkezve az illető
  }
})

app.post('/deleteTestProcess',function (req, res) {
  var userid = req.session.userid;
  var username = req.session.username;
  var process_id = req.body.process_id_dp;
  var page = req.body.page_dp;

  if (req.session.loggedIn) { // be van jelentkezve?
    //
    
    connection.query("CALL GetProcessByIDnUser(?,?)", [username, process_id], function(err, result, fields) {
      if (err) throw err;
      if (!result[0].length <= 0) { 
        connection.query("CALL DeleteProcess(?)", [process_id], function(err, result, fields) {
          if (err) throw err;
          console.log(result);
          // res.redirect(req.get('referer'));
          // res.redirect(req.originalUrl);
          res.redirect(page);
        })
      } else {  
        //nem tartozik ilyen tesztfolymaat azonosító a felhasználóhoz
        res.redirect(page);
      }
    })

  } else {
    //nincs bejelentkezve az illető
  }
})

//Főkategória létrehozása
app.post('/newMainCategory',function (req, res) {
  var username = req.session.username;
  var userid = req.session.userid;
  var maincatname = req.body.maincat_name;
  var status = 0; //eredmény státuszának kódja

  console.log("Kategória neve: " + maincatname + " Felhasználó id: " + userid)
  if (req.session.loggedIn) { // be van jelentkezve?
    connection.query("CALL GetMainCategorys(?)", [username], function(err, result, fields) {
      if (err) throw err;
      if (result[0].length == 0) { //Még egyetlen főkategória sincs, úgy hogy azonnal létre lehet hozni
        status = 0;
        connection.query("INSERT INTO test_category_names (u_id, name) VALUES (" + connection.escape(userid) + ", " + connection.escape(maincatname) +")",
        function(err, result, fields) {
          if (err) throw err;
          else status = 0; //sikeres volt
        })
      } else { //Már tartozik főkategória a felhasználóhoz, így ellenőrizni kell, hogy a létrehozandó már létezik -e
          //Egy do-while fügvény végig megy a főkategóriákon, és megnézi, hogy van -e már a beírttal azonos
          var cat_exists = false;
          var i = 0;
          do {
            if (result[0][i].name == maincatname) {cat_exists = true;}
            i = i + 1;
          } while ((cat_exists == false) && (i < result[0].length));
          
          if (!cat_exists) { //Ha nem létezik, akkor létre lehet hozni
            connection.query("INSERT INTO test_category_names (u_id, name) VALUES (" + connection.escape(userid) + ", " + connection.escape(maincatname) +")",
            function(err, result, fields) {
              if (err) throw err;
              else status = 0; //sikeres volt
            })
          } else { //Ha létezik, akkor hibaüzenettel jelezzük a felhasználónak
          status = 1; //létezik már a kategória
            }
        } 
        res.redirect('/test/category?status=' + (status));
  })

  } else { //nincs bejelentkezve az illető
    res.redirect('/');
  }
})


//Alkategória létrehozása
app.post('/newSubCategory',function (req, res) {
  var username = req.session.username;
  var userid = req.session.userid;
  var subcatname = req.body.subcatname;
  var maincatid = req.body.maincat_id_ns;
  var status = 2; //eredmény státuszának kódja (alapértelmezetten sikeres)


  if (req.session.loggedIn) { // be van jelentkezve?
    connection.query("CALL GetSubCategorys(?)", [username], function(err, result, fields) {
      if (err) throw err;
      if (result[0].length == 0) { //Még egyetlen alkategória sincs, úgy hogy azonnal létre lehet hozni
        connection.query("INSERT INTO test_category_names (u_id, name, parent) VALUES (" + connection.escape(userid) + ", " + connection.escape(subcatname) + ", " + connection.escape(maincatid) + ")",
        function(err, result, fields) {
          if (err) throw err;
          else status = 2; //sikeres volt
        })
      } else { //Már tartozik alkategória a felhasználóhoz, így ellenőrizni kell, hogy a létrehozandó már létezik -e
          //Egy do-while fügvény végig megy az alkategóriákon, és megnézi, hogy van -e már a beírttal azonos
          var cat_exists = false; //alapértelmezetten false
          var i = 0;
          do {
            if (result[0][i].name == subcatname && result[0][i].parent == maincatid) {cat_exists = true;}
            i = i + 1;
          } while ((cat_exists == false) && (i < result[0].length));
          
          if (!cat_exists) { //Ha nem létezik, akkor létre lehet hozni
            connection.query("INSERT INTO test_category_names (u_id, name, parent) VALUES (" + connection.escape(userid) + ", " + connection.escape(subcatname) + ", " + connection.escape(maincatid) + ")",
            function(err, result, fields) {
              if (err) throw err;
              else status = 2; //sikeres volt
            })
          } else { //Ha létezik, akkor hibaüzenettel jelezzük a felhasználónak
          status = 3; //létezik már a kategória
            }
        }
        res.redirect('/test/category?status=' + (status) + '&maincatid='+ (maincatid)); 
  })

  } else { //nincs bejelentkezve az illető
    res.redirect('/');
  }
})

// Gyökérre való post esetén (bejelentkezés)
app.post('/', function(req, res) {
  var username = req.body.username; // felhasználónév, jelszó lekérés a postból
  var password = req.body.password;
  var status = 0;

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
          var userid = result[0].uid;
          var result = bcrypt.compareSync(password, result[0].password); //szinkron módban hasonlítjuk össze
          if (result) { //ha a tárolt jelszó hash és a beírt jelszó hash egyezik..

              console.log("Sikeres bejelentkezés: "+username);
              req.session.loggedIn = true; // a sessionban a loggedIn bool mostantól igaz értékű lesz
              req.session.username = username; // username bekerül a sessionba
              req.session.userid = userid; // userid szintén bekerül

              connection.query("CALL GetUserData(?)", [req.session.username], function(err, result, fields) {
                if (err) throw err;
                req.session.userData = result;
                res.redirect('/home'); //minden rendben, így be lehet jelentkeztetni a felhasználót
              })

              console.log(req.session);

          } else { 
              status = 3; //nem egyezik a két jelszó..
              console.log("Hibás jelszó: "+username);
              console.log(result);
          } 
        // res.render('dashboard.ejs',{username: result[0].username });
          } else { // ha nem lenne visszatérő érték az sql -ből, akkor a kezdőlapra irányítás
            status = 4; //nem létezik a felhasználónév
            console.log(result);
            console.log("Nem létező felhasználónév: "+username);
        }
              //itt közöljük hiba esetén a státusz kód segítségével a problémát
     if (status != 0) res.redirect('/?status='+status);
      }
  });
});

// Signup post esetén
app.post('/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var passwordc = req.body.passwordc;
  var gender = req.body.gender;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var title = req.body.title;
  var email = req.body.email;
  var eduid = req.body.eduid;


  if ((password == passwordc) && (password != "") && (passwordc != "") && (email != ""))  { //backend ellenőrzések (EZT MÉG KI KELL EGÉSZÍTENI!!!)
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
                  connection.query("INSERT INTO users (username, password, email, title, firstname, lastname, gender, eduid) VALUES (" + connection.escape(username) + ", " + connection.escape(password) + ", " + connection.escape(email) + ", " + connection.escape(title) + ", " + connection.escape(firstname) + ", " + connection.escape(lastname) + ", " + connection.escape(gender) + ", " + connection.escape(eduid) + ")",
                  function(err, result, fields) {
                    if (err) throw err;  
                  else res.render('main.ejs', {page: 'login', loggedIn: false, success: true});
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

// Signup post esetén
app.post('/editProfile', function(req, res) {
  var username = req.session.username;
  var password = req.body.password_ep;
  var passwordc = req.body.passwordc_ep;
  var gender = req.body.gender_ep;
  var firstname = req.body.firstname_ep;
  var lastname = req.body.lastname_ep;
  var title = req.body.title_ep;
  var email = req.body.email_ep;


  if ((password == passwordc) && (password !== '') && (password !== null) && (password !== undefined)) { //backend ellenőrzések (EZT MÉG KI KELL EGÉSZÍTENI!!!)
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function(err, hash) {// hashelés
    password = hash;
    console.log('KIBASZOTT QUERY: '+"UPDATE users SET password="+connection.escape(password)+", email="+connection.escape(email)+", title="+connection.escape(title)+", firstname="+connection.escape(firstname)+", lastname="+connection.escape(lastname)+", gender="+connection.escape(gender)+" WHERE users.username = "+ connection.escape(username)+"")
    console.log("JELSZÓ: "+password)
    connection.query("UPDATE users SET password="+connection.escape(password)+", email="+connection.escape(email)+", title="+connection.escape(title)+", firstname="+connection.escape(firstname)+", lastname="+connection.escape(lastname)+", gender="+connection.escape(gender)+" WHERE users.username = "+ connection.escape(username)+"",
    function(err, result, fields) {
    if (err) throw err;  
      connection.query("CALL GetUserData(?)", [req.session.username], function(err, result, fields) {
        if (err) throw err;
        req.session.userData = result;
        res.redirect('/home'); //minden rendben, így be lehet jelentkeztetni a felhasználót
      })
    })
    }) 
  } else {
    
    connection.query("UPDATE users SET email="+connection.escape(email)+", title="+connection.escape(title)+", firstname="+connection.escape(firstname)+", lastname="+connection.escape(lastname)+", gender="+connection.escape(gender)+" WHERE users.username = "+ connection.escape(username)+"",
    function(err, result, fields) {
    if (err) throw err; 
    connection.query("CALL GetUserData(?)", [req.session.username], function(err, result, fields) {
      if (err) throw err;
      req.session.userData = result;
      res.redirect('/home'); //minden rendben, így be lehet jelentkeztetni a felhasználót
    })
    })
  };
});

//Ezt hívja meg az AJAX a regisztráció során
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
//Ezt hívja meg az AJAX a főkategóriák és alkategóriák betöltéséhez
app.post('/getCategorys',function (req, res) {
  var username = req.session.username;

  if (req.body.target == 'main') {
    connection.query("CALL GetMainCategorys(?)", [username], function(err, result, fields) {
      if (err) throw err;
      if (result[0].length > 0) {
        var exists = true;
      } else {
        var exists = false;
      }
        res.json({exists: true, data: result})
    })
  }

  if (req.body.target == 'sub') {
    connection.query("CALL GetSubCategorys(?)", [username], function(err, result, fields) {
      if (err) throw err;
      if (result[0].length > 0) {
        var exists = true;
      } else {
        var exists = false;
      }
        res.json({exists: true, data: result})
    })
  }

})

app.post('/printTest',function (req, res) {
  var userid = req.session.userid;
  var username = req.session.username;
  var test_id = req.body.test_id_pt;
  var print_test_name = req.body.print_test_name; // ha 0, akkor ne legyenek rajta a teszt neve, ha 1, akkor legyen
  var print_points = req.body.print_points; // ha 0, akkor ne legyenek rajta a pontszámok, ha 1, akkor legyenek
  

  if (req.session.loggedIn) { // be van jelentkezve?
    //
    
    connection.query("CALL GetTestByIDnUser(?,?)", [username, test_id], function(err, result, fields) { //hozzá tartozik egyáltalán a teszt?
      if (err) throw err;
      if (!result[0].length <= 0) { 
        //--------------------------------------------------------------ide jöhet az a kód, amivel pdf -et generálsz!------------------------------------------------------------------------

        res.redirect('/test/bank'); //
      } else {  
        //nem tartozik ilyen teszt azonosító a felhasználóhoz
        res.redirect('/test/bank?status=1');
      }
    })

  } else {
    //nincs bejelentkezve az illető
  }
})

app.post('/editTest',function (req, res) {
  var userid = req.session.userid;
  var username = req.session.username;
  var test_id = req.body.test_id_et;

  if (req.session.loggedIn) { // be van jelentkezve?
    connection.query("CALL GetTestByIDnUser(?,?)", [username, test_id], function(err, result, fields) { //hozzá tartozik egyáltalán a teszt?
      if (err) throw err;
      if (!result[0].length <= 0) { 
        var test_name = result[0][0].test_name;
        var valid = result[0][0].valid_int;
        console.log(result[0][0])
        res.render('main.ejs',{page: 'test_create', userData: req.session.userData, loggedIn: true, username: req.session.username, test_id: test_id, test_name: test_name, valid: valid});
        console.log('VALID ÉRTÉKE 2:' +valid);
      } else {  
        //nem tartozik ilyen teszt azonosító a felhasználóhoz
        res.redirect('/test/bank?status=1');
      }
    })

  } else {
    //nincs bejelentkezve az illető
  }
})

//--------------------------------------MAIN NAVIGÁCIÓ--------------------------------------------
//A main -ra érkező postok alapján tölti be az oldal a megfelelő tartalmat (ejs fájlokat) ajax segítségével
//A lényege, hogy a header és a footer így nem kerül mindig betöltésre az oldalon történő navigáció során
//----------------------------EZ AZ EGÉSZ IDEIGLENESEN KIKAPCSOLVA--------------------------------
// app.post('/main',function (req, res) {
//   if (req.body.page == 'home') {
//     if (req.session.loggedIn) { //Bejelentkezés itt is szükséges
//       var page = req.body.page;
//       res.render('home.ejs',{});//Itt azért nem kerül elküldésre újra a username, mert az már az első get kérés során elment!
//     }
//   }
//   if (req.body.page == 'login') {
//     if (!req.session.loggedIn) {
//       var page = req.body.page;
//       res.render('login.ejs',{});
//     }
//   }
//   if (req.body.page == 'test_bank') {
//     if (req.session.loggedIn) {
//       var page = req.body.page;
//       res.render('test_bank.ejs',{});
//     }
//   }
//   if (req.body.page == 'test_category') {
//     if (req.session.loggedIn) {
//       res.render('test_category.ejs',{});

//       //kategóriák lekérdezése az adatbázisból
//       connection.query("call GetCategorys(?)", [req.session.username], function(err, result, fields) {
//         if (err) throw err;
//         res.render('test_category.ejs',{data: 'alma'});
//       })

//       //res.render('test_category.ejs',{});
//     }
//   }
//   if (req.body.page == 'test_active') {
//     if (req.session.loggedIn) {
//       var page = req.body.page;
//       res.render('test_active.ejs',{});
//     }
//   }
//   if (req.body.page == 'signup') {
//     if (!req.session.loggedIn) {
//       var page = req.body.page;
//       res.render('signup.ejs',{});
//     }
//   }
// })

//-----------------------------------------------------------chart-----------------------------------------------------------//

// chart data reqest
app.post('/chart', function (req, res) {
  var test = req.body.chart;
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
        res.json(json);
    });
}
});
});
app.use(fileUpload({ fileSize: 5 * 1024 * 1024 , responseOnLimit: 'File size limit has been reached', abortOnLimit: true, safeFileNames: true, preserveExtension: true }));


// scores data reqest
app.post('/scores', function (req, res) {
  var test = JSON.parse(req.body.scores);
  var json;
  var val = [];
  test.forEach(element => {
    var sql = "SELECT COUNT (*) as 'db' FROM test_results WHERE process_id="+connection.escape(element[0])+ "";
      connection.query(sql, function (err, result) {
          if (err) throw err;
          json = JSON.parse(JSON.stringify(result));
          var darab = json[0].db;
        if (darab == 0){
          // res.json("nincs adat");
        }else{
      var sql = "SELECT sum(score) as 'points' FROM test_questions Left JOIN test_results on test_questions.question_number = test_results.answer_number where test_id = "+connection.escape(element[0])+" and nick_name = "+connection.escape(element[1])+" and correct_answer_no = answers ";
      connection.query(sql, function (err, result) {
        if (err) throw err;
        json = JSON.parse(JSON.stringify(result));
        val.push(json); 
    });
    }
  });
});
//elobb lefut mint a sql!!
setTimeout(function(){
  console.log(val)
  res.json(val)
},1000);
});


//-----------------------------------------------------------editor-----------------------------------------------------------//
// pdf
pdfmaker.adat(jsPDF,app,connection,fs);
data_export.exp(fs,app,connection);
result_export.resexp(fs,app,connection);
data_import.imp(fs,app,connection)
email_sender.to(app,nodemailer);

//list post kezelese
app.post('/list', function (req, res) {
  var test = req.body.asd;
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
        res.json(json);
    });
}
});
});



//file upload
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
  console.log("req body", req.body);
  console.log("req.files", req.files);


  var sql = "SELECT COUNT (*) as 'db' FROM test_questions WHERE test_id=" +connection.escape(tippem)+ " and question_number="+connection.escape(elem)+"";
  connection.query(sql, function (err, result) {
      if (err) throw err;
      json = JSON.parse(JSON.stringify(result));
      var darab = json[0].db;
      console.log(darab);
    if (darab == 0){
      var sql = "INSERT INTO test_questions (test_id ,question_number,image) VALUES  ("+connection.escape(tippem)+ ","+connection.escape(elem)+ ","+connection.escape(sqlimg)+ ")";
      connection.query(sql, function (err, result) {
          if (err) throw err;
      });
    }else{
      //van adat
      var sql = "UPDATE test_questions SET image="+connection.escape(sqlimg)+" WHERE test_id=" +connection.escape(tippem)+ " and question_number="+connection.escape(elem)+"";
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

  var sql = "DELETE FROM test_questions WHERE test_id=" +connection.escape(test[0])+ " and question_number="+connection.escape(test[1])+"";
  connection.query(sql, function (err, result) {
    if (err) throw err;
    json = JSON.parse(JSON.stringify(result));
    // var darab = json[0].db;
    res.json(json);
  });
});


//save post kezelese
app.post('/save', function (req, res) {
  var data = JSON.parse(req.body.ment);
  // console.log(data);
let tmp = 0;
data.forEach(element => {
  tmp++;
// console.log(element.test_id + "  --  " + element.question_number );
  var sql = "SELECT COUNT (*) as 'db' FROM test_questions WHERE test_id=" +connection.escape(element.test_id)+ " and question_number="+connection.escape(element.question_number)+"";
  connection.query(sql, function (err, result) {
      if (err) throw err;
      json = JSON.parse(JSON.stringify(result));
      var darab = json[0].db;
      // console.log(darab);
    if (darab == 0){
      // nincs adat
      var sql = "INSERT INTO test_questions (test_id ,question,answer_1 ,answer_2 ,answer_3 ,answer_4 ,question_number, time, score, type, correct_answer_no, image, extra_score, extra_time) VALUES  ("+connection.escape(element.test_id)+ ","+ connection.escape(element.question)  + ","+ connection.escape(element.answer_1)  +  ","+ connection.escape(element.answer_2)  +  ","+ connection.escape(element.answer_3)  + ","+ connection.escape(element.answer_4)  +  "," + connection.escape(element.question_number)+  ","+connection.escape(element.time)+","+connection.escape(element.score)+","+connection.escape(element.type)+","+connection.escape(element.correct_answer_no)+","+connection.escape(element.image)+","+connection.escape(element.extra_score)+","+connection.escape(element.extra_time)+")";
      connection.query(sql, function (err, result) {
          if (err) throw err;
          json = JSON.parse(JSON.stringify(result));
          // res.json(json);
      });
    }else{
      //van adat
      var sql = "UPDATE test_questions SET test_id ="+connection.escape(element.test_id)+",question = ?,answer_1="+connection.escape(element.answer_1)+",answer_2="+connection.escape(element.answer_2)+",answer_3="+connection.escape(element.answer_3)+",answer_4="+connection.escape(element.answer_4)+",question_number="+connection.escape(element.question_number)+",time="+connection.escape(element.time)+",score="+connection.escape(element.score)+",type="+connection.escape(element.type)+",correct_answer_no="+connection.escape(element.correct_answer_no)+", image="+connection.escape(element.image)+ ", extra_score="+connection.escape(element.extra_score)+ ", extra_time="+connection.escape(element.extra_time)+" WHERE test_id=" +connection.escape(element.test_id)+ " and question_number="+connection.escape(element.question_number)+"";
      connection.query(sql,[element.question], function (err, result) {
          if (err) throw err;
          // json = JSON.parse(JSON.stringify(result));
          // res.json(json);
      });
    // res.json(darab);
  };
  });
});

// db count update
var sql = "UPDATE test_list SET question_num ="+connection.escape(tmp)+" where id="+connection.escape(data[0].test_id)+"";
connection.query(sql, function (err, result) {
    if (err) throw err;
});

setTimeout(function(){
  var sql = "UPDATE test_questions SET answer_1 = NULL, answer_2 = NULL, answer_3 = NULL, answer_4 = NULL WHERE answer_1 = ''";
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
  var sql = "UPDATE test_questions SET answer_3 = NULL, answer_4 = NULL WHERE answer_3 = ''";
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
  var sql = "UPDATE test_questions SET answer_4 = NULL WHERE answer_4 = ''";
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
  console.log("Set to null [ok]");
},1000);
res.status(201).end("OK");
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
