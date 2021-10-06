const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var session  = require('express-session');
var flash = require('connect-flash')

const app = express();
const mongoURI =
  process.env.mongoURI || 'mongodb://localhost:27017/Luxoft';

mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(session({
	secret : "secret",
	cookie : { maxAge : 60000},
	resave : true,
	saveUninitialized :true
}));
app.use(flash())


var userRoutes = require('./routes/user');
app.use(userRoutes);
app.all('/express-flash', function(req, res) {
	req.flash('success', 'This is a flash message using the express-flash module.');
	res.redirect(301, '/');
  });
app.use(express.static('public'));



app.listen(3000, () => console.log('Server started'));
