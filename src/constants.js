export const SC_ATTR = (typeof process !== 'undefined' && process.env.SC_ATTR) || 'gatsby-plugin-global-styles';
export const IS_BROWSER = typeof window !== 'undefined' && 'HTMLElement' in window;
