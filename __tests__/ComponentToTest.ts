const ComponentToTest = ({className, foo}: {className?: string, foo?: string}) => {
  throw 'do not call me';
  return null
};

export default ComponentToTest