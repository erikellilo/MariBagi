import { createGlobalStyle, css } from "styled-components";

const GlobalStyles = createGlobalStyle`
:root {

  /* Green */
  --color-green-100: #F2F8F2;
  --color-green-500: #8cc084;
  --color-green-900: #080D07;

  /* Red */
  --color-red-100: #FFD6E6;
  --color-red-500: #FF70A6;
  --color-red-800: #F5005E;
  --color-red-900: #140008;

  /* Blue */
  --color-blue-100 : #EBF9FF;
  --color-blue-500 : #70D6FF;
  --color-blue-900: #000F14;

  /* Grey */
  --color-grey-0: #FFFFFF;
  --color-grey-500: var(--color-gray-500);
  --color-grey-900: #0D0014;



  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);

  --border-radius-tiny: 3px;
  --border-radius-sm: 5px;
  --border-radius-md: 7px;
  --border-radius-lg: 9px;

  /* For dark mode */
  --image-grayscale: 0;
  --image-opacity: 100%;

  --color-green-50: #F7FBF7;
  --color-green-200: #DFF0DE;
  --color-green-300: #C5E3C2;
  --color-green-400: #A8D3A4;
  --color-green-600: #71A668;
  --color-green-700: #517F48;
  --color-green-800: #2E5327;

  --color-red-50: #FFEAF2;
  --color-red-200: #FFC0D8;
  --color-red-300: #FFA0C2;
  --color-red-400: #FF8CB4;
  --color-red-600: #FF4D8A;
  --color-red-700: #FA1E72;

  --color-blue-50: #F5FCFF;
  --color-blue-200: #D6F2FF;
  --color-blue-300: #B4E8FF;
  --color-blue-400: #94DFFF;
  --color-blue-600: #50C5FF;
  --color-blue-700: #1A9CDF;
  --color-blue-800: #00527A;

  --color-gray-0: #FFFFFF;
  --color-gray-50: #FCF7FF;
  --color-gray-100: #F0EDF5;
  --color-gray-200: #E0DCE8;
  --color-gray-300: #C8C2D1;
  --color-gray-400: #AAA0B3;
  --color-gray-500: #8A8294;
  --color-gray-600: #6B6475;
  --color-gray-700: #4D4557;
  --color-gray-800: #2E2933;
  --color-gray-900: #0D0014;

  --color-grey-200: var(--color-gray-200);
  --color-grey-600: var(--color-gray-600);
  --color-grey-700: var(--color-gray-700);

  --color-brand-50: var(--color-green-50);
  --color-brand-100: var(--color-green-100);
  --color-brand-200: var(--color-green-200);
  --color-brand-300: var(--color-green-300);
  --color-brand-400: var(--color-green-400);
  --color-brand-500: var(--color-green-500);
  --color-brand-600: var(--color-green-600);
  --color-brand-700: var(--color-green-700);
  --color-brand-800: var(--color-green-800);
  --color-brand-900: var(--color-green-900);

  --color-bg: var(--color-gray-0);
  --color-bg-secondary: var(--color-gray-50);
  --color-bg-tertiary: var(--color-gray-100);
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-text-muted: var(--color-gray-400);
  --color-text-inverse: var(--color-gray-0);
  --color-border: var(--color-gray-200);
  --color-border-strong: var(--color-gray-300);
  --color-brand-primary: var(--color-brand-500);
  --color-brand-hover: var(--color-brand-600);
  --color-brand-active: var(--color-brand-700);
  --color-focus-ring: var(--color-brand-500);
  --color-danger: var(--color-red-800);
  --color-danger-hover: var(--color-red-700);
  --color-accent: var(--color-blue-500);

  --font-family: "Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  --font-size-display: 2.4rem;
  --font-size-h1: 2.0rem;
  --font-size-h2: 1.8rem;
  --font-size-h3: 1.6rem;
  --font-size-body: 1.6rem;
  --font-size-body-sm: 1.4rem;
  --font-size-caption: 1.2rem;
  --font-weight-bold: 700;
  --font-weight-semibold: 600;
  --font-weight-regular: 400;
  --line-height-tight: 1.2;
  --line-height-normal: 1.4;
  --line-height-relaxed: 1.5;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  --shadow-card: rgba(25, 25, 25, 0.027) 0px 8px 12px 0px, rgba(25, 25, 25, 0.027) 0px 2px 6px 0px;
  --shadow-card-hover: rgba(0, 0, 0, 0.01) 0px 1px 3px 0px, rgba(0, 0, 0, 0.02) 0px 3px 7px 0px, rgba(0, 0, 0, 0.02) 0px 7px 15px 0px, rgba(0, 0, 0, 0.04) 0px 14px 28px 0px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;

  /* Creating animations for dark mode */
  transition: background-color 0.3s, border 0.3s;
}

html {
  font-size: 62.5%;
}

body {
  font-family: "Nunito Sans", sans-serif;
  color: var(--color-grey-700);

  transition: color 0.3s, background-color 0.3s;
  min-height: 100vh;
  line-height: 1.5;
  font-size: 1.6rem;
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
}

*:disabled {
  cursor: not-allowed;
}

select:disabled,
input:disabled {
  background-color: var(--color-grey-200);
  color: var(--color-grey-500);
}

input:focus,
button:focus,
textarea:focus,
select:focus {
  outline: 2px solid var(--color-brand-600);
  outline-offset: -1px;
}

input::placeholder {
  color:var(--color-gray-500);
}

/*  arent selector, finally 😃 */
button:has(svg) {
  line-height: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  hyphens: auto;
}

img {
  max-width: 100%;

  /* For dark mode */
  filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
}

`;

const BackgroundStyle = css``;

export { BackgroundStyle, GlobalStyles };
