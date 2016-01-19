# spy-on-render [![Build Status](https://snap-ci.com/atomanyih/spy-on-render/branch/master/build_image)](https://snap-ci.com/atomanyih/spy-on-render/branch/master)


Spy on React components in Jasmine tests.

**DOES NOT WORK WITH FUNCTIONAL COMPONENTS**. They're functions!

## Installation

```
npm install spy-on-render
```

Put this in your `spec_helper.js`:

```
require('spy-on-render');
```


## Usage

### spyOnRender

Just call it:

```js
spyOnRender(Component);
```

By default, it won't render anything. If you want to render normally:

```js
spyOnRender(Component).and.callThrough();
```

`spyOnRender` returns a spy, so you can do whatever you want with it.

### Matchers

was the component rendered?

```js
expect(Component).toHaveBeenRendered();
```

with specific properties?

```js
expect(Component).toHaveBeenRenderedWithProps({
  className: 'whatever',
  otherProp: 'whocares'
});
```

