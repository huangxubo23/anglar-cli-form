/**
 * Node.js Example
 * (c) 2016 Harry Huang
 * License: MIT
 */

var path = require('path');

var bcrypt = require('bcryptjs')
var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var expressValidator = require('express-validator');
var flash = require('express-flash');
var logger = require('morgan');
var chalk = require('chalk');
var mongoose = require('mongoose');

var config = require('./server/config');

/**
 * Create Express server.
 */
var app = express();

var userSchema = new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    userName: String
});

userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};

var User = mongoose.model('Angular_User', userSchema);

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(config.MONGO_URI);
mongoose.connection.on('connected', function () {
    console.log('%s MongoDB connection established!', chalk.green('✓'));
});
mongoose.connection.on('error', function (err) {
    console.log('%s Could not connect to MongoDB. Did you forget to run `mongod`?', chalk.red('✗'));
});


app.set('port', process.env.NODE_PORT || 3000);
app.set('host', process.env.NODE_IP || 'localhost');
app.use(cors());
app.use(logger('dev'));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

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
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
app.post('/sigup', function (req, res, next) {
    req.assert('email', 'Email is required').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Password do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors(true);

    if (errors) {
        //req.flash('errors', errors);
        console.log(req.body.email);
        console.log(req.body.password);
        console.log(req.body.confirmPassword);
        console.log(errors);
        //return res.redirect('/signup');
        return res.status(404).send({message: errors});
    }

    User.findOne({ email: req.body.email }, function (err, existingUser) {
        console.log('find');
        if (existingUser) {
            return res.status(409).send({ message: 'Email is already taken' });
        }
        var user = new User({
            email: req.body.email,
            password: req.body.password,
            userName: req.body.userName
        });
        user.save(function (err, result) {
            console.log('save:' + err);
            if (err) {
                return res.status(500).send({ message: err.message });
            }
            //res.send({ token: createJWT(result) });
            return res.send({ message: result });
        });
    });
});

/*
 |--------------------------------------------------------------------------
 | Start the Server
 |--------------------------------------------------------------------------
 */
app.listen(app.get('port'), app.get('host'), function () {
    console.log('Express sercer listening on: ' + app.get('host') + ':' + app.get('port'))
});