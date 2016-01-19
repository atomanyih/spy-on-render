const {spyOnRender, customMatchers} = require('./src/spy_on_render');

const {jasmine} = window;

window.spyOnRender = spyOnRender;

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});
