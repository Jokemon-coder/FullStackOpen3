module.exports = {
    "plugins": [
        '@stylistic/js'
    ],
    'extends': 'eslint:recommended',
    'rules': {
        '@stylistic/js/indent': [
            'error',
            2
        ],
        '@stylistic/js/linebreak-style': [
            'error',
            'unix'
        ],
        '@stylistic/js/quotes': [
            'error',
            'single'
        ],
        '@stylistic/js/semi': [
            'error',
            'never'
        ]
    },
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "eqeqeq": "error",
        'object-curly-spacing': [
            'error', 'always'
        ],
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ],
        "no-console": 0,
    }
}
