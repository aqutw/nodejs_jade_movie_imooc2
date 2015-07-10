/// <reference path="typings/node/node.d.ts"/>
var express = require('express');
var logger = require('express-logger');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var mongoose = require('mongoose');

var port = process.env.PORT || 3000;
var app = express();

var DB_URL = 'mongodb://localhost/imooc';
mongoose.connect(DB_URL);

app.set('views', './views/pages' );
app.set('view engine', 'jade');

app.use(bodyParser()) // app.use(express.bodyParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());
app.use(session({secret: 'imooc', 
    store: new MongoStore({
        url: DB_URL,
        collection: 'sessions'
    })
}));

app.locals.moment = require('moment');

if ('development' === app.get('env')){
    app.set('showStackError', true);
    
    //app.use(express.logger(':method :url :status'));
    app.use( logger({path: "./logfile.txt"}) );
    
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

require('./config/routes')(app);

app.listen(port);

console.log('imooc started on port '+port);

/* ok
app.get('/testjson', function(req, res){
    res.json({a:1, b:2});
});*/

