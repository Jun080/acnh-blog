/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                acnhGreen: {
                    100: "#F0FFF5",
                    200: "#82D7AA",
                    300: "#32AE88",
                    400: "#19AD5E",
                    500: "#007D75",
                    600: "#008160",
                    700: "#468254",
                },
                acnhBlue: {
                    50: "#c2e4ee",
                    100: "#98D2E3",
                    200: "#0066FF",
                    300: "#3860BE",
                    500: "#2D6895",
                    600: "#27455C",
                },
                acnhNeutre: {
                    100: "#FFFFFF",
                    200: "#E0E0E0",
                    500: "#6A6A71",
                    600: "#3C3C3C",
                    900: "#000000",
                },
                acnhOrange: {
                    50: "#FDFBF7",
                    100: "#F8EEBC",
                    200: "#F1E26F",
                    300: "#C1B559",
                    500: "#F0D000",
                    600: "#F39E64",
                    700: "#EF8341",
                    800: "#E60012",
                    900: "#6B5C43",
                },
            },
        },
    },
    plugins: [],
};
