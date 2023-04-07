/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.svelte", "./**/*.ts"],
    theme: {
        extend: {
            borderRadius: {
                DEFAULT: "12px"
            }
        }
    },
    plugins: []
}
