require('./spec_helper');

require('../index');

const React = require('react');
const ReactDOM = require('react-dom');

describe('spyOnRender', () => {
  let Component;

  function getExpectationResult(block) {
    let expectationPassed, expectationMessage;

    function magicExpect(actual) {
      const expectation = expect(actual);

      const addExpectationResultFake = (pass, result) => {
        expectationPassed = pass;
        expectationMessage = result.message;
      };

      expectation.addExpectationResult = addExpectationResultFake;
      expectation.not.addExpectationResult = addExpectationResultFake;

      return expectation
    }

    block(magicExpect);

    console.log(expectationMessage);

    return {passed: expectationPassed, message: expectationMessage}
  }

  function itDoesTheThing() {
    it('sanity check', () => {
      ReactDOM.render(<Component />, root);

      expect('#root').toContainText('HOO BOY');
    });

    describe('spy', () => {
      it('renders nothing by default', () => {
        spyOnRender(Component);

        ReactDOM.render(<Component />, root);

        expect('#root').not.toContainText('HOO BOY');
      });

      it('can still chain callThrough', () => {
        spyOnRender(Component).and.callThrough();

        ReactDOM.render(<Component />, root);

        expect('#root').toContainText('HOO BOY');
      });
    });

    describe('toHaveBeenRenderedWithProps', () => {
      beforeEach(() => {
        spyOnRender(Component);
        ReactDOM.render(
          <div>
            <Component className="smokey-dokey"/>
            <Component className="hokey-pokey"/>
          </div>,
          root
        );
      });

      describe('positive matcher', () => {
        it('matches props', () => {
          expect(Component).toHaveBeenRenderedWithProps({
            className: 'smokey-dokey'
          });
        });

        it('errors helpfully when props do not match', () => {
          const {passed, message} = getExpectationResult((expect) => {
            expect(Component).toHaveBeenRenderedWithProps({
              className: 'smokey-tokey'
            });
          });

          expect(passed).toEqual(false);
          expect(message).toMatch(/Expected Component to have been rendered with/);
          expect(message).toMatch(/but got/);
        });
      });

      describe('negative matcher', () => {
        it('can match negative', () => {
          expect(Component).not.toHaveBeenRenderedWithProps({
            className: 'stay-wokey'
          });
        });

        it('errors helpfully when props match', () => {
          const {passed, message} = getExpectationResult((expect) => {
            expect(Component).not.toHaveBeenRenderedWithProps({
              className: 'smokey-dokey'
            });
          });

          expect(passed).toEqual(false);
          expect(message).toMatch(/Expected Component not to have been rendered with/);
        });
      });
    });

    describe('toHaveBeenRendered', () => {
      beforeEach(() => {
        spyOnRender(Component);
      });

      describe('positive matcher', () => {

        it('passes if component was rendered', () => {
          ReactDOM.render(<Component />, root);

          expect(Component).toHaveBeenRendered();
        });

        it('errors helpfully if component was not rendered', () => {
          const {passed, message} = getExpectationResult((expect) => {
            expect(Component).toHaveBeenRendered();
          });

          expect(passed).toEqual(false);
          expect(message).toMatch(/Expected Component to have been rendered/);
        });
      });

      describe('negative matcher', () => {
        it('passes if component was not rendered', () => {
          expect(Component).not.toHaveBeenRendered();
        });

        it('errors helpfully if component was rendered', () => {
          ReactDOM.render(<Component />, root);

          const {passed, message} = getExpectationResult((expect) => {
            expect(Component).not.toHaveBeenRendered();
          });

          expect(passed).toEqual(false);
          expect(message).toMatch(/Expected Component not to have been rendered/);
        });
      });
    });
  }

  describe('with React.createClass', () => {
    beforeEach(() => {
      Component = React.createClass({
        componentDidMount() {
          if (!this.refs.theThing) {
            throw new Error('should not call lifecycle methods');
          }
        },
        render() {
          return (
            <h1 ref="theThing">HOO BOY</h1>
          );
        }
      });
    });

    itDoesTheThing();
  });

  describe('with class extends', () => {
    beforeEach(() => {
      class Component extends React.Component {
        componentDidMount() {
          if (!this.refs.theThing) {
            throw new Error('should not call lifecycle methods');
          }
        }

        render() {
          return (
            <h1 ref="theThing">HOO BOY</h1>
          );
        }
      }
    });

    itDoesTheThing();
  });
});
