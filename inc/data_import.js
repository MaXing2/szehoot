exports.imp = function (fs,app,connection){

app.post('/IMPORT', function (req, res) {

    if(!req.files){
        return res.status(400).send("No files were uploaded.");
    }
    file = req.files.importFile;
    console.log(file);

    console.log("------------------------");

    data = JSON.parse(file.data.toString("utf-8"));
    console.log(data);

    let generaltId = req.body.kerdesszam;
    console.log(generaltId);

//TODO ID GENERALNI!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    data.forEach(element => {
        var sql = "INSERT INTO test_questions " +
        "(test_id ,question,answer_1 ,answer_2 ,answer_3 ,answer_4 " + 
        ",question_number, time, score, type, correct_answer_no, image,extra_score,extra_time) " + 
        " VALUES  ("+connection.escape(/*  TODOO GENERALNI EGYEDI AZONOSÍTÓT */generaltId)+ ","+
        connection.escape(element.question)  + ","+ connection.escape(element.answer_1)  +
        ","+ connection.escape(element.answer_2)  +  ","+
        connection.escape(element.answer_3)  + ","+ connection.escape(element.answer_4)  +
        "," + connection.escape(element.question_number)+
        ","+connection.escape(element.time)+","+connection.escape(element.score)+
        ","+connection.escape(element.type)+","+
        connection.escape(element.correct_answer_no)+","+
        connection.escape(element.image)+ ","+
        connection.escape(element.extra_score)+ ","+connection.escape(element.extra_time)+")";

        connection.query(sql, function (err, result) {
            if (err) throw err;
            json = JSON.parse(JSON.stringify(result));
            // res.json(json);
        });        
    });

    return res.status(200).end("OK");
})
}