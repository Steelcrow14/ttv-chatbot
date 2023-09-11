/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#9d5cff',
                'primary-hover': '#ba8dff',
                secondary: 'rgb(14 116 144)',
                'secondary-hover': 'rgb(6 182 212)',
                success: '#018852',
                'success-hover': '#00db84',
                error: '#bb1411',
                'error-hover': '#e91916',
            },
            gridTemplateRows: {
                basicLayout: 'auto 1fr auto',
            },
            gridTemplateColumns: {
                labeledInput: 'auto 1fr',
            },
        },
    },
    plugins: [],
};
