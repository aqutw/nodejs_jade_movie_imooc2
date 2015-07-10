var User = require('../models/user');

var LOCALS_USER_KEY = 'user';
var SESS_USER_KEY = 'user';

// signup
exports.signup = {};
exports.signup.get = function(req, res){
    res.render('signup', {
        title: 'imooc user signup'
    })
};
exports.signup.post = function(req, res){
    var _user = req.body.user;
    
    User.find({name: _user.name}, function(err, u){
        if (err) {
            console.log(err);
        }
        
        if (u) {
            return res.redirect('/signin')
        } else {
             
    var user = new User(_user);
        
    user.save(function(err, user){
        if (err) {
            console.log(err);
        }
        
        // console.log(user);
        res.redirect('/admin/userlist');
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
                
                return res.redirect('/');
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
