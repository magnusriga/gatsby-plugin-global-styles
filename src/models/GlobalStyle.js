import React from 'react';
import flatten from '../utils/flatten';
import stringifyRules from '../utils/stringifyRules';

export default class GlobalStyle {
  rules;

  compiledStyles;

  elementId;

  constructor(rules, elementId) {
    this.rules = rules;
    this.elementId = elementId;
    this.compiledStyles = '';
    this.ReactStyleComponent = this.ReactStyleComponent.bind(this);
    this.injectStyleInBrowser = this.injectStyleInBrowser.bind(this);
  }

  createStyles(executionContext) {
    const flatCSS = flatten(this.rules, executionContext);
    const css = stringifyRules(flatCSS, '');
    this.compiledStyles = css;
  }

  ReactStyleComponent(props) {
    this.createStyles(props);
    return (
      <style
        id={this.elementId}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: this.compiledStyles,
        }}
      />
    );
  }

  injectStyleInBrowser(props) {
    if (typeof document !== 'undefined') {
      // Create styles
      this.createStyles(props);
      // Replace existing
      if (document.getElementById(this.elementId)) {
        const styleNode = document.getElementById(this.elementId);
        styleNode.innerHTML = this.compiledStyles;
      } else {
        const node = document.createElement('style');
        node.id = this.elementId;
        node.innerHTML = this.compiledStyles;
        const { head } = document;
        if (head.firstChild) {
          head.insertBefore(node, head.firstChild);
        } else {
          head.appendChild(node);
        }
      }
    }
  }
}
