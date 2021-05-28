const io = require( "socket.io" )();
const socketapi = {
    io: io
};
var mysql = require ('mysql');
var config = require('./inc/db.js');
var con = mysql.createConnection(config.databaseOptions);

// socket.io logic here!
var numUser = 0;
var res;

//in usage
io.on('connection', socket => {
    numUser++;
    console.log('one user connected ', numUser, ' online user');
    io.emit('online', numUser);

    //send client site main.js
    //socket.emit('message','Hello people');

    // //all exept new one
    // socket.broadcast.emit('massage', 'connected bobby');

    // //after usage
    // socket.on('disconnect', () => {
    //     numUser--;
    //     console.log('user disconnected ', numUser, ' online user');
    //     io.emit('online', numUser);
    // });


    //getter
    socket.on('sgetter', (kerdes,nam) => {
        var sql = "SELECT * FROM test_questions WHERE test_id=" + con.escape(nam) + " and question_number="+con.escape(kerdes)+"";
        con.query(sql, function (err, result) {
            if (err) throw err;
            res = JSON.parse(JSON.stringify(result));
            socket.join(nam);
            console.log(socket.rooms);
            io.to(nam).emit('getter', res);
            // io.emit('getter', res);
        });
    });

    // record button push
    socket.on('rogzit', (ertek, nev) => {
        // console.log(ertek);
        //console.log(nev);
        var d = new Date().toISOString().slice(0, 19).replace('T', ' ');
        var sql = "INSERT INTO  test_results  (test_id ,answers, ts) VALUES (" + con.escape(nev) +", "+ con.escape(ertek) + ", " +con.escape(d)+ ")";
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
    });


    //kerdesadatok
    socket.on('stablakerdes', (kod) => {
        var sql = "SELECT * FROM test_list WHERE test_id=" + con.escape(kod) + "";
        con.query(sql, function (err, result) {
            if (err) throw err;
            res = JSON.parse(JSON.stringify(result));
            socket.join(kod);
            io.to(kod).emit('tablakerdes', res);
        });
    });
})

// end of socket.io logic

module.exports = socketapi;