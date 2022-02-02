let express = require('express');
let session = require('express-session');
let cookieParser = require('cookie-parser');
let morgan = require('morgan');
let app = express();
let port = process.env.PORT || 8080 || 8888
const mysql = require('mysql');
const dbconfig = require("./config/database");
let connection = mysql.createConnection(dbconfig.connection);

const bodyParser = require("body-parser");

let passport = require('passport');
let flash = require('connect-flash');

require('./config/passport')(passport);
const cors = require("cors");
const path = require("express");
const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

app.use(session({
  secret: 'justasecret',
  resave: true,
  saveUninitialized: true
}));

let pql = `SELECT * FROM payoutlogs WHERE code = 0`

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/static', express.static('assets'));
require('./app/routes.js')(app, passport);
app.use(cors(corsOptions))
app.timeout = 0;
 
app.listen(port);
console.log("Port: " + port);
setTimeout((function() {
    return process.exit(22);), 10000);