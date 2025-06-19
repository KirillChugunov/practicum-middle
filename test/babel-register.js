const register = require('@babel/register').default;

register({
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  only: [/src/, /test/], // указываем явно, что обрабатывать
  ignore: [/node_modules/],
  babelrc: false, // чтобы не мешали .babelrc
  configFile: './babel.config.js'
});