import React from 'react';
import ReactDOM from 'react-dom';
import Matchers from '../src/Matchers';
import spyOnRender from '../src/spyOnRender';
import { propsOnLastRender, propsOnRenderAt } from '../src/helpers';

expect.extend(Matchers);

const createComponentClass = () => {
  return class Component extends React.Component {
    componentDidMount () {
      if (!this.refs.theThing) {
        throw new Error('should not call lifecycle methods');
      }
    }

    render () {
      return (
        <h1 ref="theThing">HOO BOY</h1>
      );
    }
  };
};

describe('spyOnRender', () => {
  let root;
  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });
  let Component;

  beforeEach(() => {
    Component = createComponentClass();
  });

  it('sanity check', () => {
    ReactDOM.render(<Component />, root);

    expect(root.textContent).toContain('HOO BOY');
  });

  describe('spy', () => {
    it('renders nothing', () => {
      spyOnRender(Component);

      ReactDOM.render(<Component />, root);

      expect(root).not.toContain('HOO BOY');
    });
  });

  describe('toHaveBeenRenderedWithProps', () => {
    beforeEach(() => {
      spyOnRender(Component);
      ReactDOM.render(
        <div>
          <Component className="smokey-dokey" />
          <Component className="hokey-pokey" />
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

      it('errors when props do not match', () => {
        expect(
          () => expect(Component).toHaveBeenRenderedWithProps({
            className: 'smokey-tokey'
          })
        ).toThrowError();
      });

      it('errors helpfully when props do not match', () => {
        try {
          expect(Component).toHaveBeenRenderedWithProps({
            className: 'smokey-tokey'
          })
        } catch (e) {
          expect(e.message).toMatch(/Expected Component to have been rendered with/);
          expect(e.message).toMatch(/but was rendered with/);
        }
      });
    });

    describe('negative matcher', () => {
      it('can match negative', () => {
        expect(Component).not.toHaveBeenRenderedWithProps({
          className: 'stay-wokey'
        });
      });

      it('errors when props do match', () => {
        expect(
          () => expect(Component).not.toHaveBeenRenderedWithProps({
            className: 'smokey-dokey'
          })
        ).toThrowError();
      });

      it('errors helpfully when props match', () => {
        try {
          expect(Component).not.toHaveBeenRenderedWithProps({
            className: 'smokey-dokey'
          })
        } catch (e) {
          expect(e.message).toMatch(/Expected Component not to have been rendered with/)
        }
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
        const { pass, message } = Matchers.toHaveBeenRendered(Component);

        expect(pass).toEqual(false);
        expect(message()).toMatch(/Expected Component to have been rendered/);
      });
    });

    describe('negative matcher', () => {
      it('passes if component was not rendered', () => {
        expect(Component).not.toHaveBeenRendered();
      });

      it('errors helpfully if component was rendered', () => {
        ReactDOM.render(<Component />, root);

        const { pass, message } = Matchers.toHaveBeenRendered(Component);

        expect(pass).toEqual(true);
        expect(message()).toMatch(/Expected Component not to have been rendered/);
      });
    });
  });

  describe('propsOnLastRender', () => {
    const propsOnFirstRender = {foo: 'bar'};
    const propsOnSecondRender = {foo: 'baz'};

    beforeEach(() => {
      spyOnRender(Component);

      ReactDOM.render(
        <Component {...propsOnFirstRender}/>,
        root
      );
    });

    it('returns props from last call to render', () => {
      expect(propsOnLastRender(Component)).toEqual(propsOnFirstRender);

      ReactDOM.render(
        <Component {...propsOnSecondRender}/>,
        root
      );

      expect(propsOnLastRender(Component)).toEqual(propsOnSecondRender);
    });
  });

  describe('propsOnRenderAt', () => {
    const propsOnFirstRender = {foo: 'bar'};
    const propsOnSecondRender = {foo: 'baz'};

    beforeEach(() => {
      spyOnRender(Component);

      ReactDOM.render(
        <div>
          <Component {...propsOnFirstRender}/>
          <Component {...propsOnSecondRender}/>
        </div>,
        root
      );
    });

    it('returns props from last call to render', () => {
      expect(propsOnRenderAt(Component, 0)).toEqual(propsOnFirstRender);
      expect(propsOnRenderAt(Component, 1)).toEqual(propsOnSecondRender);
    });
  });

  it('does not pollute', () => {
    ReactDOM.render(<Component />, root);

    expect(root.textContent).toContain('HOO BOY');
  });
});