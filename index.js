const {spyOnRender, customMatchers} = require('./src/spy_on_render');

const {jasmine} = global;

global.spyOnRender = spyOnRender;

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});
