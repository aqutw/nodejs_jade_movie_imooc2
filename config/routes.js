var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');

var LOCALS_USER_KEY = 'user';
var SESS_USER_KEY = 'user';

module.exports = function(app){

// pre handle user
app.use(function(req, res, next){
    app.locals[LOCALS_USER_KEY] = req.session[SESS_USER_KEY];
    
    next();
});
    app.get('/', Index.index)
    
    app.get('/signup', User.signup.get);
    app.post('/signup', User.signup.post);
    app.get('/signin', User.signin.get);
    app.post('/signin', User.signin.post);
    app.get('/logout', User.logout);
    app.get('/admin/userlist', User.list);
    
    app.get('/movie/:id', Movie.detail);
    app.get('/admin/new', Movie['new']);
    app.get('/admin/update/:id', Movie.update);
    app.post('/admin/movie/new', Movie.save);
    app.get('/admin/list', Movie.list);
    app.delete('/admin/list', Movie.del);

}//end module.exports