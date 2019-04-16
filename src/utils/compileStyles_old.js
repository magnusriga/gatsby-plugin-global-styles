const checkType =
  typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? obj => {
        return typeof obj;
      }
    : obj => {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj;
      };

// Check if Object and not Array etc.
const isPlainObject = x => {
  return (typeof x === 'undefined' ? 'undefined' : checkType(x)) === 'object' && x.constructor === Object;
};

// STYLES format
/*
[
  .ruleSetOne {
    color: red;
  }
  ....
]
*/
const compileStyles = styles =>
  // reducer args: (accumulator, currentValue, index)
  styles.reduce((stylesStr, ruleSetObject, selector) => {
    let newStylesStr = {};
    newStylesStr = `${stylesStr} ${selector}{`;
    ruleSetObject.forEach((value, property) => {
      if (isPlainObject(value)) {
        const newObject = {};
        newObject[property] = value;
        newStylesStr += compileStyles(newObject); // eslint-disable-line
      } else {
        let newStyle = `${decamelize(property, '-')}:${value};`; // eslint-disable-line
        // If the property is prefixed, add an additional dash at the beginning.
        const prefixes = ['Webkit', 'ms', 'Moz', 'O'];
        prefixes.forEach(prefix => {
          if (property.slice(0, prefix.length) === prefix) {
            newStyle = `-${newStyle}`;
          }
        });
        newStylesStr += newStyle;
      }
    });
    newStylesStr += '}'; // eslint-disable-line
    return newStylesStr;
  }, '');

export default (styles, options) => {
  // Compile styles to string.
  let stylesStr = compileStyles(styles);

  if (options) {
    const optionStr = compileStyles(options);
    stylesStr = `${optionStr}${stylesStr}`;
  }

  return stylesStr;
};
