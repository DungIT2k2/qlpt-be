const path = require('path');
const express = require('express')
const morgan = require('morgan')
const handlebars = require('express-handlebars');
const app = express()
const port = 3000
const route = require('./routes');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');


//connect db
const db = require('./config/db');
db.connect();

app.use(methodOverride('_method'))

app.use(cookieParser());

// app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, 'resources')));

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

//Template engine
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers:{

  }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

//Routes init
//abcde
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})