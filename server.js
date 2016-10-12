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
const jwt = require('jwt-simple');
const flash = require('express-flash');
const logger = require('morgan');
const chalk = require('chalk');
const moment = require('moment');
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
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };

    return jwt.encode(payload, config.TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
app.post('/auth/login', function (req, res) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send('You must send the email and the password');
    }

    User.findOne({ email: req.body.email }, '+password', function (err, user) {
        if (!user) {
            return res.status(401).send({ message: 'Invalid email' });
        }
        user.comparePassword(req.body.password, function (err, isMath) {
            if (!isMath) {
                return res.status(401).send({ message: 'Invalid password' });
            }
            return res.send({ token: createJWT(user) });
        })
    })
})

/*
 |--------------------------------------------------------------------------
 | Get user information
 |--------------------------------------------------------------------------
 */
app.get('/api/user', (req, res) => {
    //57f9120fa3fd5308e0d3d0d0
    User.findById(req.query.userId, (err, user) => {
        res.send({ data: user });
    });
});

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
app.post('/api/signup', (req, res, next) => {
    console.log(req);
    req.assert('email', 'Email is required').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Password do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    const errors = req.validationErrors(true);

    if (errors) {
        //req.flash('errors', errors);
        //return res.redirect('/signup');
        return res.send({
            status: 'invalidForm',
            data: errors
        });
    }

    User.findOne({ email: req.body.email }, (err, existingUser) => {
        if (existingUser) {
            return res.send({
                status: 'invalidForm',
                data: {
                    email: {
                        param: 'email',
                        msg: req.body.email + ' has been taken, please user another Email',
                        value: req.body.email
                    }
                }
            });
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
            return res.send({
                status: 'successed',
                token: createJWT(result)
            });
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