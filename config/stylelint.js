module.exports = {
    extends: [
        'stylelint-config-recommended',
        'stylelint-config-recommended-less',
        'stylelint-config-prettier',
        'stylelint-prettier/recommended',
    ],
    plugins: ['stylelint-less'],
    rules: {

    },
    ignoreFiles: ['src/etc/**/*', 'src/**/vendors/**/*', 'src/**/vendor/**/*'],
};
