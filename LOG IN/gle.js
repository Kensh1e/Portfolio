const express = require('express');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 3000;

// Facebook App Credentials from .env file
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

// Middleware setup
app.use(cookieParser());
app.use(express.static('public')); // Static assets like images, CSS, etc.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true
    }
}));
app.set('view engine', 'ejs'); // Using EJS as template engine
app.set('views', path.join(__dirname, 'views')); // Views folder

// Passport configuration
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'emails'] // Fields to request
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile); // In a real app, save the profile to your DB
  }
));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.user = req.user; // Save user profile in session
    res.redirect('/'); // Redirect to home after login
});

app.get('/', (req, res) => {
    if (req.session.user) {
        res.render('home', { user: req.session.user }); // Show home page if logged in
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.render('login'); // Render login page
});

app.get('/logout', (req, res) => {
    req.session.destroy(); // Destroy session
    res.redirect('/login'); // Redirect to login page
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
