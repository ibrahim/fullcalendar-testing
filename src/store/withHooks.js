import React from "react";

const withHooks = mapHooksToProps => WrappedComponent => {
  return props => {
    let hookProps = mapHooksToProps(props);
    return <WrappedComponent {...hookProps} {...props} />;
  };
};

export default withHooks;

