# spy-on-render


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

You can also pass a render function if you want to render something specific

```js
// render children
jest.mock('path/to/component', () => require('spy-on-render').createComponentSpy((props) => <div>{props.children}</div>));

// render testId for use with react-testing-library
jest.mock('path/to/component', () => require('spy-on-render').createComponentSpy(() => <div data-testid="my-component"/>));
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
getPropsOnLastRender(Component)
```

what props were rendered at some other point in time?

```js
getPropsOnRenderAt(Component, i)
```

all props in render order

```js
getPropsByRender(Component)
```
