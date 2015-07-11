var User = require('../models/user');

var LOCALS_USER_KEY = 'user';
var SESS_USER_KEY = 'user';
var EQUAL_OR_LESS_THAN_ADMIN_ROLE = 10;

// signup
exports.signup = {};
exports.signup.get = function(req, res){
    res.render('signup', {
        title: 'imooc user signup'
    })
};
exports.signup.post = function(req, res){
    var _user = req.body.user;
    
    User.findOne({name: _user.name}, function(err, u){
        if (err) {
            console.log(err);
        }
        
        if (u) { //repeated username
            return res.redirect('/signin')
        } else {
             
    var user = new User(_user);
        
    user.save(function(err, user){
        if (err) {
            console.log(err);
        }
        
        // console.log(user);
        res.redirect('/admin/user/list');
    });
    
        }//end else
    });//end User.find
    
};

exports.logout = function(req, res){
    delete req.session[SESS_USER_KEY];
    // delete app.locals[LOCALS_USER_KEY];
    
    res.redirect('/?logoutted');
};

exports.signin = {};
exports.signin.get = function(req, res){
    res.render('signin', {
        title: 'imooc user signin'
    })
};
exports.signin.post = function(req, res){
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    
    User.findOne({name: name}, function(err, user){
        if (err) {console.log(err);}
        
        if (!user) {
            return res.redirect('/signup');
        }
        
        user.comparePassword(password, function(err, isMatched){
            if (err) {
                console.log(err);
            }
            
            if (isMatched) {
                console.log('Password is matched!!!');
                req.session[SESS_USER_KEY] = user;
                
                var req_redirect_to = req.body.redirect_to,
                    redirect_to = '/';
                if( req_redirect_to 
                    && req_redirect_to!=''
                    && req_redirect_to.indexOf('//')<0  //security issue
                    && req_redirect_to.indexOf('http')<0 //security issue
                    ){
                    redirect_to = req_redirect_to;
                }
                return res.redirect(redirect_to);
            } else {
                console.log('Password is not matched....');
                return res.redirect('/signin');
            }
        });
    });
};

exports.list = function(req, res){
    
    User.fetch(function(err, users){
        if (err){console.log(err);}
    
    res.render('userlist', {
        title: 'imooc userlist',
        users: users
    });
    
    });
    
};

// middleware for user
exports.signinRequired = function(req, res, next){
    var user = req.session.user;
    if (!user) {
        return res.redirect('/signin'); 
    }
    next();
};
exports.adminRequired = function(req, res, next){
    var user = req.session.user;
    console.log('user.role', user.role);
    if (!user.role || user.role <= EQUAL_OR_LESS_THAN_ADMIN_ROLE) {
        return res.redirect('/signin');
    }
    
    next();
}