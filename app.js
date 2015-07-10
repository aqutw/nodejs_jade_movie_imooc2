/// <reference path="typings/node/node.d.ts"/>
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');

var Movie = require('./models/movies');
var User = require('./models/user');

var port = process.env.PORT || 3000;
var app = express();

var DB_URL = 'mongodb://localhost/imooc';
mongoose.connect(DB_URL);

var LOCALS_USER_KEY = 'user';
var SESS_USER_KEY = 'user';

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

app.listen(port);

console.log('imooc started on port '+port);

// pre handle user
app.use(function(req, res, next){
    app.locals[LOCALS_USER_KEY] = req.session[SESS_USER_KEY];
    
    next();
});

app.get('/', function(req, res){
    console.log('req.session[SESS_USER_KEY]', req.session[SESS_USER_KEY]);
    
    Movie.fetch(function(err, movies){
        if (err){console.log(err);}
    res.render('index', {
        title: 'imooc index',
        movies: movies
    });
    
    });
});

// signup
app.post('/user/signup', function(req, res){
    var _user = req.body.user;
    
    User.find({name: _user.name}, function(err, u){
        if (err) {
            console.log(err);
        }
        
        if (u) {
            return res.redirect('/')
        } else {
             
    var user = new User(_user);
        
    user.save(function(err, user){
        if (err) {
            console.log(err);
        }
        
        // console.log(user);
        res.redirect('/admin/userlist');
    });
    
        }//end else
    });//end User.find
    
});

app.get('/logout', function(req, res){
    delete req.session[SESS_USER_KEY];
    delete app.locals[LOCALS_USER_KEY];
    
    res.redirect('/?logoutted');
})

app.post('/user/signin', function(req, res){
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    
    User.findOne({name: name}, function(err, user){
        if (err) {console.log(err);}
        
        if (!user) {
            return res.redirect('/?not_exist_user');
        }
        
        user.comparePassword(password, function(err, isMatched){
            if (err) {
                console.log(err);
            }
            
            if (isMatched) {
                console.log('Password is matched!!!');
                req.session[SESS_USER_KEY] = user;
                
                return res.redirect('/');
            } else {
                console.log('Password is not matched....');
            }
        });
    });
});

app.get('/admin/userlist', function(req, res){
    
    User.fetch(function(err, users){
        if (err){console.log(err);}
    
    res.render('userlist', {
        title: 'imooc userlist',
        users: users
    });
    
    });
    
});


app.get('/movie/:id', function(req, res){
    var id = req.params.id;
    
    Movie.findById(id, function(err, movie){

    res.render('detail', {
        title: 'imooc detail' + movie.title,
        movie: movie
    });
    
    });
});

app.get('/admin/movie', function(req, res){
    res.render('admin', {
        title: 'imooc admin',
        movie: {
            title:'', doctor: '',
            country: '', year: '',
            poster: '', flash: '',
            summary: '', language: ''
        }
    });
});

app.get('/admin/update/:id', function(req, res){
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function(err, movie){
            res.render('admin', {
                title: 'imooc 後台更新頁',
                movie: movie
            });
        });//end findById
    }
});

app.post('/admin/movie/new', function(req, res){
    // console.log(req.body);
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    
    if (id !== 'undefined'){
        Movie.findById(id, function(err, movie){
            if(err){console.log(err);}
            
            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie){
                if(err){console.log(err);}
                
                res.redirect('/movie/' + movie._id);
            });//end save
        });//end findById
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year, 
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        
        _movie.save(function(err, movie){
            if(err){console.log(err);}
            
            res.redirect('/movie/' + movie._id);
        });//end save
    }
});

app.get('/admin/list', function(req, res){
    
    Movie.fetch(function(err, movies){
        if (err){console.log(err);}
    
    res.render('list', {
        title: 'imooc list',
        movies: movies
    });
    
    });
    
});

app.delete('/admin/list', function(req, res){
    var id = req.query.id;
    
    if (id) {
        Movie.remove({_id: id}, function(err, movie){
            if (err) {
                return console.log(err);
            }
            
            res.json({success: 1});
        });
    }
});

/* ok
app.get('/testjson', function(req, res){
    res.json({a:1, b:2});
});*/