# gatsby-plugin-global-styles

A Gatsby plugin for creating independent global CSS styles with minimal configuration.

The plugin does not rely on any other packages.

## Install

`npm install --save gatsby-plugin-global-styles`

## Why to use

It might be desirable to use more than one styling method for your Gatsby site. For instance, your site might be using `styled-components`, `typography.js` and `Material-UI`. If you want to add your own **global** styling to this mix, it is important that the order of the `style` tags in the website's `<head>` element is correct. The order of `style` tags in `<head>` is important, as properties in the lower `style` tags overwrite the same properties in `style` tags above it. In effect, the lower `style` tags take priority.

`gatsby-plugin-global-styles` allows you to combine your own style files into one collective global style tag, and make sure that global style ends up where you want them to be in the `<head>` element. By default, the global style tag created with this plugin end up at the top of `<head>`, only with `typography.js` above it (if installed).

As inspiration, a global style could for instance include your own personal global style sheet with style sheets such as `reset`, `normalize`, etc.

By using `gatsby-plugin-typography` and specifying the path to your `GlobalStyleComponent.js` file via the `pathToConfigModule` option (see below), the compilation and injection of your global styles is taken care of by helper methods under the hood.

Lastly, it is also possible to pass in props, like a theme, to global styles using this plugin. See below for instructions.

## How to use

In `gatsby-config.js`:

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-global-styles`,
      options: {
        pathToConfigModule: `src/utils/GlobalStyleComponent`,
      },
    },
  ],
}
```

In `src/utils/GlobalStyleComponent`:

```javascript
import { createGlobalStyle } from 'gatsby-plugin-global-styles';
import reset from '../styles/reset';
import globalStyle from '../styles/globalStyle';

const GlobalStyleComponent = createGlobalStyle`
  ${reset}
  ${globalStyle}
`;

export default GlobalStyleComponent;
```

Here, `reset` and `globalStyle` are two JavaScript files that each contain their own global styles that we want to compile into one global style element.

As an example, in `src/styles/globalStyle`:

```javascript
import { css } from 'gatsby-plugin-global-styles';

const globalStyles = css`
  .my-class2 {
    margin-bottom: 10rem;
  }

  html {
    background-color: blue;
  }
`;

export default globalStyles;
```

## Options

- `pathToConfigModule`: (string) The path to the file in which you export your global style component.

## How to use props (like theme) in a global styles file

To use props in a global style, we must ensure the correct props are passed down to the GlobalStyleComponent. This is done by injecting the component in the `wrapRootElement` API of your own `gatsby-ssr.js` and/or `gatsby-browser.js`.

In `gatsby-ssr.js` and/or `gatsby-browser.js`:

```javascript
import GlobalStyleComponent from './src/styles/GlobalStyleComponent';

// MUI theme
import theme from './src/styles/theme';

export const onRenderBody = ({ setHeadComponents, pathname }) => {
  const StyleComponent = GlobalStyleComponent.globalStyle.ReactStyleComponent;
  setHeadComponents([<StyleComponent key={GlobalStyleComponent.globalStyle.elementId} whiteColor theme={theme} />]);
};
```

In `src/styles/globalStyle`:

```javascript
import { css } from 'gatsby-plugin-global-styles';

const globalStyles = css`
  body {
    color: ${props => (props.whiteColor ? 'white' : 'black')};
    font-family: ${props => props.theme.typography.fontFamily};
  }
`;

export default globalStyles;
```

## How to reorder the style tag in the head element

In `gatsby-ssr.js`:

```javascript
function promote(toTop, array) {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].key === toTop) {
      const a = array.splice(i, 1);
      array.unshift(a[0]);
      break;
    }
  }
}

export const onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  const headComponents = getHeadComponents();
  promote('nfront-global-style', headComponents);
  promote('TypographyStyle', headComponents);

  replaceHeadComponents(headComponents);
};
```

## Full example

A full example, including `gatsby-plugin-global-styles`, `typography.js`, `Material-UI` and `styled-components` can be found in the starter: `gatsby-starter-global-styles`.

## Syntax highlighting

It is easy to add syntax highlighting. See the [styled-components docs](https://www.styled-components.com/docs/tooling#syntax-highlighting) for extensions that enable this in various IDEs.

For `Visual Studio Code`, the [Babel JavaScript](https://marketplace.visualstudio.com/items?itemName=mgmcdermott.vscode-language-babel) plugin is one option that works well.