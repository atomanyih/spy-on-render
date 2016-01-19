require('./spec_helper');

const React = require('react');
const ReactDOM = require('react-dom');
const {spyOnRender, customMatchers} = require('../src/spy_on_render');

describe('spyOnRender', () => {
  let Component;

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
  });

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
