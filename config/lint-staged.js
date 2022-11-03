module.exports = {
    'src/**/*.{css,less}': ['stylelint --fix'],
    'src/**/*.{ts,js}': ['prettier --write', 'tslint --fix'],
};
