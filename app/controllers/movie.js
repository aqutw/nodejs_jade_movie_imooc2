var Movie = require('../models/movies');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

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
            if(err){console.log(err);}
            Category.find({}, function(err, categories){
                if(err){console.log(err);}
            res.render('admin', {
                title: 'imooc 後台更新頁',
                movie: movie,
                categories: categories
            });
            });//end Category.find
        });//end findById
    }
};

// app.post('/admin/movie/new', function(req, res){
exports.save = function(req, res){
    // console.log(req.body);
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    
    if(req.poster){
        movieObj.poster = req.poster;
    }
        
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
                    });//end Category.save
                });//end Category.findById
            }else if(catName){
                var category = new Category({
                    name: catName,
                    movies: [movie._id]
                });
                
                category.save(function(err, category){
                    _movie.category = category._id;
                    movie.save(function(err, movie){
                    res.redirect('/movie/' + movie._id); //<--repeated logic
                    });
                });//end Category.save
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

// middleware for movie
exports.savePoster = function(req, res, next){
    var posterData = req.files.uploadPoster;
    var filePath = posterData.path;
    var originalname = posterData.originalname;
    
    if (originalname) {
        fs.readFile(filePath, function(err, data){
            var ts = Date.now();
            var fileext = posterData.mimetype.split('/')[1];
            var poster = ts + '.' + fileext;
            var newPath = path.join(__dirname, '../../', '/public/uploads/' + poster);
            
            fs.writeFile(newPath, data, function(err){
                req.poster = poster;
                next();
            });
        })
    } else {
        next();
    }
}