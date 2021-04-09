exports.adat = function (app) {
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
}