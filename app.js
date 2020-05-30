require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const router = require('./routes/index');

const limiter = require('./middlewares/rate-limiter');

const { PORT, DATABASE_URL, DB_PARAMS } = require('./config.js');

const app = express();

mongoose.connect(DATABASE_URL, DB_PARAMS);

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(limiter, router);

app.listen(PORT);
