/**
 * Node.js Example
 * (c) 2016 Harry Huang
 * License: MIT
 */

var path = require('path');

var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');

var config = require('./server/config');

var userSchema = new mongoose.Schema({
    email: {type: string, unique: true, lowercase: true},
    password: {type: string, select: false},
    userName: string,
    age: number
});

var app = express();

app.set('port', process.env.NODE_PORT || 3000);
app.set('host', process.env.NODE_IP || 'localhost');
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Force HTTPS on Heroku
if (app.get('env') === 'production') {
    app.use(function (req, res, next) {
        var protocol = req.get('x-forwarded-proto');
        protocol === 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
    });
}
app.use(express.static(path.join(__dirname, './src')));

/*
 |--------------------------------------------------------------------------
 | Start the Server
 |--------------------------------------------------------------------------
 */
app.listen(app.get('port'), app.get('host'), function () {
    console.log('Express sercer listening on: ' + app.get('host') + ':' + app.get('port'))
});