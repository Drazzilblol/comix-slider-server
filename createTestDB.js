'use strict';

var jsdom = require('jsdom');


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

        var com = {
            title: $("#dle-content").find('div h2').text(),
            coverSrc: $("#dle-content").find('div img').prop("src"),
            numbers: numbers
        };

        var mongodb = require('mongodb');
        var MongoClient = mongodb.MongoClient;
        var url = 'mongodb://localhost:27017/comix';
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {

                console.log('Connection established to', url);

                var collection = db.collection('comixes');

                collection.insertOne(com, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                    }

                    //Close connection
                    db.close();
                });
            }
        });
    }
);


