/**
 * Node.js Example
 * (c) 2016 Harry Huang
 * License: MIT
 */

const path = require('path');

const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressValidator = require('express-validator');
const flash = require('express-flash');
const logger = require('morgan');
const chalk = require('chalk');
const mongoose = require('mongoose');

const config = require('./server/config');

/**
 * Create Express server.
 */
const app = express();

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    userName: String
});

userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        done(err, isMatch);
    });
};

const User = mongoose.model('Angular_User', userSchema);

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(config.MONGO_URI);
mongoose.connection.on('connected', () => {
    console.log('%s MongoDB connection established!', chalk.green('✓'));
});
mongoose.connection.on('error', (err) => {
    console.log('%s Could not connect to MongoDB. Did you forget to run `mongod`?', chalk.red('✗'));
});


app.set('port', process.env.NODE_PORT || 5000);
app.set('host', process.env.NODE_IP || 'localhost');
app.use(cors());
app.use(logger('dev'));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

// Force HTTPS on Heroku
if (app.get('env') === 'production') {
    app.use((req, res, next) => {
        const protocol = req.get('x-forwarded-proto');
        protocol === 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
    });
}
app.use(express.static(path.join(__dirname, './src')));

/*
 |--------------------------------------------------------------------------
 | Get user information
 |--------------------------------------------------------------------------
 */
app.get('/api/user', (req, res) => {
    //57f9120fa3fd5308e0d3d0d0
    User.findById(req.query.userId, (err, user) => {
        res.send({data: user});
    });
});

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
app.post('/api/signup', (req, res, next) => {
    req.assert('email', 'Email is required').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Password do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    const errors = req.validationErrors(true);

    if (errors) {
        //req.flash('errors', errors);
        //return res.redirect('/signup');
        return res.status(404).send({ message: errors });
    }

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (existingUser) {
            return res.status(409).send({ message: 'Email is already taken' });
        }
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            userName: req.body.userName
        });
        user.save((err, result) => {
            if (err) {
                return res.status(500).send({ message: err.message });
            }
            //res.send({ token: createJWT(result) });
            return res.send({ data: result });
        });
    });
});

/*
 |--------------------------------------------------------------------------
 | Start the Server
 |--------------------------------------------------------------------------
 */
app.listen(app.get('port'), app.get('host'), () => {
    console.log('Express sercer listening on: ' + app.get('host') + ':' + app.get('port'));
});