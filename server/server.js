const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');

require('./models/user');
require('./models/admin');
require('./models/reviewer');
require('./models/comment');
require('./models/bookmark');
require('./models/follow');

const app = express();

app.use(session({ secret: 'secret', cookie: {} }));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/movie', require('./routes/movie'));
app.use('/api/user', require('./routes/user'));
app.use('/api/comment', require('./routes/comment'));

// connect db
mongoose.connect('mongodb://localhost:27017/webdev');

mongoose.connection.on('error', console.error);
mongoose.connection.once('open', async function () {
  console.log('Database connected.');
  app.listen(4000, () => {
    console.log(`Server listening at http://localhost:4000`);
  });
});


