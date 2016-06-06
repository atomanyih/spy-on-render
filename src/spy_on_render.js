import React from 'react';

const REACT_LIFECYCLE_METHODS = [
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  // 'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount'
];

function getDisplayName(componentClass) {
  return componentClass.displayName || componentClass.name;
}

module.exports = {
  spyOnRender(componentClass) {
    REACT_LIFECYCLE_METHODS.forEach((methodName) => (
      spyOn(componentClass.prototype, methodName)
    ));

    return spyOn(componentClass.prototype, 'render').and.returnValue(null);
  },
  customMatchers: {
    toHaveBeenRenderedWithProps(util, customEqualityTesters) {
      return {
        compare(actual, expected) {
          let result = {};

          const mostRecentCall = actual.prototype.render.calls.mostRecent();

          const displayClass = getDisplayName(actual);
          const displayExpected = jasmine.pp(expected);

          if (mostRecentCall) {
            const actualProps = mostRecentCall.object.props;
            result.pass = util.equals(
              actualProps,
              expected,
              customEqualityTesters
            );


            if (result.pass) {
              result.message = `Expected ${displayClass} not to have been rendered with props ${displayExpected}`;
            } else {
              const displayActual = jasmine.pp(actualProps);

              result.message = `Expected ${displayClass} to have been rendered with props ${displayExpected}, but got ${displayActual}`;
            }
          } else {
            result.pass = false;

            result.message = `Expected ${displayClass} to have been rendered with props ${displayExpected}, but it was never rendered`;
          }

          return result;
        }
      };
    },
    toHaveBeenRendered() {
      return {
        compare(actual) {
          let result = {};

          const mostRecentCall = actual.prototype.render.calls.mostRecent();

          const displayClass = getDisplayName(actual);

          if(mostRecentCall) {
            result.pass = true;
            result.message = `Expected ${displayClass} not to have been rendered`;
          } else {
            result.pass = false;
            result.message = `Expected ${displayClass} to have been rendered`;
          }

          return result;
        }
      }
    }
  }
};
