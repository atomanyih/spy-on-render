export const propsOnLastRender = (Component) => {
  let propsByRender;

  if(Component._renderSpy) {
    propsByRender = Component._renderSpy.mock.calls
      .map(([props]) => props)
  } else {
    propsByRender = Component.prototype.render.mock.instances
      .map(({props}) => props);
  }

  return propsByRender[propsByRender.length - 1];
};
export const propsOnRenderAt = (Component, i) => {
  let propsByRender;

  if(Component._renderSpy) {
    propsByRender = Component._renderSpy.mock.calls
      .map(([props]) => props)
  } else {
    propsByRender = Component.prototype.render.mock.instances
      .map(({props}) => props);
  }

  return propsByRender[i];
};