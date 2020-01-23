(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
	(global = global || self, factory(global.SvcPoolReact = {}, global.React));
}(this, (function (exports, React) { 'use strict';

	var React__default = 'default' in React ? React['default'] : React;

	var SvcPoolContext = React__default.createContext(undefined);

	var SvcPoolContextProvider = function SvcPoolContextProvider(_ref) {
	  var value = _ref.value,
	      _ref$context = _ref.context,
	      context = _ref$context === void 0 ? SvcPoolContext : _ref$context,
	      children = _ref.children;
	  var Context = context;
	  return React__default.createElement(Context.Provider, {
	    value: value
	  }, children);
	};

	var createUseSvcPool = function createUseSvcPool() {
	  var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : SvcPoolContext;
	  return function () {
	    return React.useContext(context);
	  };
	};
	var useSvcPool = createUseSvcPool();

	function createUseServices() {
	  var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : SvcPoolContext;
	  var useSvcPool$1 = context === SvcPoolContext ? useSvcPool : function () {
	    return React.useContext(context);
	  };

	  var useServices = function useServices(point) {
	    var svcPool = useSvcPool$1();
	    return React.useMemo(function () {
	      return svcPool && svcPool.getServices(point);
	    }, [svcPool, point]);
	  };

	  return useServices;
	}
	var useServices = createUseServices();

	exports.SvcPoolContext = SvcPoolContext;
	exports.SvcPoolContextProvider = SvcPoolContextProvider;
	exports.createUseServices = createUseServices;
	exports.createUseSvcPool = createUseSvcPool;
	exports.useServices = useServices;
	exports.useSvcPool = useSvcPool;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
