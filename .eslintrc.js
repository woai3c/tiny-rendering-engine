module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true,
        jest: true,
    },
    extends: ['eslint-config-airbnb-vue3-ts'],
    rules: {
        'lines-between-class-members': 'off',
    },
}
