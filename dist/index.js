'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const createComponentSpy = () => {
  const spy = jest.fn();


  const Component = (props) => {
    spy(props);
    return null
  };

  Component._renderSpy = spy;

  return Component
};

function getDisplayName(componentClass) {
  return componentClass.displayName || componentClass.name;
}


const Matchers = {
  toHaveBeenRendered (Component) {
    let isRendered;
    if(Component._renderSpy) {
      isRendered = Component._renderSpy.mock.calls.length > 0;
    } else {
      isRendered = Component.prototype.render.mock.calls.length > 0;
    }

    if(isRendered) {
      return {
        pass: true,
        message: () => `Expected ${getDisplayName(Component)} not to have been rendered`
      };
    }

    return {
      pass: false,
      message: () => `Expected ${getDisplayName(Component)} to have been rendered`
    };
  },

  toHaveBeenRenderedWithProps (Component, expectedProps) {
    let propsByRender;

    if(Component._renderSpy) {
      propsByRender = Component._renderSpy.mock.calls
        .map(([props]) => props);
    } else {
      propsByRender = Component.prototype.render.mock.instances
        .map(({props}) => props);
    }

    const matchingProps = propsByRender.find((props) => {
      return this.equals(
        props,
        expectedProps,
      );
    });

    const displayClass = getDisplayName(Component);
    const displayExpected = this.utils.printExpected(expectedProps);

    if(matchingProps) {
      return {
        pass: true,
        message: () => `Expected ${displayClass} not to have been rendered with props ${displayExpected}`
      }
    }

    const displayActual = this.utils.printReceived(propsByRender);
    return {
      pass: !!matchingProps,
      message: () => `Expected ${displayClass} to have been rendered with props ${displayExpected}, but got ${displayActual}`
    }
  }
};

const REACT_LIFECYCLE_METHODS = [
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  // 'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount'
];

const spyOnRender = (componentClass) => {
  REACT_LIFECYCLE_METHODS.forEach((methodName) => {
    if(componentClass.prototype[methodName]) {
      spyOn(componentClass.prototype, methodName);
    }
  });

  return jest.spyOn(componentClass.prototype, 'render').mockReturnValue(null);
};

const propsOnLastRender = (Component) => {
  let propsByRender;

  if(Component._renderSpy) {
    propsByRender = Component._renderSpy.mock.calls
      .map(([props]) => props);
  } else {
    propsByRender = Component.prototype.render.mock.instances
      .map(({props}) => props);
  }

  return propsByRender[propsByRender.length - 1];
};
const propsOnRenderAt = (Component, i) => {
  let propsByRender;

  if(Component._renderSpy) {
    propsByRender = Component._renderSpy.mock.calls
      .map(([props]) => props);
  } else {
    propsByRender = Component.prototype.render.mock.instances
      .map(({props}) => props);
  }

  return propsByRender[i];
};

exports.Matchers = Matchers;
exports.createComponentSpy = createComponentSpy;
exports.propsOnLastRender = propsOnLastRender;
exports.propsOnRenderAt = propsOnRenderAt;
exports.spyOnRender = spyOnRender;
