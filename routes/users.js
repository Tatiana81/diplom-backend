const router = require('express').Router();

const { findUser } = require('../controllers/users');

router.get('/me', findUser);

module.exports = router;
