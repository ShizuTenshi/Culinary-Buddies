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
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;

  if (password !== confirmPassword) {
    req.flash('regError', "passwords don't match");
    res.redirect('/signUpPage');
  }

  else if (userModel.nameExist(username) !== -1) {
    req.flash('regError', "name is already taken");
    res.redirect('/signUpPage');
  }

  else if (userModel.emailExist(email) !== -1) {
    req.flash('regError', "another account used this email");
    res.redirect('/signUpPage');
  }
  else {
    userModel.insertUser(username, email, password);
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

app.post('/editAccount', function (req, res) {
  let userId = req.session.sessionId; // Get the user ID from the session

  // Retrieve the form data from the request body
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let dietaryPreferences = req.body.dietary;
  let otherDietary = req.body.other_dietary;
  let healthConcerns = req.body.health_concerns;
  let otherHealthConcerns = req.body.other_health_concerns;

  // Update the user's account information in the userModel
  userModel.updateUser(userId, {
    username: username,
    email: email,
    password: password,
    dietaryPreferences: dietaryPreferences,
    otherDietary: otherDietary,
    healthConcerns: healthConcerns,
    otherHealthConcerns: otherHealthConcerns
  });

  req.flash('success', 'Account information updated successfully');
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
