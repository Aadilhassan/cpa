let express = require('express');
let session = require('express-session');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let app = express();
let port = process.env.PORT || 8080 || 8888;

let passport = require('passport');
let flash = require('connect-flash');

require('./config/passport')(passport);
const cors=require("cors");
const path = require("express");
const corsOptions ={
 origin:'*',
 credentials:true,            //access-control-allow-credentials:true
 optionSuccessStatus:200,
}


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
 extended: true
}));

app.set('view engine', 'ejs');

app.use(session({
 secret: 'justasecret',
 resave:true,
 saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/static', express.static('assets'));
require('./app/routes.js')(app, passport);
app.use(cors(corsOptions))
app.listen(port);
console.log("Port: " + port);