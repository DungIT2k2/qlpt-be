const path = require('path');
const express = require('express')
const morgan = require('morgan')
const app = express();
const port = 5000
var cors = require('cors')
const route = require('./routes');
var cookieParser = require('cookie-parser');
const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require('http-status-codes');

//connect db
const db = require('./config/db');
db.connect();

app.use(cors())

app.use(cookieParser());

// app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, 'resources')));

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).send("Hello World");
});

//Routes init
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

module.exports = app;