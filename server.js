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

  app.get('/signOut', function (req, res) {
    req.session = null;
    res.redirect('/');
  })


  app.post('/signInPage', function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let verifyId = userModel.loginBuddy(email,password);
    if (verifyId == -1) {
      req.flash('logError', 'email or password incorrect');
      res.redirect('/signInPage');
    }
    else {
        req.session.sessionId = verifyId;
        res.redirect('/');
    }
  })


app.listen(5000, () => console.log('listening on http://localhost:5000'));
