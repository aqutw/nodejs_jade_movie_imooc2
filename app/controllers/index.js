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


exports.search = function(req, res){ //TODO: how to re-used index logic (Category.find)
    var catId = req.query.cat;
    var page = req.query.p;
    var PAGESIZE = 2;
    var index = page * PAGESIZE;
    
    Category.find({_id: catId})
        .populate({path: 'movies', options: {limit: PAGESIZE, skip: index}})
        .exec(function(err, categories){
            if (err) {console.log(err);}
            
            var category = categories[0] || {};
            res.render('results', {
                title: 'imooc Search Result page',
                keyword: category.name,
                category: category
            });
        });
};