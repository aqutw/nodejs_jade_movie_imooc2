/// <reference path="typings/node/node.d.ts"/>
var express = require('express');
var port = process.env.PORT || 3000;
var path = require('path');
var app = express();

app.set('views', './views/pages' );
app.set('view engine', 'jade');

app.use(express.bodyParser())
app.use(express.static(path.join(__dirname, 'bower_components')))
app.listen(port);

console.log('imooc started on port '+port);

app.get('/', function(req, res){
    res.render('index', {
        title: 'imooc index',
        movies: [{
            title: 'movie1',
            _id:1,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: 'movie1',
            _id:2,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: 'movie1',
            _id:3,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: 'movie1',
            _id:4,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: 'movie1',
            _id:5,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: 'movie1',
            _id:6,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        }]
    });
});

app.get('/movie/:id', function(req, res){
    res.render('detail', {
        title: 'imooc detail',
        movie: {
            doctor: '里亞',
            country: 'US',
            title: 'moviename',
            year: 2014,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
            language: 'Eng',
            flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
            summary: 'asdlkjfladjflafladfafalkfakfjaljdfslk'
        }
    });
});

app.get('/admin/movie', function(req, res){
    res.render('admin', {
        title: 'imooc admin',
        movie: {
            title:'', doctor: '',
            country: '', year: '',
            poster: '', flash: '',
            summary: '', language: ''
        }
    });
});

app.get('/admin/list', function(req, res){
    res.render('list', {
        title: 'imooc list',
        movies: [{
            title: 'movie1',
            _id:1,
            doctor: '里亞',
            country: 'US',
            year: 2014,
            language: 'eng',
            flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
            summary: 'aslkdfaslkfjdaljfaldjk'
        }]
    });
});