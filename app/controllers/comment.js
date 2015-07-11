var Comment = require('../models/comment');
var _ = require('underscore');

var LOCALS_USER_KEY = 'user';
var SESS_USER_KEY = 'user';

exports.save = function(req, res){
    var _comment = req.body.comment;
    var movieId = _comment.movie;
    var comment = new Comment(_comment);
    var _from = req.session[SESS_USER_KEY]._id;
    
    if (_comment.cid) {
        Comment.findById(_comment.cid, function(err, comment){
            var reply = {
                from: _from,
                to: _comment.tid,
                content: _comment.content
            };
            // console.log('reply', reply);
            
            comment.reply.push(reply);
            
            comment.save(function(err, comment){
                if (err) { console.log(err); }
                // console.log(comment);
                res.redirect('/movie/' + movieId);
            });
        });
    } else {
    
    comment.from = _from; 
    comment.save(function(err, comment){
        if (err) {
            console.log(err);
        }
        
        res.redirect('/movie/' + movieId);
    });
    
    }//end else
};