var Movie = require('../models/movies');

var LOCALS_USER_KEY = 'user';
var SESS_USER_KEY = 'user';

exports.index = function(req, res){
    console.log('req.session[SESS_USER_KEY]', req.session[SESS_USER_KEY]);
    
    Movie.fetch(function(err, movies){
        if (err){console.log(err);}
    res.render('index', {
        title: 'imooc index',
        movies: movies
    });
    
    });
};