export const getPropsOnLastRender = (Component) => {
  const propsByRender = getPropsByRender(Component);

  return propsByRender[propsByRender.length - 1];
};

export const propsOnLastRender = getPropsOnLastRender;

export const getPropsOnRenderAt = (Component, i) => {
  return getPropsByRender(Component)[i];
};

export const propsOnRenderAt = getPropsOnRenderAt;

export const getPropsByRender = (Component) => {
  if (Component._renderSpy) {
    return Component._renderSpy.mock.calls
      .map(([props]) => props);
  } else {
    return Component.prototype.render.mock.instances
      .map(({ props }) => props);
  }
};