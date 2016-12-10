var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var questions = require('./routes/questions');

//load customers route
var app = express();

var connection  = require('express-myconnection');
var mysql = require('mysql');


app.use(

    connection(mysql,{

        host: 'localhost',
        user: 'root',
        password : '',
        port : 3306, //port mysql
        database:'questions_db'

    },'pool') //or single

);

// view engine setup
app.set('port', process.env.PORT || 3007);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', index);
app.get('/questions', questions.list);
app.get('/questions/add', questions.add);
app.post('/questions/add', questions.save);
app.get('/questions/delete/:id', questions.delete_question);
app.get('/questions/edit/:id', questions.edit);
app.post('/questions/edit/:id',questions.save_edit);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
