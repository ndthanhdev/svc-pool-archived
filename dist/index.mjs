import React, { useContext, useMemo } from 'react';

var SvcPoolContext = React.createContext(undefined);

var SvcPoolContextProvider = function SvcPoolContextProvider(_ref) {
  var value = _ref.value,
      _ref$context = _ref.context,
      context = _ref$context === void 0 ? SvcPoolContext : _ref$context,
      children = _ref.children;
  var Context = context;
  return React.createElement(Context.Provider, {
    value: value
  }, children);
};

var createUseSvcPool = function createUseSvcPool() {
  var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : SvcPoolContext;
  return function () {
    return useContext(context);
  };
};
var useSvcPool = createUseSvcPool();

function createUseServices() {
  var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : SvcPoolContext;
  var useSvcPool$1 = context === SvcPoolContext ? useSvcPool : function () {
    return useContext(context);
  };

  var useServices = function useServices(point) {
    var svcPool = useSvcPool$1();
    return useMemo(function () {
      return svcPool && svcPool.getServices(point);
    }, [svcPool, point]);
  };

  return useServices;
}
var useServices = createUseServices();

export { SvcPoolContext, SvcPoolContextProvider, createUseServices, createUseSvcPool, useServices, useSvcPool };
