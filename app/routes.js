const mysql = require('mysql');
const bodyParser = require("body-parser");
const dbconfig = require("../config/database");
const bcrypt = require('bcrypt');
const https = require('https');
const { data } = require("express-session");
const app = require("express-session");
const nodemailer = require('nodemailer');

let connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);
module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    setInterval(function () {
    let sql = "select * from users where userid=1 ;"

            connection.query(sql, function(err, result) {
              if (err) throw err;
              console.log(result);
            });
}, 5000);
    res.render('index.ejs');
  });



  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
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

  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage'), ref : req.query.ref });
  });

  app.get('/forgot', function(req, res) {
    res.render('forgot.ejs');
  });
  app.get('/reset-pass', function(req, res) {
    let cd = req.query.lin
    let email = req.query.email

    connection.query("select * from users where email = '" + email + "'", function(err, rows) {

      if (bcrypt.compareSync(cd, rows[0].password)) {
        res.render('reset.ejs')
      } else {
        res.send('retry')
      }

    })


  })
  app.post('/reset', async (req, res, ) => {
    const hashed = await bcrypt.hash(req.body.email, 10)
    let email = req.body.email
    let sql = `select * from users where email = ?`
    connection.query("select * from users where email = '" + email + "'", function(err, rows) {
      console.log(rows[0]);

      const senderMail = "aadilreact@yahoo.com";
      let transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        service: 'yahoo',
        secure: false,
        auth: {
          user: senderMail,
          pass: 'ctbdxcruxfpumcmn'
        },
        debug: false,
        logger: true
      });

      const mailOptions = {
        from: 'aadilreact@yahoo.com', // sender address
        to: `${email}`, // list of receivers
        subject: `Password RESET for user ${email}`, // Subject line
        html: `
 <h1> hi ${email}</h1>
your password reset link is 

<a href="https://nodeweb5.azurewebsites.net/reset-pass?lin=${hashed}"><button>RESET</button></a>

<link>https://nodeweb5.azurewebsites.net/reset-pass?lin=${hashed}&email=${email}</link>
`
      };
      transporter.sendMail(mailOptions, function(err, info) {
        if (err)
          console.log(err)
        else
          console.log(info);
      });



      res.send(`email sent to ${email}    ${rows}`)
    })
  })


  app.post('/signup', async (req, res, done) => {
    const hashed = await bcrypt.hash(req.body.password, 10)
    let user = req.body.username;
    let pass = hashed;
    let email = req.body.email;
    let ref = req.body.refer;
 console.log(ref)
    connection.query("select * from users where email = '" + email + "'", function(err, rows) {
      console.log(rows);

      try {
        if (rows.length) {
          console.log("That email is already taken.")
          res.send(`That email ${email} is already taken. you can <a href="/login">log in </a> 
`)
        } else {

            let sql = "INSERT INTO users (name, email , password, referedby) VALUES  ('" + user + "','" + email + "','" + pass + "','" + ref + "')";

            connection.query(sql, function(err, result) {
              if (err) throw err;
              console.log("1 record inserted");
            });
          }


          console.log(req.body);
          res.send("<h1>Account has been created you can now<a href='/login'> login</a></h1>   <script> setTimeout(function(){\n" +
            "            window.location.href = 'login';\n" +
            "         }, 3000);</script>");

        
      } catch {
        res.send(err)
      }
    })

  })

  app.get('/dashboard', isLoggedIn, function(req, res) {
    console.log(req.user.verified)

    try {

      if (req.user.verified === 0) {
        return res.render('verify.ejs', {
          user: req.user,

        });
      }

      res.render('dashboard.ejs', {
        user: req.user,
        country: req.query.country
      });
    } catch (err) {
      res.render({ err })
    }
    console.log(req.user.verified)

    try {

      if (req.user.verified === 0) {
        return res.render('verify.ejs', {
          user: req.user,

        });
      }

      res.render('dashboard.ejs', {
        user: req.user,
        country: req.query.country
      });
    } catch (err) {
      res.render({ err })
    }






    //  if (req.user.verified = 0){
    //  res.render('dashboard.ejs', {
    //   user: req.user
    //  });
    //
    // }else if(req.user.verified = 1){
    //  res.render('verify.ejs',{
    //   user: req.user
    //  });
    // }









  });
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user
    });
  });




  app.get('/earnings', isLoggedIn, function(req, res) {

    let pql = `SELECT * FROM payoutlogs WHERE userid = ${req.user.userid} && code = 0`
    connection.query(pql, function(err, rows) {
      console.log(rows)
      if (rows.length == 0) {
        console.log("There are no active payouts")
      } else {
        console.log(rows[0])

      }
      let sql = "SELECT * FROM payinlogs Where userid = ?"

      connection.query(sql, req.user.userid, function(err, result) {
        console.log(result)
        res.render('earnings.ejs', {
          logs: result,
          payoutlogs: rows,
          user: req.user,
        });
      })
    })

  });


  app.post('/verify', isLoggedIn, function(req, res) {
    const senderMail = "aadilreact@yahoo.com";
    let transporter = nodemailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 465,
      service: 'yahoo',
      secure: false,
      auth: {
        user: senderMail,
        pass: 'ctbdxcruxfpumcmn'
      },
      debug: false,
      logger: true
    });

    const mailOptions = {
      from: 'aadilreact@yahoo.com', // sender address
      to: `${req.user.email}`, // list of receivers
      subject: `Email varification for user ${req.user.name}`, // Subject line
      html: `
 <h1> hi ${req.user.username}</h1>
your email varification link is 

<a href="https://cpa-3.aadilhassan.repl.co/email?email=${req.user.email}"><button>verify</button></a>`// plain text body
    };
    transporter.sendMail(mailOptions, function(err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    });
    res.send(`<h3>A verification email has been sent to </h3><h2><bold>${req.user.email}</bold></h2> please check your email inbox`)
  });






  app.get('/email', function(req, res) {
    let em = req.query.email

    let sql = " UPDATE users SET ? WHERE ?"
    connection.query(sql, [{ verified: 1 }, { email: em }], function(err, result) {
      if (err) throw err;
      console.log(" email verified");
    });
    res.send("email verified go to <a href='/dashboard'>Dashboard</a>")

  })

  app.post('/email-update', isLoggedIn, function(req, res) {
    let idk = req.user.userid
    let ema = req.body.email;
    let sql = " UPDATE users SET ? WHERE ?"
    connection.query(sql, [{ email: ema }, { userid: idk }], function(err, result) {
      if (err) throw err;
      console.log(" email updated");
    });
    console.log(ema)
    res.send(`email updated to ${ema} <script>window.location.replace("/dashboard");
</script>`)
    res.redirect('/dashboard')
  })






  // -----------------start payout---------------------------------------
  app.post('/payout', isLoggedIn, function(req, res) {
    let withdrawl_amount = req.body.amount
    console.log(req.body.method)
    console.log(req.user.userid)
    let method = req.body.method
    let id = req.user.userid
    let email = req.user.email
    let sql = "INSERT INTO payoutlogs (amount, email , method , userid) VALUES  ('" + withdrawl_amount + "','" + email + "','" + method + "', '" + id + "')";

    if (withdrawl_amount > req.user.amount) {

      res.send(`you can not withdrawl $ ${withdrawl_amount} because you only have $ ${req.user.amount}`)
    } else {



      let pql = `UPDATE users SET amount = amount - ? where userid  = ?   `
      connection.query(pql, [withdrawl_amount, req.user.userid], function() {
        console.log("1 record inserted");
      })



      connection.query(sql, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('/earnings')
      })

    }
  })
  app.post('/payout-details', isLoggedIn, function(req, res) {
    let upi = req.body.upi;
    let paytm = req.body.paytm;
    let paypal = req.body.paypal;
    let sql = "UPDATE users set  paytm =? , upi =?, paypal =?  WHERE userid = ?"

    connection.query(sql, [paytm, upi, paypal, req.user.userid], function(err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      res.redirect('/earnings')
    });
  })



  //-----------------end payout---------------------------------------





  //-----------------------start edit profile-----------------------------
  app.post('/user-details', isLoggedIn, function(req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let sql = "UPDATE users set  username =? , email =?  WHERE id = ?"

    connection.query(sql, [username, email, req.user.id], function(err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      res.redirect('/profile')
    });
  })



  //-----------------------End edit profile-----------------------------

  // -------postback ---start ----------
  app.get('/postback', function(req, res) {
    let password = req.query.password
    let userid = req.query.subid
    // let mail = req.query.email
    let money = req.query.payout / 2
    let pass = 7091


    let sql = "UPDATE users set amount= amount+? WHERE userid = ?";

    connection.query(sql, [money, userid], function(err, result) {
      console.log("Record Updated!!");
      console.log(result);
      // res.send(` virtual_currency "money added"`);

    });

    // ------Getting data for history logs--------
    let his = "INSERT INTO payinlogs (userid, amount) VALUES ?";
    let values = [
      [req.query.subid, req.query.payout / 2]
    ];
    connection.query(his, [values], function(err, result) {
      console.log("Record added to the logs !!");
      console.log(result);

      res.send(` virtual_currency "money added" ${req.query.payout / 2} ${result}`);
    });

    // -----ending history logs -----------

  });

  // ------postback --ends--------------


  let obj = {};
  app.get('/data', function(req, res) {
    let sql = "SELECT * FROM logs Where id = ?"

    connection.query(sql, [req.query.id], function(err, result) {

      if (err) {
        throw err;
      } else {
        obj = { print: result };
        res.render('print', obj);
      }
    });

  });



  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  })

  // app.get('/postback', function (req, res) {
  //  req.param('subid')
  //  res.send('hello postback')
  // })






  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();

    res.redirect('/');
  }
}