var express = require('express');
var mustache = require('mustache-express');
const cookieSession = require('cookie-session');

const app = express();
const bodyParser = require('body-parser');
let flash = require('express-flash');

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static('public'));

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');
app.use(flash());

app.use(cookieSession({
  secret: 'mot-de-passe-du-cookie'
}));

let userModel = require('./models/userModel');

// ----------------------------------------------------------------------------------
app.get('/', function (req, res) {
  res.render('index');
})

app.get('/signInPage', function (req, res) {
  res.render('signInPage');
})

app.get('/signUpPage', function (req, res) {
  res.render('signUpPage');
})

app.get('/signOut', function (req, res) {
  req.session = null;
  res.redirect('/');
})



app.post('/signInPage', function (req, res) {
  let email = req.body.email;
  let password = req.body.password;
  let verifyId = userModel.loginBuddy(email, password);
  if (verifyId === -1) {
    req.flash('logError', 'email or password incorrect');
    res.redirect('/signInPage');
  }

  req.session.sessionId = verifyId;
  res.redirect('/homePage');
})

app.post('/signUpPage', function (req, res) {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;

  if (password !== confirmPassword) {
    req.flash('regError', "passwords don't match");
    res.redirect('/signUpPage');
  }

  else if (userModel.nameExist(name) !== -1) {
    req.flash('regError', "name is already taken");
    res.redirect('/signUpPage');
  }

  else if (userModel.emailExist(email) !== -1) {
    req.flash('regError', "another account used this email");
    res.redirect('/signUpPage');
  }
  else {
    userModel.insertUser(name, email, password);
    req.flash('reg', "account was successfully created!");
    res.redirect('/signInPage');


  }

})



// User needs to be connected for everything beyond this point 
app.use(isAuthenticated);

app.get('/homePage', function (req, res) {
  res.render('homePage');
})

app.get('/profilePage', function (req, res) {
  res.render('profilePage');
})

app.get('/editAccount', function (req, res) {
  res.render('editAccount');
})

app.get('/myProfile', function (req, res) {
  res.redirect('/profilePage');
})






/*
* This is a middleware function that tests if the user is connected when he wants to
* access pages that require an authentification.
*/
function isAuthenticated(req, res, next) {
  // checks if a session is open
  if (req.session.sessionId !== undefined) {
    res.locals.isConnected = true;
    return next();
  }

  res.status(401).send("Please sign in before you proceed");
}




app.listen(5000, () => console.log('listening on http://localhost:5000'));
