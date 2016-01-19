require('jasmine_dom_matchers');
const $ = require('jquery');

Object.assign(global, {
  $,
});

beforeEach(() => {
  $('body').find('#root').remove().end().append('<div id="root"/>');
});
