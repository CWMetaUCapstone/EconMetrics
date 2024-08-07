import {
  require_react
} from "./chunk-32E4H3EV.js";
import {
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/react-plaid-link/dist/index.esm.js
var import_react = __toESM(require_react());
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function unwrapExports(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function createCommonjsModule(fn, module) {
  return module = { exports: {} }, fn(module, module.exports), module.exports;
}
var useScript_1 = createCommonjsModule(function(module, exports) {
  var __rest = commonjsGlobal && commonjsGlobal.__rest || function(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.scripts = void 0;
  exports.scripts = {};
  var checkExisting = function(src) {
    var existing = document.querySelector('script[src="' + src + '"]');
    if (existing) {
      return exports.scripts[src] = {
        loading: false,
        error: null,
        scriptEl: existing
      };
    }
    return void 0;
  };
  function useScript2(_a) {
    var src = _a.src, _b = _a.checkForExisting, checkForExisting = _b === void 0 ? false : _b, attributes = __rest(_a, ["src", "checkForExisting"]);
    var status = src ? exports.scripts[src] : void 0;
    if (!status && checkForExisting && src && isBrowser) {
      status = checkExisting(src);
    }
    var _c = (0, import_react.default.useState)(status ? status.loading : Boolean(src)), loading = _c[0], setLoading = _c[1];
    var _d = (0, import_react.default.useState)(status ? status.error : null), error = _d[0], setError = _d[1];
    (0, import_react.default.useEffect)(function() {
      if (!isBrowser || !src || !loading || error) return;
      status = exports.scripts[src];
      if (!status && checkForExisting) {
        status = checkExisting(src);
      }
      var scriptEl;
      if (status) {
        scriptEl = status.scriptEl;
      } else {
        scriptEl = document.createElement("script");
        scriptEl.src = src;
        Object.keys(attributes).forEach(function(key) {
          if (scriptEl[key] === void 0) {
            scriptEl.setAttribute(key, attributes[key]);
          } else {
            scriptEl[key] = attributes[key];
          }
        });
        status = exports.scripts[src] = {
          loading: true,
          error: null,
          scriptEl
        };
      }
      var handleLoad = function() {
        if (status) status.loading = false;
        setLoading(false);
      };
      var handleError = function(error2) {
        if (status) status.error = error2;
        setError(error2);
      };
      scriptEl.addEventListener("load", handleLoad);
      scriptEl.addEventListener("error", handleError);
      document.body.appendChild(scriptEl);
      return function() {
        scriptEl.removeEventListener("load", handleLoad);
        scriptEl.removeEventListener("error", handleError);
      };
    }, [src]);
    return [loading, error];
  }
  exports.default = useScript2;
  var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
});
unwrapExports(useScript_1);
var useScript_2 = useScript_1.scripts;
var lib = createCommonjsModule(function(module, exports) {
  var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
      "default": mod
    };
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.scripts = exports.default = void 0;
  Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
      return __importDefault(useScript_1).default;
    }
  });
  Object.defineProperty(exports, "scripts", {
    enumerable: true,
    get: function() {
      return useScript_1.scripts;
    }
  });
});
var useScript = unwrapExports(lib);
var lib_1 = lib.scripts;
var renameKeyInObject = function renameKeyInObject2(o, oldKey, newKey) {
  var newObject = {};
  delete Object.assign(newObject, o, _defineProperty({}, newKey, o[oldKey]))[oldKey];
  return newObject;
};
var createPlaidHandler = function createPlaidHandler2(config, creator) {
  var state = {
    plaid: null,
    open: false,
    onExitCallback: null
  };
  if (typeof window === "undefined" || !window.Plaid) {
    throw new Error("Plaid not loaded");
  }
  state.plaid = creator(_objectSpread2(_objectSpread2({}, config), {}, {
    onExit: function onExit(error, metadata) {
      state.open = false;
      config.onExit && config.onExit(error, metadata);
      state.onExitCallback && state.onExitCallback();
    }
  }));
  var open = function open2() {
    if (!state.plaid) {
      return;
    }
    state.open = true;
    state.onExitCallback = null;
    state.plaid.open();
  };
  var submit = function submit2(data) {
    if (!state.plaid) {
      return;
    }
    state.plaid.submit(data);
  };
  var exit = function exit2(exitOptions, callback) {
    if (!state.open || !state.plaid) {
      callback && callback();
      return;
    }
    state.onExitCallback = callback;
    state.plaid.exit(exitOptions);
    if (exitOptions && exitOptions.force) {
      state.open = false;
    }
  };
  var destroy = function destroy2() {
    if (!state.plaid) {
      return;
    }
    state.plaid.destroy();
    state.plaid = null;
  };
  return {
    open,
    submit,
    exit,
    destroy
  };
};
var createPlaid = function createPlaid2(options, creator) {
  var config = renameKeyInObject(options, "publicKey", "key");
  return createPlaidHandler(config, creator);
};
var PLAID_LINK_STABLE_URL = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
var noop = function noop2() {
};
var usePlaidLink = function usePlaidLink2(options) {
  var _useScript = useScript({
    src: PLAID_LINK_STABLE_URL,
    checkForExisting: true
  }), _useScript2 = _slicedToArray(_useScript, 2), loading = _useScript2[0], error = _useScript2[1];
  var _useState = (0, import_react.useState)(null), _useState2 = _slicedToArray(_useState, 2), plaid = _useState2[0], setPlaid = _useState2[1];
  var _useState3 = (0, import_react.useState)(false), _useState4 = _slicedToArray(_useState3, 2), iframeLoaded = _useState4[0], setIframeLoaded = _useState4[1];
  var products = (options.product || []).slice().sort().join(",");
  (0, import_react.useEffect)(function() {
    if (loading) {
      return;
    }
    if (!options.token && !options.publicKey && !options.receivedRedirectUri) {
      return;
    }
    if (error || !window.Plaid) {
      console.error("Error loading Plaid", error);
      return;
    }
    if (plaid != null) {
      plaid.exit({
        force: true
      }, function() {
        return plaid.destroy();
      });
    }
    var next = createPlaid(_objectSpread2(_objectSpread2({}, options), {}, {
      onLoad: function onLoad() {
        setIframeLoaded(true);
        options.onLoad && options.onLoad();
      }
    }), window.Plaid.create);
    setPlaid(next);
    return function() {
      return next.exit({
        force: true
      }, function() {
        return next.destroy();
      });
    };
  }, [loading, error, options.publicKey, options.token, products]);
  var ready = plaid != null && (!loading || iframeLoaded);
  var openNoOp = function openNoOp2() {
    if (!options.token) {
      console.warn("react-plaid-link: You cannot call open() without a valid token supplied to usePlaidLink. This is a no-op.");
    }
  };
  return {
    error,
    ready,
    submit: plaid ? plaid.submit : noop,
    exit: plaid ? plaid.exit : noop,
    open: plaid ? plaid.open : openNoOp
  };
};
var _excluded = ["children", "style", "className"];
var PlaidLink = function PlaidLink2(props) {
  var children = props.children, style = props.style, className = props.className, config = _objectWithoutProperties(props, _excluded);
  var _usePlaidLink = usePlaidLink(_objectSpread2({}, config)), error = _usePlaidLink.error, open = _usePlaidLink.open;
  return import_react.default.createElement("button", {
    disabled: Boolean(error),
    type: "button",
    className,
    style: _objectSpread2({
      padding: "6px 4px",
      outline: "none",
      background: "#FFFFFF",
      border: "2px solid #F1F1F1",
      borderRadius: "4px"
    }, style),
    onClick: function onClick() {
      return open();
    }
  }, children);
};
PlaidLink.displayName = "PlaidLink";
var PlaidEmbeddedLink = function PlaidEmbeddedLink2(props) {
  var style = props.style, className = props.className, onSuccess = props.onSuccess, onExit = props.onExit, onLoad = props.onLoad, onEvent = props.onEvent, token = props.token, receivedRedirectUri = props.receivedRedirectUri;
  var config = (0, import_react.useMemo)(function() {
    return {
      onSuccess,
      onExit,
      onLoad,
      onEvent,
      token,
      receivedRedirectUri
    };
  }, [onSuccess, onExit, onLoad, onEvent, token, receivedRedirectUri]);
  var _useScript = useScript({
    src: PLAID_LINK_STABLE_URL,
    checkForExisting: true
  }), _useScript2 = _slicedToArray(_useScript, 2), loading = _useScript2[0], error = _useScript2[1];
  var embeddedLinkTarget = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(function() {
    if (loading) {
      return;
    }
    if (error || !window.Plaid) {
      console.error("Error loading Plaid", error);
      return;
    }
    if (config.token == null || config.token == "") {
      console.error("A token is required to initialize embedded Plaid Link");
      return;
    }
    var _window$Plaid$createE = window.Plaid.createEmbedded(_objectSpread2({}, config), embeddedLinkTarget.current), destroy = _window$Plaid$createE.destroy;
    return function() {
      destroy();
    };
  }, [loading, error, config, embeddedLinkTarget]);
  return import_react.default.createElement("div", {
    style,
    className,
    ref: embeddedLinkTarget
  });
};
var PlaidLinkStableEvent;
(function(PlaidLinkStableEvent2) {
  PlaidLinkStableEvent2["OPEN"] = "OPEN";
  PlaidLinkStableEvent2["EXIT"] = "EXIT";
  PlaidLinkStableEvent2["HANDOFF"] = "HANDOFF";
  PlaidLinkStableEvent2["SELECT_INSTITUTION"] = "SELECT_INSTITUTION";
  PlaidLinkStableEvent2["ERROR"] = "ERROR";
  PlaidLinkStableEvent2["BANK_INCOME_INSIGHTS_COMPLETED"] = "BANK_INCOME_INSIGHTS_COMPLETED";
  PlaidLinkStableEvent2["IDENTITY_VERIFICATION_PASS_SESSION"] = "IDENTITY_VERIFICATION_PASS_SESSION";
  PlaidLinkStableEvent2["IDENTITY_VERIFICATION_FAIL_SESSION"] = "IDENTITY_VERIFICATION_FAIL_SESSION";
})(PlaidLinkStableEvent || (PlaidLinkStableEvent = {}));
export {
  PlaidEmbeddedLink,
  PlaidLink,
  PlaidLinkStableEvent,
  usePlaidLink
};
//# sourceMappingURL=react-plaid-link.js.map
