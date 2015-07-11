var Movie = require('../models/movies');
var Category = require('../models/category');

var LOCALS_USER_KEY = 'user';
var SESS_USER_KEY = 'user';

exports.index = function(req, res){
    Category.find({})
        .populate({path: 'movies', options: {limit: 5}})
        .exec(function(err, categories){
            if (err) {console.log(err);}
            
            res.render('index', {
                title: 'imooc title',
                categories: categories
            });
        });
    
    /*Movie.fetch(function(err, movies){
        if (err){console.log(err);}
    res.render('index', {
        title: 'imooc index',
        movies: movies
    });
    
    });*/
};
