var express = require('express');
var mustache = require('mustache-express');
const cookieSession = require('cookie-session');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static('public'));

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');


app.use(cookieSession({
    secret: 'mot-de-passe-du-cookie'
  }));
// ----------------------------------------------------------------------------------
app.get('/', function (req, res) {
    res.render('index');
  })

  app.get('/signInPage', function (req, res) {
    res.render('signInPage');
  })

  app.post('/signInPage', function (req, res) {
    let email = req.body.email;
    let password = req.body.password;

  })


app.listen(5000, () => console.log('listening on http://localhost:5000'));
