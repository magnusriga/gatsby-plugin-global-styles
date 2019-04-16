import interleave from './interleave';
import isPlainObject from './isPlainObject';
import { EMPTY_ARRAY } from './empties';
import isFunction from './isFunction';
import flatten from './flatten';

function compileStyles(styles, ...functions) {
  const len = arguments.length;
  const interpolations = Array(len > 1 ? len - 1 : 0);
  for (let key = 1; key < len; key += 1) {
    interpolations[key - 1] = functions[key];
  }

  if (isFunction(styles) || isPlainObject(styles)) {
    return flatten(interleave(EMPTY_ARRAY, [styles].concat(interpolations)));
  }

  return flatten(interleave(styles, interpolations));
}

export default compileStyles;
