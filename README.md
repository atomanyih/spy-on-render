# spy-on-render [![Build Status](https://snap-ci.com/atomanyih/spy-on-render/branch/master/build_image)](https://snap-ci.com/atomanyih/spy-on-render/branch/master)


Spy on React components in Jest

## Installation

```
npm install --save-dev spy-on-render
```

Put this in your `setupTests.js`:

```js
import { Matchers } from 'spy-on-render';

expect.extends(Matchers)
```


## Usage

### spyOnRender

Just call it:

```js
import { spyOnRender } from 'spy-on-render';

spyOnRender(Component);
```

The component will render `null` and you can track how many times it has been rendered and with which props.

### createComponentSpy

For functional components, use `jest.mock`

```js
jest.mock('path/to/component', () => require('spy-on-render').createComponentSpy());
```

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

### Helpers

what props were rendered last?

```js
propsOnLastRender(Component)
```

what props were rendered at some other point in time?

```js
propsOnRenderAt(Component, i)
```
