const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./src/routes.js');
const requireDir = require('require-dir');

const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(
  '',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  console.log('Database connected')
);
requireDir('./src/models');

app.use(routes);
app.listen(3000, () => {
  console.log('Server running at port 3000');
});
