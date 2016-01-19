require('./spec_helper');

require('../index');

const React = require('react');
const ReactDOM = require('react-dom');

describe('spyOnRender', () => {
  let Component;

  function itDoesTheThing() {
    it('sanity check', () => {
      ReactDOM.render(<Component />, root);

      expect('#root').toContainText('HOO BOY');
    });

    it('stubs render', () => {
      spyOnRender(Component).and.returnValue(null);

      ReactDOM.render(<Component />, root);

      expect('#root').not.toContainText('HOO BOY');
    });

    describe('toHaveBeenRenderedWithProps', () => {
      beforeEach(() => {
        spyOnRender(Component).and.returnValue(null);
        ReactDOM.render(<Component className="smokey-dokey"/>, root);
      });

      it('matches props', () => {
        expect(Component).toHaveBeenRenderedWithProps({
          className: 'smokey-dokey'
        });
      });

      it('errors', () => {
        pending('how do ya test this');

        expect(() => {
          expect(Component).toHaveBeenRenderedWithProps({
            className: 'smokey-tokey'
          });
        }).toThrowError('Expected Component to have been rendered with props')
      });

      it('can match negative', () => {
        expect(Component).not.toHaveBeenRenderedWithProps({
          className: 'hokey-pokey'
        });
      });
    });

    describe('toHaveBeenRendered', () => {
      beforeEach(() => {
        spyOnRender(Component).and.returnValue(null);
      });

      it('passes if component was rendered', () => {
        ReactDOM.render(<Component />, root);
        expect(Component).toHaveBeenRendered();
      });

      it('matches negative', () => {
        expect(Component).not.toHaveBeenRendered();
      });
    });
  }

  describe('with React.createClass', () => {
    beforeEach(() => {
      Component = React.createClass({
        render() {
          return(
            <h1>HOO BOY</h1>
          );
        }
      });
    });

   itDoesTheThing();
  });

  describe('with class extends', () => {
    beforeEach(() => {
      class Component extends React.Component {
        render() {
          return(
            <h1>HOO BOY</h1>
          );
        }
      }
    });

    itDoesTheThing();
  });
});
