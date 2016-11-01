module.exports = {
  propsOnLastRender(componentClass) {
    return componentClass.prototype.render.calls.mostRecent().object.props;
  },
  propsOnRenderAt(componentClass, i) {
    return componentClass.prototype.render.calls.all()[i].object.props;
  }
};