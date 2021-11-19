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

var userRooms = {}

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
    socket.on('sgetter', (kerdes,nam,gamemode) => {
        var sql = "SELECT test_id ,question,answer_1 ,answer_2 ,answer_3 ,answer_4 ,question_number, time, score, type, image FROM test_questions WHERE test_id=" + con.escape(nam) + " and question_number="+con.escape(kerdes)+"";
        con.query(sql, function (err, result) {
            if (err) throw err;
            res = JSON.parse(JSON.stringify(result));
            socket.join(nam);
            console.log(socket.rooms);

            //send for all in room or just one 
            if (gamemode == 1){
                io.to(nam).emit('getter', res);
            }else{
                io.to(socket.id).emit('getter', res);
            }
        });
    });

    // record button push
    socket.on('rogzit', (ertek, gameid,qnumber,ad,attempt,pond,nick,process_id) => {
        --qnumber;
        var d = new Date().toISOString().slice(0, 19).replace('T', ' ');
        var sql = "INSERT INTO  test_results  (process_id ,answers, u_id,ts, answer_number, nick_name, attempt_id, response_time) VALUES (" + con.escape(process_id) +", "+ con.escape(ertek) +", "+ con.escape(ad) + ", " +con.escape(d)+ ", " +con.escape(qnumber)+ ", " +con.escape(nick)+ ", " +con.escape(attempt)+ ", " +con.escape(pond)+ ")";
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

//pincode translate
    socket.on('scode', (kod) => {
        socket.join(kod); 
        var sql = "SELECT test_id FROM test_process_list WHERE pincode=" + con.escape(kod) + "";
        con.query(sql, function (err, result) {
            if (err) throw err;
            res = JSON.parse(JSON.stringify(result));
            console.log(res);
            console.log(res[0].test_id);
        io.to(kod).emit('code', res[0].test_id);
        });
    });
    
    //kerdesadatok
    socket.on('stablakerdes', (kod) => {
        var sql = "SELECT COUNT(*) AS question_num FROM test_questions WHERE test_id=" + con.escape(kod) + "";
        con.query(sql, function (err, result) {
            if (err) throw err;
            res = JSON.parse(JSON.stringify(result));
            socket.join(kod);
            //joining room counter
            userRooms[socket.id] = kod;
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
    
    socket.on('sonline', (kod) => {
        socket.join(kod); 
        var onliNum = io.sockets.adapter.rooms.get(kod).size;
        io.to(kod).emit('online', onliNum);
    });



    socket.on('sresChart', (actual,pin) => {
        --actual;
        console.log(pin+ "-------" + actual);
        var sqla = "SELECT * FROM test_results WHERE process_id=" + con.escape(pin) + " and answer_number=" + con.escape(actual);
        con.query(sqla, function (err, result) {
            if (err) throw err;
            //console.log(result);
            
            res = JSON.parse(JSON.stringify(result));
            var xValues = [];
            var yValues = [];

            //slice logic
            res.forEach(element => {
                if(element.answers>9){
                    var str;
                    str = element.answers.toString()
                    if (str.includes("1")){
                        xValues.push(1);
                    }
                    if (str.includes("2")){
                        xValues.push(2);
                    }
                    if (str.includes("3")){
                        xValues.push(3);
                    }
                    if (str.includes("4")){
                        xValues.push(4);
                    }
                }else{
                    xValues.push(element.answers);
                }
            });

            //collect logic
            yValues[0] = xValues.filter(check1).length;
            function check1(ans) {
            return ans == 1;
            }
            yValues[1] = xValues.filter(check2).length;
            function check2(ans) {
            return ans == 2;
            }
            yValues[2] = xValues.filter(check3).length;
            function check3(ans) {
            return ans == 3;
            }
            yValues[3] = xValues.filter(check4).length;
            function check4(ans) {
            return ans == 4;
            }
            console.log("yvalues: " + yValues);
            io.to(pin).emit('resChart', yValues);
        });
        
    });



    
socket.on('disconnect', () => {
    numUser--;
    console.log('one user disconnected ', numUser, ' online user');
    //for all room counter send to client side
    if (typeof io.sockets.adapter.rooms.get(userRooms[socket.id]) !== 'undefined') {
        var onliNum = io.sockets.adapter.rooms.get(userRooms[socket.id]).size;
        io.to(userRooms[socket.id]).emit('online', onliNum);
        delete userRooms[socket.id];
    } else {
        delete userRooms[socket.id];
    }

});


})


// end of socket.io logic

module.exports = socketapi;