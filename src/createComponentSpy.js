const createComponentSpy = () => {
  const spy = jest.fn();


  const Component = (props) => {
    spy(props);
    return null
  };

  Component._renderSpy = spy;

  return Component
};

export default createComponentSpy;