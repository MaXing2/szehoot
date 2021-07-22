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
        var sql = "SELECT test_id ,question,answer_1 ,answer_2 ,answer_3 ,answer_4 ,question_number, time, score, type, image FROM test_questions WHERE test_id=" + con.escape(nam) + " and question_number="+con.escape(kerdes)+"";
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
    socket.on('rogzit', (ertek, gameid, cname,qnumber) => {
        var d = new Date().toISOString().slice(0, 19).replace('T', ' ');
        var sql = "INSERT INTO  test_results  (process_id ,answers, nick_name,ts, answer_number) VALUES (" + con.escape(gameid) +", "+ con.escape(ertek) +", "+ con.escape(cname) + ", " +con.escape(d)+ ", " +con.escape(qnumber)+ ")";
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
        
        //correct_ans_check
        var sql = "SELECT correct_answer_no AS correct , score AS points FROM test_questions WHERE test_id=" + con.escape(gameid) + " and question_number="+con.escape(qnumber)+"";
        con.query(sql, function (err, result) {
            if (err) throw err;
            res = JSON.parse(JSON.stringify(result));
            if (res[0].correct==ertek){
                socket.join(socket.id);                 //TODO!! rooms        
                io.to(socket.id).emit('points', res[0].points);
            }
        });
    });


    //kerdesadatok
    socket.on('stablakerdes', (kod) => {
        var sql = "SELECT COUNT(*) AS question_num FROM test_questions WHERE test_id=" + con.escape(kod) + "";
        con.query(sql, function (err, result) {
            if (err) throw err;
            res = JSON.parse(JSON.stringify(result));
            socket.join(kod);
            var onliNum = io.sockets.adapter.rooms.get(kod).size;
            io.to(kod).emit('tablakerdes', res, onliNum);

            // console.log(Object.keys(io.sockets.server.eio.clientsCount));
            // console.log(Object.keys(io.sockets.adapter));
            // console.log(io.sockets.adapter.rooms);  //szoba adatok
            // console.log(io.sockets.adapter.rooms.get('141450'));
            // console.log(" - - - - - - ");
            // console.log(io.sockets.adapter.rooms.get('141450').size);   // szobaban levo emberek szama
            // console.log(" - - - - - - ");
            // console.log(io.sockets.server.eio.clientsCount); // szam
            // console.log(socket.rooms.size);
        });
    });
    
    
socket.on('disconnect', () => {
    numUser--;
    console.log('one user disconnected ', numUser, ' online user');

});


})


// end of socket.io logic

module.exports = socketapi;