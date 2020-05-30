// config.js

module.exports.PORT = process.env.PORT || 3000;
module.exports.DATABASE_URL = 'mongodb://localhost:27017/diplom';
module.exports.JWT_SECRET = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret';
module.exports.DB_PARAMS = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
module.exports.messages = {
  wrongUserPassword: 'Неправильный пользователь или пароль',
  wrongId: 'Нет документа с таким id',
  permissionDenied: 'У Вас недостаточно прав на совершение операции',
  userExists: 'Пользователь уже зарегистрирован. Войти в систему?',
  authorError: 'Необходима авторизация',
  resourceNotFound: 'Запрашиваемый ресурс не найден',
  serverError: 'На сервере произошла ошибка',
  noArticle: 'На сервере нет Ваших статей',
};
