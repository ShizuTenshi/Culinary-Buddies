var express = require('express');
var mustache = require('mustache-express');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static('public'));

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');

app.get('/', function (req, res) {
    res.render('index');
  })

app.listen(5000, () => console.log('listening on http://localhost:5000'));
