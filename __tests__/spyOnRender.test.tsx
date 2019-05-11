import React from 'react';
import ReactDOM from 'react-dom';
import Matchers from '../src/Matchers';
import spyOnRender from '../src/spyOnRender';
import { getPropsOnLastRender, getPropsOnRenderAt } from '../src/helpers';

expect.extend(Matchers);

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenRenderedWithProps: (expectedProps: object) => object;
      toHaveBeenRendered: () => void;
    }

    interface Expect {
      toHaveBeenRenderedWithProps: (expectedProps: object) => object;
      toHaveBeenRendered: () => void;
    }
  }
}

const createComponentClass = () => {
  return class Component extends React.Component {
    theThing = React.createRef<HTMLDivElement>();

    componentDidMount () {
      if (!this.theThing) {
        throw new Error('should not call lifecycle methods');
      }
    }

    render () {
      return (
        <h1 ref={el => this.theThing = el}>HOO BOY</h1>
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

  describe('getPropsOnLastRender', () => {
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
      expect(getPropsOnLastRender(Component)).toEqual(propsOnFirstRender);

      ReactDOM.render(
        <Component {...propsOnSecondRender}/>,
        root
      );

      expect(getPropsOnLastRender(Component)).toEqual(propsOnSecondRender);
    });
  });

  describe('getPropsOnRenderAt', () => {
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
      expect(getPropsOnRenderAt(Component, 0)).toEqual(propsOnFirstRender);
      expect(getPropsOnRenderAt(Component, 1)).toEqual(propsOnSecondRender);
    });
  });

  it('does not pollute', () => {
    ReactDOM.render(<Component />, root);

    expect(root.textContent).toContain('HOO BOY');
  });
});