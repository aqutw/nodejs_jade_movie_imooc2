/// <reference path="typings/node/node.d.ts"/>
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');

var Movie = require('./models/movies');

var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/imooc')

app.set('views', './views/pages' );
app.set('view engine', 'jade');

app.use(bodyParser()) // app.use(express.bodyParser())
app.use(express.static(path.join(__dirname, 'bower_components')))

app.locals.moment = require('moment');

app.listen(port);

console.log('imooc started on port '+port);

app.get('/', function(req, res){
    Movie.fetch(function(err, movies){
        if (err){console.log(err);}
    res.render('index', {
        title: 'imooc index',
        movies: movies
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