var Movie = require('../models/movies');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');

exports.detail = function(req, res){
    var id = req.params.id;
    
    Movie.findById(id, function(err, movie){
        Comment.find({movie: id})
        .populate('from', 'name')
        .populate('reply.from reply.to', 'name')
        .exec( function(err, comments){
            // console.log(comments);
            res.render('detail', {
                title: 'imooc detail' + movie.title,
                movie: movie,
                comments: comments
            });//end render
        });//end Comment.find
    });//end Movie.findById
};

exports['new'] = function(req, res){
    Category.find({}, function(err, cats){
    res.render('admin', {
        title: 'imooc admin',
        categories: cats,
        movie: {}
    });
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
    
    if (id){
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
            category: movieObj.category,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year, 
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        // console.log('movieObj.category', movieObj.category);
        var catId = movieObj.category;
        var catName = movieObj.categoryName;
        
        _movie.save(function(err, movie){
            if(err){console.log(err);}
            
            if(catId){
                Category.findById(catId, function(err, category){
                    category.movies.push(movie._id);
                    
                    category.save(function(err, category){
                        res.redirect('/movie/' + movie._id); //<--repeated logic
                    });
                });
            }else if(catName){
                var category = new Category({
                    name: catName,
                    movies: [movie._id]
                });
                
                category.save(function(err, category){
                    res.redirect('/movie/' + movie._id); //<--repeated logic
                });
            }
            
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
