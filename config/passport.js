var LocalStrategy = require("passport-local").Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = function(passport) {
 passport.serializeUser(function(user, done){
  done(null, user.id);
 });

 passport.deserializeUser(function(id, done) {
  connection.query("select * from users where id = id",function(err,rows){
   done(err, rows[0]);
  });
 });


 passport.use(
  'local-login',
  new LocalStrategy({
   usernameField : 'username',
   passwordField: 'password',
   passReqToCallback: true
  },
  function(req, username, password, done){
   connection.query("SELECT * FROM users WHERE email = ? ", [username],
   function(err, rows){
    if(err)
     return done(err);
    if(!rows.length){
     return done(null, false, req.flash('loginMessage', 'No User Found'));
    }
    if(!bcrypt.compareSync(password, rows[0].password, ))
     return done(null, false, req.flash('loginMessage', 'Wrong Password'));

    return done(null, rows[0]);
   });
  })
 );


 passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
     },
     function(req, email, password, done) {

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      connection.query("select * from users where user_email = '"+email+"'",function(err,rows){
       console.log(rows);
       console.log("above row object");
       if (err)
        return done(err);
       if (rows.length) {
        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
       } else {


        // if there is no user with that email
        // create the user
        var newUserMysql = new Object();

        newUserMysql.email    = email;
        newUserMysql.password = password; // use the generateHash function in our user model

        var insertQuery = "INSERT INTO users ( user_email, user_password,) values ('" + email +"','"+ password +"')";
        console.log(insertQuery);
        connection.query(insertQuery,function(err,rows){
         // newUserMysql.id = rows.insertId;

         return done(null, newUserMysql);
        });
       }
      });
     }));
};