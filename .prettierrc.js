/** @type {import("prettier").Config} */
const config = {
    trailingComma: 'es5',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    plugins: ['prettier-plugin-tailwindcss'],
    tailwindConfig: './tailwind.config.js',
    tailwindFunctions: ['cn'],
};

module.exports = config;
