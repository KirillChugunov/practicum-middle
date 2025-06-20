import register from '@babel/register';

register({
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  only: [/src/, /test/],
  ignore: [/node_modules/],
  babelrc: false,
  configFile: './babel.config.js',
});
