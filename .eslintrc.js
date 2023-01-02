module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
    },
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],

    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    "rules": {
    }
}
