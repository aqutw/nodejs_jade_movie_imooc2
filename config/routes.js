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

}//end module.exports