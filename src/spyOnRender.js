const REACT_LIFECYCLE_METHODS = [
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  // 'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount'
];

const spyOnRender = (componentClass) => {
  REACT_LIFECYCLE_METHODS.forEach((methodName) => {
    if(componentClass.prototype[methodName]) {
      spyOn(componentClass.prototype, methodName)
    }
  });

  return jest.spyOn(componentClass.prototype, 'render').mockReturnValue(null);
};

export default spyOnRender;