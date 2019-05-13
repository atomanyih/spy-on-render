'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const createComponentSpy = (renderFn = () => null) => {
  const spy = jest.fn();

  const Component = (props) => {
    spy(props);
    return renderFn(props)
  };

  Component._renderSpy = spy;

  return Component
};

const getPropsOnLastRender = (Component) => {
  const propsByRender = getPropsByRender(Component);

  return propsByRender[propsByRender.length - 1];
};

const propsOnLastRender = getPropsOnLastRender;

const getPropsOnRenderAt = (Component, i) => {
  return getPropsByRender(Component)[i];
};

const propsOnRenderAt = getPropsOnRenderAt;

const getPropsByRender = (Component) => {
  if (Component._renderSpy) {
    return Component._renderSpy.mock.calls
      .map(([props]) => props);
  } else {
    return Component.prototype.render.mock.instances
      .map(({ props }) => props);
  }
};

function getDisplayName (componentClass) {
  return componentClass.displayName || componentClass.name;
}

const Matchers = {
  toHaveBeenRendered (Component) {
    const isRendered = getPropsByRender(Component).length > 0;

    if (isRendered) {
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
    const propsByRender = getPropsByRender(Component);

    const matchingProps = propsByRender.find((props) => {
      return this.equals(
        props,
        expectedProps,
      );
    });

    const displayClass = getDisplayName(Component);
    const displayExpected = this.utils.printExpected(expectedProps);

    if (matchingProps) {
      return {
        pass: true,
        message: () => `Expected ${displayClass} not to have been rendered with props ${displayExpected}`
      };
    }

    const displayActual = propsByRender.map((props) => this.utils.printReceived(props)).join('\n');

    return {
      pass: !!matchingProps,
      message: () =>
        `Expected ${displayClass} to have been rendered with props:
${displayExpected}
 
but was rendered with:
${displayActual}`
    };
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

exports.Matchers = Matchers;
exports.createComponentSpy = createComponentSpy;
exports.getPropsByRender = getPropsByRender;
exports.getPropsOnLastRender = getPropsOnLastRender;
exports.getPropsOnRenderAt = getPropsOnRenderAt;
exports.propsOnLastRender = propsOnLastRender;
exports.propsOnRenderAt = propsOnRenderAt;
exports.spyOnRender = spyOnRender;
