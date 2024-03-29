var Category = require('../models/category');

exports['new'] = function(req, res){
    res.render('category_admin', {
        title: 'imooc admin category page',
        category: {} //<--emptyObject for view 
    });
};

exports.save = function(req, res){
    var _category = req.body.category;
    var category = new Category(_category);
    
    category.save(function(err, category){
        if(err){console.log(err);}
        
        res.redirect('/admin/category/list');
    });
};

exports.list = function(req, res){
    Category.fetch(function(err, cats){
        if(err){console.log(err);}
        
        res.render('categorylist', {
            title: 'imooc category list page',
            categories: cats
        })
    })
};