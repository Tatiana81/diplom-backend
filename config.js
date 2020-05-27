// config.js

module.exports.PORT = process.env.PORT || 3000;
module.exports.DATABASE_URL = 'mongodb://localhost:27017/diplom';
module.exports.JWT_SECRET = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret';
