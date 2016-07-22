'use strict'
;
var mongoose = require('mongoose');

var ComixSchema = new mongoose.Schema({
    title: String,
    coverUrl: String,
    numbers: Array
});

module.exports = mongoose.model('Comix', ComixSchema);