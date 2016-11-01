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
    REACT_LIFECYCLE_METHODS.forEach((methodName) => {
      if(componentClass.prototype[methodName]) {
        spyOn(componentClass.prototype, methodName)
      }
    });

    return spyOn(componentClass.prototype, 'render').and.returnValue(null);
  },
  customMatchers: {
    toHaveBeenRenderedWithProps(util, customEqualityTesters) {
      return {
        compare(actual, expected) {
          let result = {};

          const propsByRender = actual.prototype.render.calls.all()
            .map(({object: {props}}) => props);

          const matchingProps = propsByRender.find((props) => {
            return util.equals(
              props,
              expected,
              customEqualityTesters
            );
          });

          const displayClass = getDisplayName(actual);
          const displayExpected = jasmine.pp(expected);

          if (matchingProps) {
            result.pass = true;
            result.message = `Expected ${displayClass} not to have been rendered with props ${displayExpected}`;
          } else {
            result.pass = false;
            const displayActual = jasmine.pp(propsByRender);

            result.message = `Expected ${displayClass} to have been rendered with props ${displayExpected}, but got ${displayActual}`;
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
