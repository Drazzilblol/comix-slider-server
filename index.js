'use strict'

var express = require('express'),
    mongoskin = require('mongoskin'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    jsdom = require('jsdom'),
    request = require('request'),
    url = require('url')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
//app.use(logger('dev'))

var db = mongoskin.db('mongodb://@localhost:27017/comix', {safe: true})

app.param('collectionName', function (req, res, next, collectionName) {


    req.collection = db.collection(collectionName)
    return next()
})

app.get('/', function (req, res, next) {

    jsdom.env(
        "http://comics-online.ru/main/964-fables-skazaniya.html",
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
        }
    );


})

app.get('/collections/:collectionName', function (req, res, next) {


    req.collection.find({}, {limit: 10, sort: {'_id': -1}}).toArray(function (e, results) {
        if (e) return next(e)
        res.send(results)
    })
})

app.post('/collections/:collectionName', function (req, res, next) {
    req.collection.insert(req.body, {}, function (e, results) {
        if (e) return next(e)
        res.send(results)
    })
})

app.get('/collections/:collectionName/:id', function (req, res, next) {
    req.collection.findById(req.params.id, function (e, result) {
        if (e) return next(e)
        res.send(result)
    })
})

app.put('/collections/:collectionName/:id', function (req, res, next) {
    req.collection.updateById(req.params.id, {$set: req.body}, {safe: true, multi: false}, function (e, result) {
        if (e) return next(e)
        res.send((result === 1) ? {msg: 'success'} : {msg: 'error'})
    })
})

app.delete('/collections/:collectionName/:id', function (req, res, next) {
    req.collection.removeById(req.params.id, function (e, result) {
        if (e) return next(e)
        res.send((result === 1) ? {msg: 'success'} : {msg: 'error'})
    })
})

app.listen(3000, function () {
    console.log('Express server listening on port 3000')
})