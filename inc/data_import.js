exports.imp = function (fs,app,connection,Ajv){

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

    const ajv = new Ajv({"strict": false});
    
//default_shema
  const schema ={
    "type": "array",
    "title": "The root schema",
    "description": "The root schema comprises the entire JSON document.",
    "default": [],
    "examples": [
        [
            {
                "id": 1,
                "test_id": 1,
                "question": "<p>A HTML egy programnyelv!</p>",
                "answer_1": null,
                "answer_2": null,
                "answer_3": null,
                "answer_4": null,
                "correct_answer_no": 2,
                "time": 30,
                "score": 3,
                "extra_score": 2,
                "extra_time": 10,
                "type": 0,
                "image": "",
                "question_number": 0
            },
            {
                "id": 2,
                "test_id": 1,
                "question": "<p>A képen látható kódrészlet futtatása esetén mi lesz az output?</p>",
                "answer_1": "error",
                "answer_2": "0",
                "answer_3": "peach",
                "answer_4": "mango",
                "correct_answer_no": 3,
                "time": 10,
                "score": 1,
                "extra_score": 0,
                "extra_time": 0,
                "type": 14,
                "image": "https://i.pinimg.com/originals/77/98/75/779875757d87eb565f4e853dc470e741.png",
                "question_number": 1
            }
        ]
    ],
    "additionalItems": true,
    "items": {
        "$id": "#/items",
        "anyOf": [
            {
                "$id": "#/items/anyOf/0",
                "type": "object",
                "title": "The first anyOf schema",
                "description": "An explanation about the purpose of this instance.",
                "default": {},
                "examples": [
                    {
                        "id": 1,
                        "test_id": 1,
                        "question": "<p>A HTML egy programnyelv!</p>",
                        "answer_1": null,
                        "answer_2": null,
                        "answer_3": null,
                        "answer_4": null,
                        "correct_answer_no": 2,
                        "time": 30,
                        "score": 3,
                        "extra_score": 2,
                        "extra_time": 10,
                        "type": 0,
                        "image": "",
                        "question_number": 0
                    }
                ],
                "required": [
                    "id",
                    "test_id",
                    "question",
                    "answer_1",
                    "answer_2",
                    "answer_3",
                    "answer_4",
                    "correct_answer_no",
                    "time",
                    "score",
                    "extra_score",
                    "extra_time",
                    "type",
                    "image",
                    "question_number"
                ],
                "properties": {
                    "id": {
                        "$id": "#/items/anyOf/0/properties/id",
                        "type": "integer",
                        "title": "The id schema",
                        "description": "An explanation about the purpose of this instance.",
                        "default": 0,
                        "examples": [
                            1
                        ]
                    },
                    "test_id": {
                        "$id": "#/items/anyOf/0/properties/test_id",
                        "type": "integer",
                        "title": "The test_id schema",
                        "description": "An explanation about the purpose of this instance.",
                        "default": 0,
                        "examples": [
                            1
                        ]
                    },
                    "question": {
                        "$id": "#/items/anyOf/0/properties/question",
                        "type": "string",
                        "title": "The question schema",
                        "description": "An explanation about the purpose of this instance.",
                        "default": "",
                        "examples": [
                            "<p>A HTML egy programnyelv!</p>"
                        ]
                    },
                    "answer_1": {
                        "$id": "#/items/anyOf/0/properties/answer_1",
                        "type": ["string","null"],
                        "title": "The answer_1 schema",
                        "description": "An explanation about the purpose of this instance.",
                        "default": null,
                        "examples": [
                            null
                        ]
                    },
                    "answer_2": {
                        "$id": "#/items/anyOf/0/properties/answer_2",
                        "type": ["string","null"],
                        "title": "The answer_2 schema",
                        "description": "An explanation about the purpose of this instance.",
                        "default": null,
                        "examples": [
                            null
                        ]
                    },
                    "answer_3": {
                        "$id": "#/items/anyOf/0/properties/answer_3",
                        "type": ["string","null"],
                        "title": "The answer_3 schema",
                        "description": "An explanation about the purpose of this instance.",
                        "default": null,
                        "examples": [
                            null
                        ]
                    },
                    "answer_4": {
                        "$id": "#/items/anyOf/0/properties/answer_4",
                        "type": ["string","null"],
                        "title": "The answer_4 schema",
                        "description": "An explanation about the purpose of this instance.",
                        "default": null,
                        "examples": [
                            null
                        ]
                    },
                    "correct_answer_no": {
                        "$id": "#/items/anyOf/0/properties/correct_answer_no",
                        "type": "integer",
                        "title": "The correct_answer_no schema",
                        "description": "An explanation about the purpose of this instance.",
                        "default": 0,
                        "examples": [
                            2
                        ]
                    },
                    "time": {
                        "$id": "#/items/anyOf/0/properties/time",
                        "type": "integer",
                        "title": "The time schema",
                        "description": "An explanation about the purpose of this instance.",
                        "default": 0,
                        "examples": [
                            30
                        ]
                    },
                    "score": {
                        "$id": "#/items/anyOf/0/properties/score",
                        "type": "integer",
                        "title": "The score schema",
                        "description": "An explanation about the purpose of this instance.",
                        "default": 0,
                        "examples": [
                            3
                        ]
                    },
                    "extra_score": {
                        "$id": "#/items/anyOf/0/properties/extra_score",
                        "type": "integer",
                        "title": "The extra_score schema",
                        "description": "An explanation about the purpose of this instance.",
                        "default": 0,
                        "examples": [
                            2
                        ]
                    },
                    "extra_time": {
                        "$id": "#/items/anyOf/0/properties/extra_time",
                        "type": "integer",
                        "title": "The extra_time schema",
                        "description": "An explanation about the purpose of this instance.",
                        "default": 0,
                        "examples": [
                            10
                        ]
                    },
                    "type": {
                        "$id": "#/items/anyOf/0/properties/type",
                        "type": "integer",
                        "title": "The type schema",
                        "description": "An explanation about the purpose of this instance.",
                        "default": 0,
                        "examples": [
                            0
                        ]
                    },
                    "image": {
                        "$id": "#/items/anyOf/0/properties/image",
                        "type": "string",
                        "title": "The image schema",
                        "description": "An explanation about the purpose of this instance.",
                        "default": "",
                        "examples": [
                            ""
                        ]
                    },
                    "question_number": {
                        "$id": "#/items/anyOf/0/properties/question_number",
                        "type": "integer",
                        "title": "The question_number schema",
                        "description": "An explanation about the purpose of this instance.",
                        "default": 0,
                        "examples": [
                            0
                        ]
                    }
                },
                "additionalProperties": true
            }
        ]
    }
    }

      console.log(schema);
      try{
      const validate = ajv.compile(schema);
      const valid = validate(data);

      console.log(valid);

            //const valid = validate(data)
            if (!valid){
              console.log(validate.errors);
              return res.status(200).end("Fail");
            }else{
                console.log("siker");                   
                data.forEach(element => {
                    console.log(element.question_number);
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
                        if (err) console.log(err);
                        json = JSON.parse(JSON.stringify(result));
                        // res.json(json);
                    });        
                });
                return res.status(200).end("OK");
            }
      } catch(erorr) {console.log(erorr);}
    }
)
}