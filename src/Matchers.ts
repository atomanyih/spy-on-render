import { getPropsByRender } from './helpers';

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

export default Matchers;