module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {browsers: ['last 2 Chrome versions']}}],
    ['@babel/preset-react'],
    ['@babel/preset-typescript'],
  ],
  plugins: ['react-hot-loader/babel', 'styled-jsx/babel'],
};
