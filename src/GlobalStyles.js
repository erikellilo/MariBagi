import { createGlobalStyle, css } from "styled-components";

const GlobalStyles = createGlobalStyle`
:root {
  /* Green */
  --color-brand-50: #e5eae8;
  --color-brand-100: #ccd6d2;
  --color-brand-200: #809890;
  --color-brand-500: #668479;
  --color-brand-600: #4d6f63;
  --color-brand-700: #1a4637;
  --color-brand-800: #013221;
  --color-brand-900: #002d1d;

  /* Grey */
  --color-grey-0: #fff;
  --color-grey-50: #f9faf9;
  --color-grey-100: #f2f5f4;
  --color-grey-200: #ecf0ee;
  --color-grey-300: #e6ebe9;
  --color-grey-400: #ccd6d2;
  --color-grey-500: #99a19e;
  --color-grey-600: #666b69;
  --color-grey-700: #4d504f;
  --color-grey-800: #333635;
  --color-grey-900: #1a1b1a;

  --color-blue-700: #0369a1;
  --color-red-100: #fee2e2;
  --color-red-700: #b91c1c;
  --color-red-800: #991b1b;

  --backdrop-color: rgba(255, 255, 255, 0.1);

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

/* Parent selector, finally 😃 */
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

const BackgroundStyle = css`
  background-color: var(--color-brand-700);
  background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.1) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
`;

export { BackgroundStyle };
export default GlobalStyles;
