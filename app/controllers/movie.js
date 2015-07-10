var Movie = require('../models/movies');
var _ = require('underscore');

exports.detail = function(req, res){
    var id = req.params.id;
    
    Movie.findById(id, function(err, movie){

    res.render('detail', {
        title: 'imooc detail' + movie.title,
        movie: movie
    });
    
    });
};

exports['new'] = function(req, res){
    res.render('admin', {
        title: 'imooc admin',
        movie: {
            title:'', doctor: '',
            country: '', year: '',
            poster: '', flash: '',
            summary: '', language: ''
        }
    });
};

// app.get('/admin/update/:id', function(req, res){
exports.update = function(req, res){
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function(err, movie){
            res.render('admin', {
                title: 'imooc 後台更新頁',
                movie: movie
            });
        });//end findById
    }
};

// app.post('/admin/movie/new', function(req, res){
exports.save = function(req, res){
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
};

// app.get('/admin/list', function(req, res){
exports.list = function(req, res){
    
    Movie.fetch(function(err, movies){
        if (err){console.log(err);}
    
    res.render('list', {
        title: 'imooc list',
        movies: movies
    });
    
    });
    
};

exports.del = function(req, res){
    var id = req.query.id;
    
    if (id) {
        Movie.remove({_id: id}, function(err, movie){
            if (err) {
                return console.log(err);
            }
            
            res.json({success: 1});
        });
    }
};
