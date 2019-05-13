const createComponentSpy = (renderFn = () => null) => {
  const spy = jest.fn();

  const Component = (props) => {
    spy(props);
    return renderFn(props)
  };

  Component._renderSpy = spy;

  return Component
};

export default createComponentSpy;