var express = require('express');
var router = express.Router();
var jsdom = require('jsdom');

var mongoose = require('mongoose');
var Comix = require('../models/Comix.js');


router.param(['id', 'page'], function (req, res, next, value) {
    console.log('CALLED ONLY ONCE with', value);
    next();
});

/* GET /todos listing. */
router.get('/', function (req, res, next) {

    Comix.find(function (err, comixes) {
        if (err) return next(err);
        res.json(comixes);
    });

});

/* POST /todos */
router.post('/', function (req, res, next) {
    Comix.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /todos/id */
router.get('/:id', function (req, res, next) {
    console.log(req.params.id);
    jsdom.env(
        "http://comics-online.ru/main/" + req.params.id + ".html",
        ["http://code.jquery.com/jquery.js"],
        function (err, window) {
            var $ = window.$;
            var numbers = [];
            var arr = $("#dle-content").find("div p a").slice(1);
            var length = arr.length;

            arr.each(function (i, html) {
                numbers.push({
                    id: length - i,
                    name: $(html).text()
                })
            });

            var com = {
                title: $("#dle-content").find('div h2').text(),
                coverUrl: $("#dle-content").find('div img').prop("src"),
                numbers: numbers
            };
            Comix.create(com, function (err, post) {
                console.log("asdfasfasfasf");
                if (err) return next(err);
                res.json(post);
            });

        });
});

/* PUT /todos/:id */
router.put('/:id', function (req, res, next) {
    Comix.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE /todos/:id */
router.delete('/:id', function (req, res, next) {
    Comix.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;