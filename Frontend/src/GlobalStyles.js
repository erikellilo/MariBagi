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
  --color-grey-500: #FCF7FF;
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

export { BackgroundStyle };
export default GlobalStyles;
