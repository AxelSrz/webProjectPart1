
/*
* GET users listing.
*/

exports.list = function(req, res){
  req.getConnection(function(err,connection){

    var query = connection.query('SELECT * FROM questions',function(err,rows)
    {

      if(err)
        console.log("Error Selecting : %s ",err );

      res.render('questions',{page_title:"Questions",data:rows});


    });

    //console.log(query.sql);
  });

};

exports.add = function(req, res){
  res.render('add_question',{page_title:"Add Question"});
};

exports.edit = function(req, res){

  var id = req.params.id;

  req.getConnection(function(err,connection){

    var query = connection.query('SELECT * FROM questions WHERE questionId = ?',[id],function(err,rows)
    {
      var resp = {};
      resp.question = rows[0];
      if(err)
        console.log("Error Selecting : %s ",err );

      connection.query('SELECT * FROM answers WHERE questionId = ?',[id],function(err,rows){
        resp.answers = rows;
        resp.categories = "";
        connection.query('SELECT categoryName FROM category WHERE questionId = ?',[id],function(err,rows){
          rows.forEach(function(row, index){
            resp.categories += row['categoryName']+' ';
          });
          resp.categories = resp.categories.trim()
          res.render('edit_question',{page_title:"Edit question",data:resp});
        });
      });
    });

    //console.log(query.sql);
  });
};

/*Save the question*/
exports.save = function(req,res){
  var input = JSON.parse(JSON.stringify(req.body));
  input.rawCategories = Array.from(new Set(input.rawCategories.toLowerCase().split(',')));

  req.getConnection(function (err, connection) {

    var questionInfo = {
      question : input.question,
      correctAnswer : input.correct
    };

    var query = connection.query("INSERT INTO questions set ? ",questionInfo, function(err, rows)
    {
      questionIdentifier = rows.insertId;
      if (err)
        console.log("Error inserting : %s ",err );

      input.answers.forEach(function(answerItem, index){
        connection.query("INSERT INTO answers set ? ",{answer : answerItem.body, questionId : questionIdentifier, seqNo : index}, function(err, rows) {
          if (err)
            console.log("Error inserting : %s ",err );
        });
      });

      input.rawCategories.forEach(function(category, index){
        connection.query("INSERT INTO category set ? ",{ questionId : id, categoryName : category }, function(err, rows) {
          if (err)
            console.log("Error inserting : %s ",err );
        });
      });

      res.redirect('/questions');

    });

    // console.log(query.sql); get raw query

  });
};

exports.save_edit = function(req,res){

  var input = JSON.parse(JSON.stringify(req.body));
  var id = req.params.id;

  input.rawCategories = Array.from(new Set(input.rawCategories.toLowerCase().split(',')));
  input.previousCategories = Array.from(new Set(input.previousCategories.split(',')));

  req.getConnection(function (err, connection) {

    var questionInfo = {
      question : input.question,
      correctAnswer : input.correct
    };

    var query = connection.query("UPDATE questions set ? WHERE questionId = ? ",[questionInfo,id], function(err, rows)
    {

      if (err)
        console.log("Error inserting : %s ",err );

      categoriesToAdd = input.rawCategories.filter(x => input.previousCategories.indexOf(x) < 0 );
      categoriesToDelete = input.previousCategories.filter(x => input.rawCategories.indexOf(x) < 0 );

      input.answers.forEach(function(answer, index){
        connection.query("SELECT * FROM answers WHERE questionId = ? AND seqNo = ? ",[id,index], function(err, rows) {
          if(rows.length == 0){
            connection.query("INSERT INTO answers set ? ",{ answer : answer.body, questionId : id, seqNo : index }, function(err, rows) {
              if (err)
                console.log("Error inserting : %s ",err );
            });
          } else {
            connection.query("UPDATE answers set ? WHERE questionId = ? AND seqNo = ? ",[{ answer : answer.body, questionId : id, seqNo : index },id,index], function(err, rows) {
              if (err)
                console.log("Error inserting : %s ",err );
            });
          }
        });
      });

      connection.query("DELETE FROM answers WHERE questionId = ? AND seqNo >= ? ",[id,input.answers.length], function(err, rows)
      {
        if(err)
        console.log("Error deleting : %s ",err );
      });

      categoriesToAdd.forEach(function(category, index){
        connection.query("INSERT INTO category set ? ",{ questionId : id, categoryName : category }, function(err, rows) {
          if (err)
            console.log("Error inserting : %s ",err );
        });
      });

      categoriesToDelete.forEach(function(category, index){
        connection.query("DELETE FROM category WHERE questionId = ? AND categoryName = ? ",[id,category], function(err, rows) {
          if (err)
            console.log("Error inserting : %s ",err );
        });
      });

      res.redirect('/questions');

    });

  });

  //connection.query("UPDATE customer set ? WHERE id = ? ",[data,id], function(err, rows)
};


exports.delete_question = function(req,res){

  var id = req.params.questionId;

  req.getConnection(function (err, connection) {

    connection.query("DELETE FROM questions  WHERE id = ? ",[id], function(err, rows)
    {

      if(err)
      console.log("Error deleting : %s ",err );

      res.redirect('/customers');

    });

  });
};
