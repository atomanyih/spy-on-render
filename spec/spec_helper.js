require('phantomjs-polyfill');
require('phantomjs-polyfill-find');
require('babel-polyfill');
const React = require('react');
const ReactDOM = require('react-dom');

require('jasmine_dom_matchers');
const $ = require('jquery');

Object.assign(global, {
  $,
  React,
  ReactDOM,
  createComponentClass () {
    return class Component extends React.Component {
      componentDidMount () {
        if (!this.refs.theThing) {
          throw new Error('should not call lifecycle methods');
        }
      }

      render () {
        return (
          <h1 ref="theThing">HOO BOY</h1>
        );
      }
    };
  }
});

beforeEach(() => {
  $('body').find('#root').remove().end().append('<div id="root"/>');
});
