
function getDisplayName(componentClass) {
  return componentClass.displayName || componentClass.name;
}


const Matchers = {

  toHaveBeenRendered (Component) {
    const pass = Component.prototype.render.mock.calls.length > 0;

    if(pass) {
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
    const propsByRender = Component.prototype.render.mock.instances
      .map(({props}) => props);

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

export default Matchers;