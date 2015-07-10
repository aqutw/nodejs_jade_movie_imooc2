var _ = require('underscore');

var Movie = require('../models/movies');
var User = require('../models/user');

var LOCALS_USER_KEY = 'user';
var SESS_USER_KEY = 'user';

module.exports = function(app){

// pre handle user
app.use(function(req, res, next){
    app.locals[LOCALS_USER_KEY] = req.session[SESS_USER_KEY];
    
    next();
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

}//end module.exports