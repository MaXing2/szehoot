exports.adat = function (app) {
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
}