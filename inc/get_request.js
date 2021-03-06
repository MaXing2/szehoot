exports.adat = function (app) {
    app.get('/ajaxtest',function (req, res) {
        res.render('ajaxtest.ejs',{});
    })
     
    
    // Gyökér esetén
    app.get('/',function (req, res) {
        if (req.session.loggedIn) { // be van jelentkezve? 
        res.render('main.ejs', {page: 'home', loggedIn: true, username: req.session.username}); // ebben az esetben a main.ejs sablonban a home.ejs nyílik meg
        } 
        else
        res.render('main.ejs', {page: 'login', loggedIn: false}); // ha nincs bejelentkezve, akkor pedig a login.ejs
    })

    // Dashboard esetén
    app.get('/dashboard',function (req, res) {
        if (req.session.loggedIn) { // be van jelentkezve?
        res.render('dashboard.ejs',{});
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
//-------------------MAIN navigáció-----------------(Ezek akkor történnek meg, ha linken keresztül hivatkozunk rájuk!)
   //Home esetén
    app.get('/home',function (req, res) {
    if (req.session.loggedIn) { // be van jelentkezve?
        res.render('main.ejs',{page: 'home', loggedIn: true, username: req.session.username});
    } else {
        res.redirect('/');
    }
    })
    //Kategóriák
    app.get('/test_category',function (req, res) {
        if (req.session.loggedIn) { // be van jelentkezve?
            // kategóriák lekérdezése az adatbázisból
            connection.query("call GetCategorys(?)", [req.session.username], function(err, result, fields) {
            if (err) throw err;
            res.render('main.ejs',{page: 'test_category', data: 'alma', loggedIn: true, username: req.session.username});
            })
        } else {
            res.redirect('/');
        } 
        })
    //Aktív tesztek esetén
    app.get('/test_active',function (req, res) {
    if (req.session.loggedIn) { // be van jelentkezve?
        res.render('main.ejs',{page: 'test_active', loggedIn: true, username: req.session.username});
    } else {
        res.redirect('/');
    } 
    })
    //Teszt bank
    app.get('/test_bank',function (req, res) {
        if (req.session.loggedIn) { // be van jelentkezve?
            res.render('main.ejs',{page: 'test_bank', loggedIn: true, username: req.session.username});
        } else {
            res.redirect('/');
        } 
        })
    //Login esetén
    app.get('/login',function (req, res) {
        if (req.session.loggedIn) { // be van jelentkezve?
            res.render('main.ejs',{page: 'home', loggedIn: true, username: req.session.username});
        } else {
            res.render('main.ejs', {page: 'login', loggedIn: false}); //Login betöltése
        } 
        })
    //Signup esetén
    app.get('/signup',function (req, res) {
    if (req.session.loggedIn) { // be van jelentkezve?
        res.render('main.ejs',{page: 'home', loggedIn: true, username: req.session.username});
    } 
    else {
        res.render('main.ejs', {page: 'signup', loggedIn: false}); //Regisztrációs oldal betöltése
    } 
    })
    

    
}