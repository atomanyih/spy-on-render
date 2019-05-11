function getDisplayName (componentClass) {
  return componentClass.displayName || componentClass.name;
}

const Matchers = {
  toHaveBeenRendered (Component) {
    let isRendered;
    if (Component._renderSpy) {
      isRendered = Component._renderSpy.mock.calls.length > 0;
    } else {
      isRendered = Component.prototype.render.mock.calls.length > 0;
    }

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
    let propsByRender;

    if (Component._renderSpy) {
      propsByRender = Component._renderSpy.mock.calls
        .map(([props]) => props);
    } else {
      propsByRender = Component.prototype.render.mock.instances
        .map(({ props }) => props);
    }

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

export default Matchers;