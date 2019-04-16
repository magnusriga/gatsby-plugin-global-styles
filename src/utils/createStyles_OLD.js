/**
 * Add css rules to existing styles object
 * INPUT
 *  styles = setStyles(styles, ["html", "body"], {
      color: props.theme.palette.primary,
      background: "red",
      margin: "0 auto",
      paddingTop: 0
    })
 * OUTPUT
    set(styles, `${element}.${prop}`, value)
    {
      html: {
        color: red,
        font-family: sans-serif
      }
      
    }
 * @param {Object} styles - Existing oject, to which styles should be added.
 * @param {string | string[]} els - Single or multiple selectors.
 * @param {Object} rules - Multiple rules, wrapped in object with ruleName (color) as key.
 * @return {Object} - Returns an updated styles object
 */
const setStyles = (styles, els, rules) => {
  const elements = Array.isArray(els) ? els : [els];
  const modifiedStyles = styles;
  elements.forEach(element => {
    rules.forEach((rule, prop) => {
      modifiedStyles[`${element}`][`${prop}`] = rule[prop];
    });
  });
  return modifiedStyles;
};

// Wrap font names in quotes, unless the font name is actually a keyword.
// See https://stackoverflow.com/a/13752149 and https://www.w3.org/TR/CSS2/fonts.html#font-family-prop
const genericFontFamilies = [
  'inherit',
  'default',
  'serif',
  'sans-serif',
  'monospace',
  'fantasy',
  'cursive',
  '-apple-system',
];

const wrapFontFamily = fontFamily => {
  return genericFontFamilies.includes(fontFamily) ? fontFamily : `'${fontFamily}'`;
};

const createStyles = props => {
  let styles = {};

  // Base HTML styles.
  styles = setStyles(styles, 'html', {
    // props.fontFamily is array of string fonts
    fontFamily: props.fontFamily.map(wrapFontFamily).join(','),
    boxSizing: 'border-box',
    overflowY: 'scroll',
  });

  // box-sizing reset.
  styles = setStyles(styles, ['*', '*:before', '*:after'], {
    boxSizing: 'inherit',
  });

  // Base body styles.
  styles = setStyles(styles, 'body', {
    color: props,
    fontFamily: props.bodyFontFamily.map(wrapFontFamily).join(','),
    fontWeight: props.bodyWeight,
    wordWrap: 'break-word',
    fontKerning: 'normal',
    MozFontFeatureSettings: '"kern", "liga", "clig", "calt"',
    msFontFeatureSettings: '"kern", "liga", "clig", "calt"',
    WebkitFontFeatureSettings: '"kern", "liga", "clig", "calt"',
    fontFeatureSettings: '"kern", "liga", "clig", "calt"',
  });

  // Make images responsive.
  styles = setStyles(styles, 'img', {
    maxWidth: '100%',
  });

  return styles;
};

export default createStyles;
