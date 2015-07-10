/// <reference path="typings/node/node.d.ts"/>
var express = require('express');
var port = process.env.PORT || 3000;
var path = require('path');
var app = express();

app.set('views', './views/pages' );
app.set('view engine', 'jade');
app.listen(port);

console.log('imooc started on port '+port);

app.get('/', function(req, res){
	res.render('index', {
		title: 'imooc index'
	});
});

app.get('/movie/:id', function(req, res){
	res.render('detail', {
		title: 'imooc detail'
	});
});

app.get('/admin/movie', function(req, res){
	res.render('admin', {
		title: 'imooc admin'
	});
});

app.get('/admin/list', function(req, res){
	res.render('list', {
		title: 'imooc list'
	});
});