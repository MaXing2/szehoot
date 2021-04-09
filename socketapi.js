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
    socket.on('sgetter', (kerdes) => {
        var sql = "SELECT * FROM test WHERE idtest='" + kerdes + "'";
        con.query(sql, function (err, result) {
            if (err) throw err;
            res = JSON.parse(JSON.stringify(result));
            socket.join('first_room');
            console.log(socket.rooms);
            io.to('first_room').emit('getter', res);
            // io.emit('getter', res);
        });
    });

    // record button push
    socket.on('rogzit', (ertek, nev) => {
        // console.log(ertek);
        //console.log(nev);
        var d = new Date().toISOString().slice(0, 19).replace('T', ' ');
        var sql = "INSERT INTO " + nev + " (valasz, ts) VALUES ('" + ertek + "', '" + d + "')";
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
    });

    socket.on('ujkitoltes', (nev) => {
        var sql = "CREATE TABLE " + nev + " (idtest int AUTO_INCREMENT PRIMARY KEY, valasz int, ts DATETIME)";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table created");
            socket.join('first_room');
        });

    });

    //kerdesadatok
    socket.on('stablakerdes', (kod) => {
        var sql = "SELECT * FROM user_test WHERE tabla_kod='" + kod + "'";
        con.query(sql, function (err, result) {
            if (err) throw err;
            res = JSON.parse(JSON.stringify(result));
            io.emit('tablakerdes', res);
        });
    });
})

// end of socket.io logic

module.exports = socketapi;