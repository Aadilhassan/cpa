const mysql = require('mysql');
const bodyParser = require("body-parser");
const dbconfig = require("../config/database");
const bcrypt = require('bcrypt');
const https = require('https');
const {data} = require("express-session");
const app = require("express-session");


let connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
module.exports = function(app, passport) {
 app.get('/', function (req, res) {
  res.render('index.ejs');
 });



 app.get('/login', function (req, res) {
  res.render('login.ejs', {message: req.flash('loginMessage')});
 });

 app.post('/login', passport.authenticate('local-login', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true
     }),
     function(req, res) {
      res.redirect('/~' + req.user.username);
     });
  //    function (req, res) {
  // console.log(req.body)
  //     if (req.body.remember) {
  //      req.session.cookie.maxAge = 1000 * 60 * 3;
  //     } else {
  //      req.session.cookie.expires = false;
  //     }
  //     res.redirect('/');
  //    });

 app.get('/signup', function (req, res) {
  res.render('signup.ejs', {message: req.flash('signupMessage')});
 });

 app.post('/signup', async (req, res) => {
  try {
   const hashed = await bcrypt.hash(req.body.password, 10)
   let user = req.body.username;
   let pass = hashed;
   let email = req.body.email;
   let sql = "INSERT INTO users (username, email , password) VALUES  ('" + user + "','" + email + "','" + pass + "')";

   connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
   });
   console.log(req.body);
   res.send("recieved your request!");
  } catch {
   res.redirect('/signup')
  }


 });

 app.get('/dashboard', isLoggedIn, function (req, res) {
  res.render('dashboard.ejs', {
   user: req.user
  });
 });
 app.get('/profile', isLoggedIn, function (req, res) {
  res.render('profile.ejs', {
   user: req.user
  });
 });
 app.get('/earnings', isLoggedIn, function (req, res) {
  res.render('earnings.ejs', {
   user: req.user
  });
 });

 // -------postback ---start ----------
 app.get('/postback', function (req, res) {
  let password = req.query.password
  let virtual_currency = req.query.virtual_currency
  let subid = req.query.subid
  let pass = 7091


 let sql = "UPDATE users set points= points+? WHERE id = ?";
 //  connection.query("UPDATE users SET ? WHERE id = ?", [{ points: virtual_currency }, subid])

 connection.query(sql, [virtual_currency, subid], function (err, result) {
  console.log("Record Updated!!");
  console.log(result);
  res.send(` virtual_currency "money added"`);

 });
 });
 // ------postback --ends--------------


 app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
 })

 // app.get('/postback', function (req, res) {
 //  req.param('subid')
 //  res.send('hello postback')
 // })



};


function isLoggedIn(req, res, next){
 if(req.isAuthenticated())
  return next();

 res.redirect('/');
}