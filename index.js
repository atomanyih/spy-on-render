const {spyOnRender, customMatchers} = require('./src/spy_on_render');
const Helpers = require('./src/helpers');

const {jasmine} = global;

Object.assign(global, {
  spyOnRender,
  ...Helpers
});

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});
