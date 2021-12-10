"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = vueFactory;

function vueFactory(exports) {
  'use strict';
  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   * IMPORTANT: all calls of this function must be prefixed with
   * \/\*#\_\_PURE\_\_\*\/
   * So that rollup can tree-shake them if necessary.
   */

  function makeMap(str, expectsLowerCase) {
    var map = Object.create(null);
    var list = str.split(',');

    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }

    return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
  }

  var GLOBALS_WHITE_LISTED = 'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' + 'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' + 'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt';
  var isGloballyWhitelisted = /*#__PURE__*/makeMap(GLOBALS_WHITE_LISTED);

  function normalizeStyle(value) {
    if (isArray(value)) {
      var res = {};

      for (var i = 0; i < value.length; i++) {
        var item = value[i];
        var normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);

        if (normalized) {
          for (var key in normalized) {
            res[key] = normalized[key];
          }
        }
      }

      return res;
    } else if (isString(value)) {
      return value;
    } else if (isObject(value)) {
      return value;
    }
  }

  var listDelimiterRE = /;(?![^(]*\))/g;
  var propertyDelimiterRE = /:(.+)/;

  function parseStringStyle(cssText) {
    var ret = {};
    cssText.split(listDelimiterRE).forEach(item => {
      if (item) {
        var tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }

  function normalizeClass(value) {
    var res = '';

    if (isString(value)) {
      res = value;
    } else if (isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        var normalized = normalizeClass(value[i]);

        if (normalized) {
          res += normalized + ' ';
        }
      }
    } else if (isObject(value)) {
      for (var name in value) {
        if (value[name]) {
          res += name + ' ';
        }
      }
    }

    return res.trim();
  }

  function normalizeProps(props) {
    if (!props) return null;
    var {
      class: klass,
      style
    } = props;

    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }

    if (style) {
      props.style = normalizeStyle(style);
    }

    return props;
  }
  /**
   * For converting {{ interpolation }} values to displayed strings.
   * @private
   */


  var toDisplayString = val => {
    return val == null ? '' : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
  };

  var replacer = (_key, val) => {
    // can't use isRef here since @vue/shared has no deps
    if (val && val.__v_isRef) {
      return replacer(_key, val.value);
    } else if (isMap(val)) {
      return {
        ["Map(".concat(val.size, ")")]: [...val.entries()].reduce((entries, _ref) => {
          var [key, val] = _ref;
          entries["".concat(key, " =>")] = val;
          return entries;
        }, {})
      };
    } else if (isSet(val)) {
      return {
        ["Set(".concat(val.size, ")")]: [...val.values()]
      };
    } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
      return String(val);
    }

    return val;
  };

  var EMPTY_OBJ = {};
  var EMPTY_ARR = [];

  var NOOP = () => {};
  /**
   * Always return false.
   */


  var NO = () => false;

  var onRE = /^on[^a-z]/;

  var isOn = key => onRE.test(key);

  var isModelListener = key => key.startsWith('onUpdate:');

  var extend = Object.assign;

  var remove = (arr, el) => {
    var i = arr.indexOf(el);

    if (i > -1) {
      arr.splice(i, 1);
    }
  };

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  var hasOwn = (val, key) => hasOwnProperty.call(val, key);

  var isArray = Array.isArray;

  var isMap = val => toTypeString(val) === '[object Map]';

  var isSet = val => toTypeString(val) === '[object Set]';

  var isFunction = val => typeof val === 'function';

  var isString = val => typeof val === 'string';

  var isSymbol = val => typeof val === 'symbol';

  var isObject = val => val !== null && typeof val === 'object';

  var isPromise = val => {
    return isObject(val) && isFunction(val.then) && isFunction(val.catch);
  };

  var objectToString = Object.prototype.toString;

  var toTypeString = value => objectToString.call(value);

  var toRawType = value => {
    // extract "RawType" from strings like "[object RawType]"
    return toTypeString(value).slice(8, -1);
  };

  var isPlainObject = val => toTypeString(val) === '[object Object]';

  var isIntegerKey = key => isString(key) && key !== 'NaN' && key[0] !== '-' && '' + parseInt(key, 10) === key;

  var isReservedProp = /*#__PURE__*/makeMap( // the leading comma is intentional so empty string "" is also included
  ',key,ref,' + 'onVnodeBeforeMount,onVnodeMounted,' + 'onVnodeBeforeUpdate,onVnodeUpdated,' + 'onVnodeBeforeUnmount,onVnodeUnmounted');

  var cacheStringFunction = fn => {
    var cache = Object.create(null);
    return str => {
      var hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };

  var camelizeRE = /-(\w)/g;
  /**
   * @private
   */

  var camelize = cacheStringFunction(str => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');
  });
  var hyphenateRE = /\B([A-Z])/g;
  /**
   * @private
   */

  var hyphenate = cacheStringFunction(str => str.replace(hyphenateRE, '-$1').toLowerCase());
  /**
   * @private
   */

  var capitalize = cacheStringFunction(str => str.charAt(0).toUpperCase() + str.slice(1));
  /**
   * @private
   */

  var toHandlerKey = cacheStringFunction(str => str ? "on".concat(capitalize(str)) : ""); // compare whether a value has changed, accounting for NaN.

  var hasChanged = (value, oldValue) => !Object.is(value, oldValue);

  var invokeArrayFns = (fns, arg) => {
    for (var i = 0; i < fns.length; i++) {
      fns[i](arg);
    }
  };

  var def = (obj, key, value) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      value
    });
  };

  var toNumber = val => {
    var n = parseFloat(val);
    return isNaN(n) ? val : n;
  };

  var _globalThis;

  var getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {});
  };

  var latestNodeId = 1;

  class NVueTextNode {
    constructor(text) {
      this.instanceId = '';
      this.nodeId = latestNodeId++;
      this.parentNode = null;
      this.nodeType = 3;
      this.text = text;
    }

  }

  var activeEffectScope;
  var effectScopeStack = [];

  class EffectScope {
    constructor() {
      var detached = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.active = true;
      this.effects = [];
      this.cleanups = [];

      if (!detached && activeEffectScope) {
        this.parent = activeEffectScope;
        this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
      }
    }

    run(fn) {
      if (this.active) {
        try {
          this.on();
          return fn();
        } finally {
          this.off();
        }
      }
    }

    on() {
      if (this.active) {
        effectScopeStack.push(this);
        activeEffectScope = this;
      }
    }

    off() {
      if (this.active) {
        effectScopeStack.pop();
        activeEffectScope = effectScopeStack[effectScopeStack.length - 1];
      }
    }

    stop(fromParent) {
      if (this.active) {
        this.effects.forEach(e => e.stop());
        this.cleanups.forEach(cleanup => cleanup());

        if (this.scopes) {
          this.scopes.forEach(e => e.stop(true));
        } // nested scope, dereference from parent to avoid memory leaks


        if (this.parent && !fromParent) {
          // optimized O(1) removal
          var last = this.parent.scopes.pop();

          if (last && last !== this) {
            this.parent.scopes[this.index] = last;
            last.index = this.index;
          }
        }

        this.active = false;
      }
    }

  }

  function effectScope(detached) {
    return new EffectScope(detached);
  }

  function recordEffectScope(effect, scope) {
    scope = scope || activeEffectScope;

    if (scope && scope.active) {
      scope.effects.push(effect);
    }
  }

  function getCurrentScope() {
    return activeEffectScope;
  }

  function onScopeDispose(fn) {
    if (activeEffectScope) {
      activeEffectScope.cleanups.push(fn);
    }
  }

  var createDep = effects => {
    var dep = new Set(effects);
    dep.w = 0;
    dep.n = 0;
    return dep;
  };

  var wasTracked = dep => (dep.w & trackOpBit) > 0;

  var newTracked = dep => (dep.n & trackOpBit) > 0;

  var initDepMarkers = _ref2 => {
    var {
      deps
    } = _ref2;

    if (deps.length) {
      for (var i = 0; i < deps.length; i++) {
        deps[i].w |= trackOpBit; // set was tracked
      }
    }
  };

  var finalizeDepMarkers = effect => {
    var {
      deps
    } = effect;

    if (deps.length) {
      var ptr = 0;

      for (var i = 0; i < deps.length; i++) {
        var dep = deps[i];

        if (wasTracked(dep) && !newTracked(dep)) {
          dep.delete(effect);
        } else {
          deps[ptr++] = dep;
        } // clear bits


        dep.w &= ~trackOpBit;
        dep.n &= ~trackOpBit;
      }

      deps.length = ptr;
    }
  };

  var targetMap = new WeakMap(); // The number of effects currently being tracked recursively.

  var effectTrackDepth = 0;
  var trackOpBit = 1;
  /**
   * The bitwise track markers support at most 30 levels of recursion.
   * This value is chosen to enable modern JS engines to use a SMI on all platforms.
   * When recursion depth is greater, fall back to using a full cleanup.
   */

  var maxMarkerBits = 30;
  var effectStack = [];
  var activeEffect;
  var ITERATE_KEY = Symbol('');
  var MAP_KEY_ITERATE_KEY = Symbol('');

  class ReactiveEffect {
    constructor(fn) {
      var scheduler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var scope = arguments.length > 2 ? arguments[2] : undefined;
      this.fn = fn;
      this.scheduler = scheduler;
      this.active = true;
      this.deps = [];
      recordEffectScope(this, scope);
    }

    run() {
      if (!this.active) {
        return this.fn();
      }

      if (!effectStack.includes(this)) {
        try {
          effectStack.push(activeEffect = this);
          enableTracking();
          trackOpBit = 1 << ++effectTrackDepth;

          if (effectTrackDepth <= maxMarkerBits) {
            initDepMarkers(this);
          } else {
            cleanupEffect(this);
          }

          return this.fn();
        } finally {
          if (effectTrackDepth <= maxMarkerBits) {
            finalizeDepMarkers(this);
          }

          trackOpBit = 1 << --effectTrackDepth;
          resetTracking();
          effectStack.pop();
          var n = effectStack.length;
          activeEffect = n > 0 ? effectStack[n - 1] : undefined;
        }
      }
    }

    stop() {
      if (this.active) {
        cleanupEffect(this);

        if (this.onStop) {
          this.onStop();
        }

        this.active = false;
      }
    }

  }

  function cleanupEffect(effect) {
    var {
      deps
    } = effect;

    if (deps.length) {
      for (var i = 0; i < deps.length; i++) {
        deps[i].delete(effect);
      }

      deps.length = 0;
    }
  }

  function effect(fn, options) {
    if (fn.effect) {
      fn = fn.effect.fn;
    }

    var _effect = new ReactiveEffect(fn);

    if (options) {
      extend(_effect, options);
      if (options.scope) recordEffectScope(_effect, options.scope);
    }

    if (!options || !options.lazy) {
      _effect.run();
    }

    var runner = _effect.run.bind(_effect);

    runner.effect = _effect;
    return runner;
  }

  function stop(runner) {
    runner.effect.stop();
  }

  var shouldTrack = true;
  var trackStack = [];

  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }

  function enableTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = true;
  }

  function resetTracking() {
    var last = trackStack.pop();
    shouldTrack = last === undefined ? true : last;
  }

  function track(target, type, key) {
    if (!isTracking()) {
      return;
    }

    var depsMap = targetMap.get(target);

    if (!depsMap) {
      targetMap.set(target, depsMap = new Map());
    }

    var dep = depsMap.get(key);

    if (!dep) {
      depsMap.set(key, dep = createDep());
    }

    trackEffects(dep);
  }

  function isTracking() {
    return shouldTrack && activeEffect !== undefined;
  }

  function trackEffects(dep, debuggerEventExtraInfo) {
    var shouldTrack = false;

    if (effectTrackDepth <= maxMarkerBits) {
      if (!newTracked(dep)) {
        dep.n |= trackOpBit; // set newly tracked

        shouldTrack = !wasTracked(dep);
      }
    } else {
      // Full cleanup mode.
      shouldTrack = !dep.has(activeEffect);
    }

    if (shouldTrack) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
  }

  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    var depsMap = targetMap.get(target);

    if (!depsMap) {
      // never been tracked
      return;
    }

    var deps = [];

    if (type === "clear"
    /* CLEAR */
    ) {
      // collection being cleared
      // trigger all effects for target
      deps = [...depsMap.values()];
    } else if (key === 'length' && isArray(target)) {
      depsMap.forEach((dep, key) => {
        if (key === 'length' || key >= newValue) {
          deps.push(dep);
        }
      });
    } else {
      // schedule runs for SET | ADD | DELETE
      if (key !== void 0) {
        deps.push(depsMap.get(key));
      } // also run for iteration key on ADD | DELETE | Map.SET


      switch (type) {
        case "add"
        /* ADD */
        :
          if (!isArray(target)) {
            deps.push(depsMap.get(ITERATE_KEY));

            if (isMap(target)) {
              deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isIntegerKey(key)) {
            // new index added to array -> length changes
            deps.push(depsMap.get('length'));
          }

          break;

        case "delete"
        /* DELETE */
        :
          if (!isArray(target)) {
            deps.push(depsMap.get(ITERATE_KEY));

            if (isMap(target)) {
              deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }

          break;

        case "set"
        /* SET */
        :
          if (isMap(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
          }

          break;
      }
    }

    if (deps.length === 1) {
      if (deps[0]) {
        {
          triggerEffects(deps[0]);
        }
      }
    } else {
      var effects = [];

      for (var dep of deps) {
        if (dep) {
          effects.push(...dep);
        }
      }

      {
        triggerEffects(createDep(effects));
      }
    }
  }

  function triggerEffects(dep, debuggerEventExtraInfo) {
    // spread into array for stabilization
    for (var _effect2 of isArray(dep) ? dep : [...dep]) {
      if (_effect2 !== activeEffect || _effect2.allowRecurse) {
        if (_effect2.scheduler) {
          _effect2.scheduler();
        } else {
          _effect2.run();
        }
      }
    }
  }

  var isNonTrackableKeys = /*#__PURE__*/makeMap("__proto__,__v_isRef,__isVue");
  var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map(key => Symbol[key]).filter(isSymbol));
  var get = /*#__PURE__*/createGetter();
  var shallowGet = /*#__PURE__*/createGetter(false, true);
  var readonlyGet = /*#__PURE__*/createGetter(true);
  var shallowReadonlyGet = /*#__PURE__*/createGetter(true, true);
  var arrayInstrumentations = /*#__PURE__*/createArrayInstrumentations();

  function createArrayInstrumentations() {
    var instrumentations = {};
    ['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
      instrumentations[key] = function () {
        var arr = toRaw(this);

        for (var i = 0, l = this.length; i < l; i++) {
          track(arr, "get"
          /* GET */
          , i + '');
        } // we run the method using the original args first (which may be reactive)


        for (var _len = arguments.length, args = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
          args[_key2] = arguments[_key2];
        }

        var res = arr[key](...args);

        if (res === -1 || res === false) {
          // if that didn't work, run it again using raw values.
          return arr[key](...args.map(toRaw));
        } else {
          return res;
        }
      };
    });
    ['push', 'pop', 'shift', 'unshift', 'splice'].forEach(key => {
      instrumentations[key] = function () {
        pauseTracking();

        for (var _len2 = arguments.length, args = new Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
          args[_key3] = arguments[_key3];
        }

        var res = toRaw(this)[key].apply(this, args);
        resetTracking();
        return res;
      };
    });
    return instrumentations;
  }

  function createGetter() {
    var isReadonly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var shallow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return function get(target, key, receiver) {
      if (key === "__v_isReactive"
      /* IS_REACTIVE */
      ) {
        return !isReadonly;
      } else if (key === "__v_isReadonly"
      /* IS_READONLY */
      ) {
        return isReadonly;
      } else if (key === "__v_raw"
      /* RAW */
      && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
        return target;
      }

      var targetIsArray = isArray(target);

      if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }

      var res = Reflect.get(target, key, receiver);

      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }

      if (!isReadonly) {
        track(target, "get"
        /* GET */
        , key);
      }

      if (shallow) {
        return res;
      }

      if (isRef(res)) {
        // ref unwrapping - does not apply for Array + integer key.
        var shouldUnwrap = !targetIsArray || !isIntegerKey(key);
        return shouldUnwrap ? res.value : res;
      }

      if (isObject(res)) {
        // Convert returned value into a proxy as well. we do the isObject check
        // here to avoid invalid value warning. Also need to lazy access readonly
        // and reactive here to avoid circular dependency.
        return isReadonly ? readonly(res) : reactive(res);
      }

      return res;
    };
  }

  var set = /*#__PURE__*/createSetter();
  var shallowSet = /*#__PURE__*/createSetter(true);

  function createSetter() {
    var shallow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    return function set(target, key, value, receiver) {
      var oldValue = target[key];

      if (!shallow && !isReadonly(value)) {
        value = toRaw(value);
        oldValue = toRaw(oldValue);

        if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        }
      }

      var hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
      var result = Reflect.set(target, key, value, receiver); // don't trigger if target is something up in the prototype chain of original

      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add"
          /* ADD */
          , key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set"
          /* SET */
          , key, value);
        }
      }

      return result;
    };
  }

  function deleteProperty(target, key) {
    var hadKey = hasOwn(target, key);
    target[key];
    var result = Reflect.deleteProperty(target, key);

    if (result && hadKey) {
      trigger(target, "delete"
      /* DELETE */
      , key, undefined);
    }

    return result;
  }

  function has(target, key) {
    var result = Reflect.has(target, key);

    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has"
      /* HAS */
      , key);
    }

    return result;
  }

  function ownKeys(target) {
    track(target, "iterate"
    /* ITERATE */
    , isArray(target) ? 'length' : ITERATE_KEY);
    return Reflect.ownKeys(target);
  }

  var mutableHandlers = {
    get,
    set,
    deleteProperty,
    has,
    ownKeys
  };
  var readonlyHandlers = {
    get: readonlyGet,

    set(target, key) {
      return true;
    },

    deleteProperty(target, key) {
      return true;
    }

  };
  var shallowReactiveHandlers = /*#__PURE__*/extend({}, mutableHandlers, {
    get: shallowGet,
    set: shallowSet
  }); // Props handlers are special in the sense that it should not unwrap top-level
  // refs (in order to allow refs to be explicitly passed down), but should
  // retain the reactivity of the normal readonly object.

  var shallowReadonlyHandlers = /*#__PURE__*/extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
  });

  var toShallow = value => value;

  var getProto = v => Reflect.getPrototypeOf(v);

  function get$1(target, key) {
    var isReadonly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var isShallow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    // #1772: readonly(reactive(Map)) should return readonly + reactive version
    // of the value
    target = target["__v_raw"
    /* RAW */
    ];
    var rawTarget = toRaw(target);
    var rawKey = toRaw(key);

    if (key !== rawKey) {
      !isReadonly && track(rawTarget, "get"
      /* GET */
      , key);
    }

    !isReadonly && track(rawTarget, "get"
    /* GET */
    , rawKey);
    var {
      has
    } = getProto(rawTarget);
    var wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;

    if (has.call(rawTarget, key)) {
      return wrap(target.get(key));
    } else if (has.call(rawTarget, rawKey)) {
      return wrap(target.get(rawKey));
    } else if (target !== rawTarget) {
      // #3602 readonly(reactive(Map))
      // ensure that the nested reactive `Map` can do tracking for itself
      target.get(key);
    }
  }

  function has$1(key) {
    var isReadonly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var target = this["__v_raw"
    /* RAW */
    ];
    var rawTarget = toRaw(target);
    var rawKey = toRaw(key);

    if (key !== rawKey) {
      !isReadonly && track(rawTarget, "has"
      /* HAS */
      , key);
    }

    !isReadonly && track(rawTarget, "has"
    /* HAS */
    , rawKey);
    return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
  }

  function size(target) {
    var isReadonly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    target = target["__v_raw"
    /* RAW */
    ];
    !isReadonly && track(toRaw(target), "iterate"
    /* ITERATE */
    , ITERATE_KEY);
    return Reflect.get(target, 'size', target);
  }

  function add(value) {
    value = toRaw(value);
    var target = toRaw(this);
    var proto = getProto(target);
    var hadKey = proto.has.call(target, value);

    if (!hadKey) {
      target.add(value);
      trigger(target, "add"
      /* ADD */
      , value, value);
    }

    return this;
  }

  function set$1(key, value) {
    value = toRaw(value);
    var target = toRaw(this);
    var {
      has,
      get
    } = getProto(target);
    var hadKey = has.call(target, key);

    if (!hadKey) {
      key = toRaw(key);
      hadKey = has.call(target, key);
    }

    var oldValue = get.call(target, key);
    target.set(key, value);

    if (!hadKey) {
      trigger(target, "add"
      /* ADD */
      , key, value);
    } else if (hasChanged(value, oldValue)) {
      trigger(target, "set"
      /* SET */
      , key, value);
    }

    return this;
  }

  function deleteEntry(key) {
    var target = toRaw(this);
    var {
      has,
      get
    } = getProto(target);
    var hadKey = has.call(target, key);

    if (!hadKey) {
      key = toRaw(key);
      hadKey = has.call(target, key);
    }

    get ? get.call(target, key) : undefined; // forward the operation before queueing reactions

    var result = target.delete(key);

    if (hadKey) {
      trigger(target, "delete"
      /* DELETE */
      , key, undefined);
    }

    return result;
  }

  function clear() {
    var target = toRaw(this);
    var hadItems = target.size !== 0; // forward the operation before queueing reactions

    var result = target.clear();

    if (hadItems) {
      trigger(target, "clear"
      /* CLEAR */
      , undefined, undefined);
    }

    return result;
  }

  function createForEach(isReadonly, isShallow) {
    return function forEach(callback, thisArg) {
      var observed = this;
      var target = observed["__v_raw"
      /* RAW */
      ];
      var rawTarget = toRaw(target);
      var wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
      !isReadonly && track(rawTarget, "iterate"
      /* ITERATE */
      , ITERATE_KEY);
      return target.forEach((value, key) => {
        // important: make sure the callback is
        // 1. invoked with the reactive map as `this` and 3rd arg
        // 2. the value received should be a corresponding reactive/readonly.
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    };
  }

  function createIterableMethod(method, isReadonly, isShallow) {
    return function () {
      var target = this["__v_raw"
      /* RAW */
      ];
      var rawTarget = toRaw(target);
      var targetIsMap = isMap(rawTarget);
      var isPair = method === 'entries' || method === Symbol.iterator && targetIsMap;
      var isKeyOnly = method === 'keys' && targetIsMap;
      var innerIterator = target[method](...arguments);
      var wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
      !isReadonly && track(rawTarget, "iterate"
      /* ITERATE */
      , isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY); // return a wrapped iterator which returns observed versions of the
      // values emitted from the real iterator

      return {
        // iterator protocol
        next() {
          var {
            value,
            done
          } = innerIterator.next();
          return done ? {
            value,
            done
          } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },

        // iterable protocol
        [Symbol.iterator]() {
          return this;
        }

      };
    };
  }

  function createReadonlyMethod(type) {
    return function () {
      return type === "delete"
      /* DELETE */
      ? false : this;
    };
  }

  function createInstrumentations() {
    var mutableInstrumentations = {
      get(key) {
        return get$1(this, key);
      },

      get size() {
        return size(this);
      },

      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, false)
    };
    var shallowInstrumentations = {
      get(key) {
        return get$1(this, key, false, true);
      },

      get size() {
        return size(this);
      },

      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, true)
    };
    var readonlyInstrumentations = {
      get(key) {
        return get$1(this, key, true);
      },

      get size() {
        return size(this, true);
      },

      has(key) {
        return has$1.call(this, key, true);
      },

      add: createReadonlyMethod("add"
      /* ADD */
      ),
      set: createReadonlyMethod("set"
      /* SET */
      ),
      delete: createReadonlyMethod("delete"
      /* DELETE */
      ),
      clear: createReadonlyMethod("clear"
      /* CLEAR */
      ),
      forEach: createForEach(true, false)
    };
    var shallowReadonlyInstrumentations = {
      get(key) {
        return get$1(this, key, true, true);
      },

      get size() {
        return size(this, true);
      },

      has(key) {
        return has$1.call(this, key, true);
      },

      add: createReadonlyMethod("add"
      /* ADD */
      ),
      set: createReadonlyMethod("set"
      /* SET */
      ),
      delete: createReadonlyMethod("delete"
      /* DELETE */
      ),
      clear: createReadonlyMethod("clear"
      /* CLEAR */
      ),
      forEach: createForEach(true, true)
    };
    var iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator];
    iteratorMethods.forEach(method => {
      mutableInstrumentations[method] = createIterableMethod(method, false, false);
      readonlyInstrumentations[method] = createIterableMethod(method, true, false);
      shallowInstrumentations[method] = createIterableMethod(method, false, true);
      shallowReadonlyInstrumentations[method] = createIterableMethod(method, true, true);
    });
    return [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations];
  }

  var [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* #__PURE__*/createInstrumentations();

  function createInstrumentationGetter(isReadonly, shallow) {
    var instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
    return (target, key, receiver) => {
      if (key === "__v_isReactive"
      /* IS_REACTIVE */
      ) {
        return !isReadonly;
      } else if (key === "__v_isReadonly"
      /* IS_READONLY */
      ) {
        return isReadonly;
      } else if (key === "__v_raw"
      /* RAW */
      ) {
        return target;
      }

      return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
    };
  }

  var mutableCollectionHandlers = {
    get: /*#__PURE__*/createInstrumentationGetter(false, false)
  };
  var shallowCollectionHandlers = {
    get: /*#__PURE__*/createInstrumentationGetter(false, true)
  };
  var readonlyCollectionHandlers = {
    get: /*#__PURE__*/createInstrumentationGetter(true, false)
  };
  var shallowReadonlyCollectionHandlers = {
    get: /*#__PURE__*/createInstrumentationGetter(true, true)
  };
  var reactiveMap = new WeakMap();
  var shallowReactiveMap = new WeakMap();
  var readonlyMap = new WeakMap();
  var shallowReadonlyMap = new WeakMap();

  function targetTypeMap(rawType) {
    switch (rawType) {
      case 'Object':
      case 'Array':
        return 1
        /* COMMON */
        ;

      case 'Map':
      case 'Set':
      case 'WeakMap':
      case 'WeakSet':
        return 2
        /* COLLECTION */
        ;

      default:
        return 0
        /* INVALID */
        ;
    }
  }

  function getTargetType(value) {
    return value["__v_skip"
    /* SKIP */
    ] || !Object.isExtensible(value) ? 0
    /* INVALID */
    : targetTypeMap(toRawType(value));
  }

  function reactive(target) {
    // if trying to observe a readonly proxy, return the readonly version.
    if (target && target["__v_isReadonly"
    /* IS_READONLY */
    ]) {
      return target;
    }

    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
  }
  /**
   * Return a shallowly-reactive copy of the original object, where only the root
   * level properties are reactive. It also does not auto-unwrap refs (even at the
   * root level).
   */


  function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
  }
  /**
   * Creates a readonly copy of the original object. Note the returned copy is not
   * made reactive, but `readonly` can be called on an already reactive object.
   */


  function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
  }
  /**
   * Returns a reactive-copy of the original object, where only the root level
   * properties are readonly, and does NOT unwrap refs nor recursively convert
   * returned properties.
   * This is used for creating the props proxy object for stateful components.
   */


  function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
  }

  function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject(target)) {
      return target;
    } // target is already a Proxy, return it.
    // exception: calling readonly() on a reactive object


    if (target["__v_raw"
    /* RAW */
    ] && !(isReadonly && target["__v_isReactive"
    /* IS_REACTIVE */
    ])) {
      return target;
    } // target already has corresponding Proxy


    var existingProxy = proxyMap.get(target);

    if (existingProxy) {
      return existingProxy;
    } // only a whitelist of value types can be observed.


    var targetType = getTargetType(target);

    if (targetType === 0
    /* INVALID */
    ) {
      return target;
    }

    var proxy = new Proxy(target, targetType === 2
    /* COLLECTION */
    ? collectionHandlers : baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
  }

  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"
      /* RAW */
      ]);
    }

    return !!(value && value["__v_isReactive"
    /* IS_REACTIVE */
    ]);
  }

  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"
    /* IS_READONLY */
    ]);
  }

  function isProxy(value) {
    return isReactive(value) || isReadonly(value);
  }

  function toRaw(observed) {
    var raw = observed && observed["__v_raw"
    /* RAW */
    ];
    return raw ? toRaw(raw) : observed;
  }

  function markRaw(value) {
    def(value, "__v_skip"
    /* SKIP */
    , true);
    return value;
  }

  var toReactive = value => isObject(value) ? reactive(value) : value;

  var toReadonly = value => isObject(value) ? readonly(value) : value;

  function trackRefValue(ref) {
    if (isTracking()) {
      ref = toRaw(ref);

      if (!ref.dep) {
        ref.dep = createDep();
      }

      {
        trackEffects(ref.dep);
      }
    }
  }

  function triggerRefValue(ref, newVal) {
    ref = toRaw(ref);

    if (ref.dep) {
      {
        triggerEffects(ref.dep);
      }
    }
  }

  function isRef(r) {
    return Boolean(r && r.__v_isRef === true);
  }

  function ref(value) {
    return createRef(value, false);
  }

  function shallowRef(value) {
    return createRef(value, true);
  }

  function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
      return rawValue;
    }

    return new RefImpl(rawValue, shallow);
  }

  class RefImpl {
    constructor(value, _shallow) {
      this._shallow = _shallow;
      this.dep = undefined;
      this.__v_isRef = true;
      this._rawValue = _shallow ? value : toRaw(value);
      this._value = _shallow ? value : toReactive(value);
    }

    get value() {
      trackRefValue(this);
      return this._value;
    }

    set value(newVal) {
      newVal = this._shallow ? newVal : toRaw(newVal);

      if (hasChanged(newVal, this._rawValue)) {
        this._rawValue = newVal;
        this._value = this._shallow ? newVal : toReactive(newVal);
        triggerRefValue(this);
      }
    }

  }

  function triggerRef(ref) {
    triggerRefValue(ref);
  }

  function unref(ref) {
    return isRef(ref) ? ref.value : ref;
  }

  var shallowUnwrapHandlers = {
    get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
      var oldValue = target[key];

      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  };

  function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }

  class CustomRefImpl {
    constructor(factory) {
      this.dep = undefined;
      this.__v_isRef = true;
      var {
        get,
        set
      } = factory(() => trackRefValue(this), () => triggerRefValue(this));
      this._get = get;
      this._set = set;
    }

    get value() {
      return this._get();
    }

    set value(newVal) {
      this._set(newVal);
    }

  }

  function customRef(factory) {
    return new CustomRefImpl(factory);
  }

  function toRefs(object) {
    var ret = isArray(object) ? new Array(object.length) : {};

    for (var key in object) {
      ret[key] = toRef(object, key);
    }

    return ret;
  }

  class ObjectRefImpl {
    constructor(_object, _key) {
      this._object = _object;
      this._key = _key;
      this.__v_isRef = true;
    }

    get value() {
      return this._object[this._key];
    }

    set value(newVal) {
      this._object[this._key] = newVal;
    }

  }

  function toRef(object, key) {
    var val = object[key];
    return isRef(val) ? val : new ObjectRefImpl(object, key);
  }

  class ComputedRefImpl {
    constructor(getter, _setter, isReadonly) {
      this._setter = _setter;
      this.dep = undefined;
      this._dirty = true;
      this.__v_isRef = true;
      this.effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerRefValue(this);
        }
      });
      this["__v_isReadonly"
      /* IS_READONLY */
      ] = isReadonly;
    }

    get value() {
      // the computed ref may get wrapped by other proxies e.g. readonly() #3376
      var self = toRaw(this);
      trackRefValue(self);

      if (self._dirty) {
        self._dirty = false;
        self._value = self.effect.run();
      }

      return self._value;
    }

    set value(newValue) {
      this._setter(newValue);
    }

  }

  function computed(getterOrOptions, debugOptions) {
    var getter;
    var setter;
    var onlyGetter = isFunction(getterOrOptions);

    if (onlyGetter) {
      getter = getterOrOptions;
      setter = NOOP;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }

    var cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter);
    return cRef;
  }

  var devtools;
  var buffer = [];
  var devtoolsNotInstalled = false;

  function emit(event) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key4 = 1; _key4 < _len3; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }

    if (devtools) {
      devtools.emit(event, ...args);
    } else if (!devtoolsNotInstalled) {
      buffer.push({
        event,
        args
      });
    }
  }

  function setDevtoolsHook(hook, target) {
    var _a, _b;

    devtools = hook;

    if (devtools) {
      devtools.enabled = true;
      buffer.forEach(_ref3 => {
        var {
          event,
          args
        } = _ref3;
        return devtools.emit(event, ...args);
      });
      buffer = [];
    } else if ( // handle late devtools injection - only do this if we are in an actual
    // browser environment to avoid the timer handle stalling test runner exit
    // (#4815)
    // eslint-disable-next-line no-restricted-globals
    typeof window !== 'undefined' && // some envs mock window but not fully
    window.HTMLElement && // also exclude jsdom
    !((_b = (_a = window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent) === null || _b === void 0 ? void 0 : _b.includes('jsdom'))) {
      var replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
      replay.push(newHook => {
        setDevtoolsHook(newHook, target);
      }); // clear buffer after 3s - the user probably doesn't have devtools installed
      // at all, and keeping the buffer will cause memory leaks (#4738)

      setTimeout(() => {
        if (!devtools) {
          target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
          devtoolsNotInstalled = true;
          buffer = [];
        }
      }, 3000);
    } else {
      // non-browser env, assume not installed
      devtoolsNotInstalled = true;
      buffer = [];
    }
  }

  function devtoolsInitApp(app, version) {
    emit("app:init"
    /* APP_INIT */
    , app, version, {
      Fragment,
      Text,
      Comment,
      Static
    });
  }

  function devtoolsUnmountApp(app) {
    emit("app:unmount"
    /* APP_UNMOUNT */
    , app);
  }

  var devtoolsComponentAdded = /*#__PURE__*/createDevtoolsComponentHook("component:added"
  /* COMPONENT_ADDED */
  );
  var devtoolsComponentUpdated = /*#__PURE__*/createDevtoolsComponentHook("component:updated"
  /* COMPONENT_UPDATED */
  );
  var devtoolsComponentRemoved = /*#__PURE__*/createDevtoolsComponentHook("component:removed"
  /* COMPONENT_REMOVED */
  );

  function createDevtoolsComponentHook(hook) {
    return component => {
      emit(hook, component.appContext.app, component.uid, component.parent ? component.parent.uid : undefined, component);
    };
  }

  function devtoolsComponentEmit(component, event, params) {
    emit("component:emit"
    /* COMPONENT_EMIT */
    , component.appContext.app, component, event, params);
  }

  function emit$1(instance, event) {
    var props = instance.vnode.props || EMPTY_OBJ;

    for (var _len4 = arguments.length, rawArgs = new Array(_len4 > 2 ? _len4 - 2 : 0), _key5 = 2; _key5 < _len4; _key5++) {
      rawArgs[_key5 - 2] = arguments[_key5];
    }

    var args = rawArgs;
    var isModelListener = event.startsWith('update:'); // for v-model update:xxx events, apply modifiers on args

    var modelArg = isModelListener && event.slice(7);

    if (modelArg && modelArg in props) {
      var modifiersKey = "".concat(modelArg === 'modelValue' ? 'model' : modelArg, "Modifiers");
      var {
        number,
        trim
      } = props[modifiersKey] || EMPTY_OBJ;

      if (trim) {
        args = rawArgs.map(a => a.trim());
      } else if (number) {
        args = rawArgs.map(toNumber);
      }
    }

    if (__VUE_PROD_DEVTOOLS__) {
      devtoolsComponentEmit(instance, event, args);
    }

    var handlerName;
    var handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
    props[handlerName = toHandlerKey(camelize(event))]; // for v-model update:xxx events, also trigger kebab-case equivalent
    // for props passed via kebab-case

    if (!handler && isModelListener) {
      handler = props[handlerName = toHandlerKey(hyphenate(event))];
    }

    if (handler) {
      callWithAsyncErrorHandling(handler, instance, 6
      /* COMPONENT_EVENT_HANDLER */
      , args);
    }

    var onceHandler = props[handlerName + "Once"];

    if (onceHandler) {
      if (!instance.emitted) {
        instance.emitted = {};
      } else if (instance.emitted[handlerName]) {
        return;
      }

      instance.emitted[handlerName] = true;
      callWithAsyncErrorHandling(onceHandler, instance, 6
      /* COMPONENT_EVENT_HANDLER */
      , args);
    }
  }

  function normalizeEmitsOptions(comp, appContext) {
    var asMixin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var cache = appContext.emitsCache;
    var cached = cache.get(comp);

    if (cached !== undefined) {
      return cached;
    }

    var raw = comp.emits;
    var normalized = {}; // apply mixin/extends props

    var hasExtends = false;

    if (__VUE_OPTIONS_API__ && !isFunction(comp)) {
      var extendEmits = raw => {
        var normalizedFromExtend = normalizeEmitsOptions(raw, appContext, true);

        if (normalizedFromExtend) {
          hasExtends = true;
          extend(normalized, normalizedFromExtend);
        }
      };

      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendEmits);
      }

      if (comp.extends) {
        extendEmits(comp.extends);
      }

      if (comp.mixins) {
        comp.mixins.forEach(extendEmits);
      }
    }

    if (!raw && !hasExtends) {
      cache.set(comp, null);
      return null;
    }

    if (isArray(raw)) {
      raw.forEach(key => normalized[key] = null);
    } else {
      extend(normalized, raw);
    }

    cache.set(comp, normalized);
    return normalized;
  } // Check if an incoming prop key is a declared emit event listener.
  // e.g. With `emits: { click: null }`, props named `onClick` and `onclick` are
  // both considered matched listeners.


  function isEmitListener(options, key) {
    if (!options || !isOn(key)) {
      return false;
    }

    key = key.slice(2).replace(/Once$/, '');
    return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
  }
  /**
   * mark the current rendering instance for asset resolution (e.g.
   * resolveComponent, resolveDirective) during render
   */


  var currentRenderingInstance = null;
  var currentScopeId = null;
  /**
   * Note: rendering calls maybe nested. The function returns the parent rendering
   * instance if present, which should be restored after the render is done:
   *
   * ```js
   * const prev = setCurrentRenderingInstance(i)
   * // ...render
   * setCurrentRenderingInstance(prev)
   * ```
   */

  function setCurrentRenderingInstance(instance) {
    var prev = currentRenderingInstance;
    currentRenderingInstance = instance;
    currentScopeId = instance && instance.type.__scopeId || null;
    return prev;
  }
  /**
   * Set scope id when creating hoisted vnodes.
   * @private compiler helper
   */


  function pushScopeId(id) {
    currentScopeId = id;
  }
  /**
   * Technically we no longer need this after 3.0.8 but we need to keep the same
   * API for backwards compat w/ code generated by compilers.
   * @private
   */


  function popScopeId() {
    currentScopeId = null;
  }
  /**
   * Only for backwards compat
   * @private
   */


  var withScopeId = _id => withCtx;
  /**
   * Wrap a slot function to memoize current rendering instance
   * @private compiler helper
   */


  function withCtx(fn) {
    var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : currentRenderingInstance;
    var isNonScopedSlot // false only
    = arguments.length > 2 ? arguments[2] : undefined;
    if (!ctx) return fn; // already normalized

    if (fn._n) {
      return fn;
    }

    var renderFnWithContext = function () {
      // If a user calls a compiled slot inside a template expression (#1745), it
      // can mess up block tracking, so by default we disable block tracking and
      // force bail out when invoking a compiled slot (indicated by the ._d flag).
      // This isn't necessary if rendering a compiled `<slot>`, so we flip the
      // ._d flag off when invoking the wrapped fn inside `renderSlot`.
      if (renderFnWithContext._d) {
        setBlockTracking(-1);
      }

      var prevInstance = setCurrentRenderingInstance(ctx);
      var res = fn(...arguments);
      setCurrentRenderingInstance(prevInstance);

      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }

      if (__VUE_PROD_DEVTOOLS__) {
        devtoolsComponentUpdated(ctx);
      }

      return res;
    }; // mark normalized to avoid duplicated wrapping


    renderFnWithContext._n = true; // mark this as compiled by default
    // this is used in vnode.ts -> normalizeChildren() to set the slot
    // rendering flag.

    renderFnWithContext._c = true; // disable block tracking by default

    renderFnWithContext._d = true;
    return renderFnWithContext;
  }

  function markAttrsAccessed() {}

  function renderComponentRoot(instance) {
    var {
      type: Component,
      vnode,
      proxy,
      withProxy,
      props,
      propsOptions: [propsOptions],
      slots,
      attrs,
      emit,
      render,
      renderCache,
      data,
      setupState,
      ctx,
      inheritAttrs
    } = instance;
    var result;
    var fallthroughAttrs;
    var prev = setCurrentRenderingInstance(instance);

    try {
      if (vnode.shapeFlag & 4
      /* STATEFUL_COMPONENT */
      ) {
        // withProxy is a proxy with a different `has` trap only for
        // runtime-compiled render functions using `with` block.
        var proxyToUse = withProxy || proxy;
        result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
        fallthroughAttrs = attrs;
      } else {
        // functional
        var _render = Component; // in dev, mark attrs accessed if optional props (attrs === props)

        if ("production" !== 'production' && attrs === props) ;
        result = normalizeVNode(_render.length > 1 ? _render(props, "production" !== 'production' ? {
          get attrs() {
            markAttrsAccessed();
            return attrs;
          },

          slots,
          emit
        } : {
          attrs,
          slots,
          emit
        }) : _render(props, null
        /* we know it doesn't need it */
        ));
        fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
      }
    } catch (err) {
      blockStack.length = 0;
      handleError(err, instance, 1
      /* RENDER_FUNCTION */
      );
      result = createVNode(Comment);
    } // attr merging
    // in dev mode, comments are preserved, and it's possible for a template
    // to have comments along side the root element which makes it a fragment


    var root = result;

    if (fallthroughAttrs && inheritAttrs !== false) {
      var keys = Object.keys(fallthroughAttrs);
      var {
        shapeFlag
      } = root;

      if (keys.length) {
        if (shapeFlag & (1
        /* ELEMENT */
        | 6
        /* COMPONENT */
        )) {
          if (propsOptions && keys.some(isModelListener)) {
            // If a v-model listener (onUpdate:xxx) has a corresponding declared
            // prop, it indicates this component expects to handle v-model and
            // it should not fallthrough.
            // related: #1543, #1643, #1989
            fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
          }

          root = cloneVNode(root, fallthroughAttrs);
        }
      }
    } // inherit directives


    if (vnode.dirs) {
      root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
    } // inherit transition data


    if (vnode.transition) {
      root.transition = vnode.transition;
    }

    {
      result = root;
    }
    setCurrentRenderingInstance(prev);
    return result;
  }

  function filterSingleRoot(children) {
    var singleRoot;

    for (var i = 0; i < children.length; i++) {
      var child = children[i];

      if (isVNode(child)) {
        // ignore user comment
        if (child.type !== Comment || child.children === 'v-if') {
          if (singleRoot) {
            // has more than 1 non-comment child, return now
            return;
          } else {
            singleRoot = child;
          }
        }
      } else {
        return;
      }
    }

    return singleRoot;
  }

  var getFunctionalFallthrough = attrs => {
    var res;

    for (var key in attrs) {
      if (key === 'class' || key === 'style' || isOn(key)) {
        (res || (res = {}))[key] = attrs[key];
      }
    }

    return res;
  };

  var filterModelListeners = (attrs, props) => {
    var res = {};

    for (var key in attrs) {
      if (!isModelListener(key) || !(key.slice(9) in props)) {
        res[key] = attrs[key];
      }
    }

    return res;
  };

  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    var {
      props: prevProps,
      children: prevChildren,
      component
    } = prevVNode;
    var {
      props: nextProps,
      children: nextChildren,
      patchFlag
    } = nextVNode;
    var emits = component.emitsOptions; // force child update for runtime directive or transition on component vnode.

    if (nextVNode.dirs || nextVNode.transition) {
      return true;
    }

    if (optimized && patchFlag >= 0) {
      if (patchFlag & 1024
      /* DYNAMIC_SLOTS */
      ) {
        // slot content that references values that might have changed,
        // e.g. in a v-for
        return true;
      }

      if (patchFlag & 16
      /* FULL_PROPS */
      ) {
        if (!prevProps) {
          return !!nextProps;
        } // presence of this flag indicates props are always non-null


        return hasPropsChanged(prevProps, nextProps, emits);
      } else if (patchFlag & 8
      /* PROPS */
      ) {
        var dynamicProps = nextVNode.dynamicProps;

        for (var i = 0; i < dynamicProps.length; i++) {
          var key = dynamicProps[i];

          if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
            return true;
          }
        }
      }
    } else {
      // this path is only taken by manually written render functions
      // so presence of any children leads to a forced update
      if (prevChildren || nextChildren) {
        if (!nextChildren || !nextChildren.$stable) {
          return true;
        }
      }

      if (prevProps === nextProps) {
        return false;
      }

      if (!prevProps) {
        return !!nextProps;
      }

      if (!nextProps) {
        return true;
      }

      return hasPropsChanged(prevProps, nextProps, emits);
    }

    return false;
  }

  function hasPropsChanged(prevProps, nextProps, emitsOptions) {
    var nextKeys = Object.keys(nextProps);

    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }

    for (var i = 0; i < nextKeys.length; i++) {
      var key = nextKeys[i];

      if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
        return true;
      }
    }

    return false;
  }

  function updateHOCHostEl(_ref4, el // HostNode
  ) {
    var {
      vnode,
      parent
    } = _ref4;

    while (parent && parent.subTree === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    }
  }

  var isSuspense = type => type.__isSuspense; // Suspense exposes a component-like API, and is treated like a component
  // in the compiler, but internally it's a special built-in type that hooks
  // directly into the renderer.


  var SuspenseImpl = {
    name: 'Suspense',
    // In order to make Suspense tree-shakable, we need to avoid importing it
    // directly in the renderer. The renderer checks for the __isSuspense flag
    // on a vnode's type and calls the `process` method, passing in renderer
    // internals.
    __isSuspense: true,

    process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, // platform-specific impl passed from renderer
    rendererInternals) {
      if (n1 == null) {
        mountSuspense(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals);
      } else {
        patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, slotScopeIds, optimized, rendererInternals);
      }
    },

    hydrate: hydrateSuspense,
    create: createSuspenseBoundary,
    normalize: normalizeSuspenseChildren
  }; // Force-casted public typing for h and TSX props inference

  var Suspense = SuspenseImpl;

  function triggerEvent(vnode, name) {
    var eventListener = vnode.props && vnode.props[name];

    if (isFunction(eventListener)) {
      eventListener();
    }
  }

  function mountSuspense(vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals) {
    var {
      p: patch,
      o: {
        createElement
      }
    } = rendererInternals;
    var hiddenContainer = createElement('div');
    var suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, isSVG, slotScopeIds, optimized, rendererInternals); // start mounting the content subtree in an off-dom container

    patch(null, suspense.pendingBranch = vnode.ssContent, hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds); // now check if we have encountered any async deps

    if (suspense.deps > 0) {
      // has async
      // invoke @fallback event
      triggerEvent(vnode, 'onPending');
      triggerEvent(vnode, 'onFallback'); // mount the fallback tree

      patch(null, vnode.ssFallback, container, anchor, parentComponent, null, // fallback tree will not have suspense context
      isSVG, slotScopeIds);
      setActiveBranch(suspense, vnode.ssFallback);
    } else {
      // Suspense has no async deps. Just resolve.
      suspense.resolve();
    }
  }

  function patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, slotScopeIds, optimized, _ref5) {
    var {
      p: patch,
      um: unmount,
      o: {
        createElement
      }
    } = _ref5;
    var suspense = n2.suspense = n1.suspense;
    suspense.vnode = n2;
    n2.el = n1.el;
    var newBranch = n2.ssContent;
    var newFallback = n2.ssFallback;
    var {
      activeBranch,
      pendingBranch,
      isInFallback,
      isHydrating
    } = suspense;

    if (pendingBranch) {
      suspense.pendingBranch = newBranch;

      if (isSameVNodeType(newBranch, pendingBranch)) {
        // same root type but content may have changed.
        patch(pendingBranch, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);

        if (suspense.deps <= 0) {
          suspense.resolve();
        } else if (isInFallback) {
          patch(activeBranch, newFallback, container, anchor, parentComponent, null, // fallback tree will not have suspense context
          isSVG, slotScopeIds, optimized);
          setActiveBranch(suspense, newFallback);
        }
      } else {
        // toggled before pending tree is resolved
        suspense.pendingId++;

        if (isHydrating) {
          // if toggled before hydration is finished, the current DOM tree is
          // no longer valid. set it as the active branch so it will be unmounted
          // when resolved
          suspense.isHydrating = false;
          suspense.activeBranch = pendingBranch;
        } else {
          unmount(pendingBranch, parentComponent, suspense);
        } // increment pending ID. this is used to invalidate async callbacks
        // reset suspense state


        suspense.deps = 0; // discard effects from pending branch

        suspense.effects.length = 0; // discard previous container

        suspense.hiddenContainer = createElement('div');

        if (isInFallback) {
          // already in fallback state
          patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);

          if (suspense.deps <= 0) {
            suspense.resolve();
          } else {
            patch(activeBranch, newFallback, container, anchor, parentComponent, null, // fallback tree will not have suspense context
            isSVG, slotScopeIds, optimized);
            setActiveBranch(suspense, newFallback);
          }
        } else if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
          // toggled "back" to current active branch
          patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, isSVG, slotScopeIds, optimized); // force resolve

          suspense.resolve(true);
        } else {
          // switched to a 3rd branch
          patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);

          if (suspense.deps <= 0) {
            suspense.resolve();
          }
        }
      }
    } else {
      if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
        // root did not change, just normal patch
        patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, isSVG, slotScopeIds, optimized);
        setActiveBranch(suspense, newBranch);
      } else {
        // root node toggled
        // invoke @pending event
        triggerEvent(n2, 'onPending'); // mount pending branch in off-dom container

        suspense.pendingBranch = newBranch;
        suspense.pendingId++;
        patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);

        if (suspense.deps <= 0) {
          // incoming branch has no async deps, resolve now.
          suspense.resolve();
        } else {
          var {
            timeout,
            pendingId
          } = suspense;

          if (timeout > 0) {
            setTimeout(() => {
              if (suspense.pendingId === pendingId) {
                suspense.fallback(newFallback);
              }
            }, timeout);
          } else if (timeout === 0) {
            suspense.fallback(newFallback);
          }
        }
      }
    }
  }

  function createSuspenseBoundary(vnode, parent, parentComponent, container, hiddenContainer, anchor, isSVG, slotScopeIds, optimized, rendererInternals) {
    var isHydrating = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : false;
    var {
      p: patch,
      m: move,
      um: unmount,
      n: next,
      o: {
        parentNode,
        remove
      }
    } = rendererInternals;
    var timeout = toNumber(vnode.props && vnode.props.timeout);
    var suspense = {
      vnode,
      parent,
      parentComponent,
      isSVG,
      container,
      hiddenContainer,
      anchor,
      deps: 0,
      pendingId: 0,
      timeout: typeof timeout === 'number' ? timeout : -1,
      activeBranch: null,
      pendingBranch: null,
      isInFallback: true,
      isHydrating,
      isUnmounted: false,
      effects: [],

      resolve() {
        var resume = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var {
          vnode,
          activeBranch,
          pendingBranch,
          pendingId,
          effects,
          parentComponent,
          container
        } = suspense;

        if (suspense.isHydrating) {
          suspense.isHydrating = false;
        } else if (!resume) {
          var delayEnter = activeBranch && pendingBranch.transition && pendingBranch.transition.mode === 'out-in';

          if (delayEnter) {
            activeBranch.transition.afterLeave = () => {
              if (pendingId === suspense.pendingId) {
                move(pendingBranch, container, _anchor, 0
                /* ENTER */
                );
              }
            };
          } // this is initial anchor on mount


          var {
            anchor: _anchor
          } = suspense; // unmount current active tree

          if (activeBranch) {
            // if the fallback tree was mounted, it may have been moved
            // as part of a parent suspense. get the latest anchor for insertion
            _anchor = next(activeBranch);
            unmount(activeBranch, parentComponent, suspense, true);
          }

          if (!delayEnter) {
            // move content from off-dom container to actual container
            move(pendingBranch, container, _anchor, 0
            /* ENTER */
            );
          }
        }

        setActiveBranch(suspense, pendingBranch);
        suspense.pendingBranch = null;
        suspense.isInFallback = false; // flush buffered effects
        // check if there is a pending parent suspense

        var parent = suspense.parent;
        var hasUnresolvedAncestor = false;

        while (parent) {
          if (parent.pendingBranch) {
            // found a pending parent suspense, merge buffered post jobs
            // into that parent
            parent.effects.push(...effects);
            hasUnresolvedAncestor = true;
            break;
          }

          parent = parent.parent;
        } // no pending parent suspense, flush all jobs


        if (!hasUnresolvedAncestor) {
          queuePostFlushCb(effects);
        }

        suspense.effects = []; // invoke @resolve event

        triggerEvent(vnode, 'onResolve');
      },

      fallback(fallbackVNode) {
        if (!suspense.pendingBranch) {
          return;
        }

        var {
          vnode,
          activeBranch,
          parentComponent,
          container,
          isSVG
        } = suspense; // invoke @fallback event

        triggerEvent(vnode, 'onFallback');
        var anchor = next(activeBranch);

        var mountFallback = () => {
          if (!suspense.isInFallback) {
            return;
          } // mount the fallback tree


          patch(null, fallbackVNode, container, anchor, parentComponent, null, // fallback tree will not have suspense context
          isSVG, slotScopeIds, optimized);
          setActiveBranch(suspense, fallbackVNode);
        };

        var delayEnter = fallbackVNode.transition && fallbackVNode.transition.mode === 'out-in';

        if (delayEnter) {
          activeBranch.transition.afterLeave = mountFallback;
        }

        suspense.isInFallback = true; // unmount current active branch

        unmount(activeBranch, parentComponent, null, // no suspense so unmount hooks fire now
        true // shouldRemove
        );

        if (!delayEnter) {
          mountFallback();
        }
      },

      move(container, anchor, type) {
        suspense.activeBranch && move(suspense.activeBranch, container, anchor, type);
        suspense.container = container;
      },

      next() {
        return suspense.activeBranch && next(suspense.activeBranch);
      },

      registerDep(instance, setupRenderEffect) {
        var isInPendingSuspense = !!suspense.pendingBranch;

        if (isInPendingSuspense) {
          suspense.deps++;
        }

        var hydratedEl = instance.vnode.el;
        instance.asyncDep.catch(err => {
          handleError(err, instance, 0
          /* SETUP_FUNCTION */
          );
        }).then(asyncSetupResult => {
          // retry when the setup() promise resolves.
          // component may have been unmounted before resolve.
          if (instance.isUnmounted || suspense.isUnmounted || suspense.pendingId !== instance.suspenseId) {
            return;
          } // retry from this component


          instance.asyncResolved = true;
          var {
            vnode
          } = instance;
          handleSetupResult(instance, asyncSetupResult, false);

          if (hydratedEl) {
            // vnode may have been replaced if an update happened before the
            // async dep is resolved.
            vnode.el = hydratedEl;
          }

          var placeholder = !hydratedEl && instance.subTree.el;
          setupRenderEffect(instance, vnode, // component may have been moved before resolve.
          // if this is not a hydration, instance.subTree will be the comment
          // placeholder.
          parentNode(hydratedEl || instance.subTree.el), // anchor will not be used if this is hydration, so only need to
          // consider the comment placeholder case.
          hydratedEl ? null : next(instance.subTree), suspense, isSVG, optimized);

          if (placeholder) {
            remove(placeholder);
          }

          updateHOCHostEl(instance, vnode.el); // only decrease deps count if suspense is not already resolved

          if (isInPendingSuspense && --suspense.deps === 0) {
            suspense.resolve();
          }
        });
      },

      unmount(parentSuspense, doRemove) {
        suspense.isUnmounted = true;

        if (suspense.activeBranch) {
          unmount(suspense.activeBranch, parentComponent, parentSuspense, doRemove);
        }

        if (suspense.pendingBranch) {
          unmount(suspense.pendingBranch, parentComponent, parentSuspense, doRemove);
        }
      }

    };
    return suspense;
  }

  function hydrateSuspense(node, vnode, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals, hydrateNode) {
    /* eslint-disable no-restricted-globals */
    var suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, node.parentNode, document.createElement('div'), null, isSVG, slotScopeIds, optimized, rendererInternals, true
    /* hydrating */
    ); // there are two possible scenarios for server-rendered suspense:
    // - success: ssr content should be fully resolved
    // - failure: ssr content should be the fallback branch.
    // however, on the client we don't really know if it has failed or not
    // attempt to hydrate the DOM assuming it has succeeded, but we still
    // need to construct a suspense boundary first

    var result = hydrateNode(node, suspense.pendingBranch = vnode.ssContent, parentComponent, suspense, slotScopeIds, optimized);

    if (suspense.deps === 0) {
      suspense.resolve();
    }

    return result;
    /* eslint-enable no-restricted-globals */
  }

  function normalizeSuspenseChildren(vnode) {
    var {
      shapeFlag,
      children
    } = vnode;
    var isSlotChildren = shapeFlag & 32
    /* SLOTS_CHILDREN */
    ;
    vnode.ssContent = normalizeSuspenseSlot(isSlotChildren ? children.default : children);
    vnode.ssFallback = isSlotChildren ? normalizeSuspenseSlot(children.fallback) : createVNode(Comment);
  }

  function normalizeSuspenseSlot(s) {
    var block;

    if (isFunction(s)) {
      var trackBlock = isBlockTreeEnabled && s._c;

      if (trackBlock) {
        // disableTracking: false
        // allow block tracking for compiled slots
        // (see ./componentRenderContext.ts)
        s._d = false;
        openBlock();
      }

      s = s();

      if (trackBlock) {
        s._d = true;
        block = currentBlock;
        closeBlock();
      }
    }

    if (isArray(s)) {
      var singleChild = filterSingleRoot(s);
      s = singleChild;
    }

    s = normalizeVNode(s);

    if (block && !s.dynamicChildren) {
      s.dynamicChildren = block.filter(c => c !== s);
    }

    return s;
  }

  function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray(fn)) {
        suspense.effects.push(...fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn);
    }
  }

  function setActiveBranch(suspense, branch) {
    suspense.activeBranch = branch;
    var {
      vnode,
      parentComponent
    } = suspense;
    var el = vnode.el = branch.el; // in case suspense is the root node of a component,
    // recursively update the HOC el

    if (parentComponent && parentComponent.subTree === vnode) {
      parentComponent.vnode.el = el;
      updateHOCHostEl(parentComponent, el);
    }
  }

  function provide(key, value) {
    if (!currentInstance) ;else {
      var provides = currentInstance.provides; // by default an instance inherits its parent's provides object
      // but when it needs to provide values of its own, it creates its
      // own provides object using parent provides object as prototype.
      // this way in `inject` we can simply look up injections from direct
      // parent and let the prototype chain do the work.

      var parentProvides = currentInstance.parent && currentInstance.parent.provides;

      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      } // TS doesn't allow symbol as index type


      provides[key] = value;
    }
  }

  function inject(key, defaultValue) {
    var treatDefaultAsFactory = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    // fallback to `currentRenderingInstance` so that this can be called in
    // a functional component
    var instance = currentInstance || currentRenderingInstance;

    if (instance) {
      // #2400
      // to support `app.use` plugins,
      // fallback to appContext's `provides` if the intance is at root
      var provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;

      if (provides && key in provides) {
        // TS doesn't allow symbol as index type
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
      } else ;
    }
  }

  function useTransitionState() {
    var state = {
      isMounted: false,
      isLeaving: false,
      isUnmounting: false,
      leavingVNodes: new Map()
    };
    onMounted(() => {
      state.isMounted = true;
    });
    onBeforeUnmount(() => {
      state.isUnmounting = true;
    });
    return state;
  }

  var TransitionHookValidator = [Function, Array];
  var BaseTransitionImpl = {
    name: "BaseTransition",
    props: {
      mode: String,
      appear: Boolean,
      persisted: Boolean,
      // enter
      onBeforeEnter: TransitionHookValidator,
      onEnter: TransitionHookValidator,
      onAfterEnter: TransitionHookValidator,
      onEnterCancelled: TransitionHookValidator,
      // leave
      onBeforeLeave: TransitionHookValidator,
      onLeave: TransitionHookValidator,
      onAfterLeave: TransitionHookValidator,
      onLeaveCancelled: TransitionHookValidator,
      // appear
      onBeforeAppear: TransitionHookValidator,
      onAppear: TransitionHookValidator,
      onAfterAppear: TransitionHookValidator,
      onAppearCancelled: TransitionHookValidator
    },

    setup(props, _ref6) {
      var {
        slots
      } = _ref6;
      var instance = getCurrentInstance();
      var state = useTransitionState();
      var prevTransitionKey;
      return () => {
        var children = slots.default && getTransitionRawChildren(slots.default(), true);

        if (!children || !children.length) {
          return;
        } // there's no need to track reactivity for these props so use the raw
        // props for a bit better perf


        var rawProps = toRaw(props);
        var {
          mode
        } = rawProps; // at this point children has a guaranteed length of 1.

        var child = children[0];

        if (state.isLeaving) {
          return emptyPlaceholder(child);
        } // in the case of <transition><keep-alive/></transition>, we need to
        // compare the type of the kept-alive children.


        var innerChild = getKeepAliveChild(child);

        if (!innerChild) {
          return emptyPlaceholder(child);
        }

        var enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
        setTransitionHooks(innerChild, enterHooks);
        var oldChild = instance.subTree;
        var oldInnerChild = oldChild && getKeepAliveChild(oldChild);
        var transitionKeyChanged = false;
        var {
          getTransitionKey
        } = innerChild.type;

        if (getTransitionKey) {
          var key = getTransitionKey();

          if (prevTransitionKey === undefined) {
            prevTransitionKey = key;
          } else if (key !== prevTransitionKey) {
            prevTransitionKey = key;
            transitionKeyChanged = true;
          }
        } // handle mode


        if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
          var leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance); // update old tree's hooks in case of dynamic transition

          setTransitionHooks(oldInnerChild, leavingHooks); // switching between different views

          if (mode === 'out-in') {
            state.isLeaving = true; // return placeholder node and queue update when leave finishes

            leavingHooks.afterLeave = () => {
              state.isLeaving = false;
              instance.update();
            };

            return emptyPlaceholder(child);
          } else if (mode === 'in-out' && innerChild.type !== Comment) {
            leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
              var leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
              leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild; // early removal callback

              el._leaveCb = () => {
                earlyRemove();
                el._leaveCb = undefined;
                delete enterHooks.delayedLeave;
              };

              enterHooks.delayedLeave = delayedLeave;
            };
          }
        }

        return child;
      };
    }

  }; // export the public type for h/tsx inference
  // also to avoid inline import() in generated d.ts files

  var BaseTransition = BaseTransitionImpl;

  function getLeavingNodesForType(state, vnode) {
    var {
      leavingVNodes
    } = state;
    var leavingVNodesCache = leavingVNodes.get(vnode.type);

    if (!leavingVNodesCache) {
      leavingVNodesCache = Object.create(null);
      leavingVNodes.set(vnode.type, leavingVNodesCache);
    }

    return leavingVNodesCache;
  } // The transition hooks are attached to the vnode as vnode.transition
  // and will be called at appropriate timing in the renderer.


  function resolveTransitionHooks(vnode, props, state, instance) {
    var {
      appear,
      mode,
      persisted = false,
      onBeforeEnter,
      onEnter,
      onAfterEnter,
      onEnterCancelled,
      onBeforeLeave,
      onLeave,
      onAfterLeave,
      onLeaveCancelled,
      onBeforeAppear,
      onAppear,
      onAfterAppear,
      onAppearCancelled
    } = props;
    var key = String(vnode.key);
    var leavingVNodesCache = getLeavingNodesForType(state, vnode);

    var callHook = (hook, args) => {
      hook && callWithAsyncErrorHandling(hook, instance, 9
      /* TRANSITION_HOOK */
      , args);
    };

    var hooks = {
      mode,
      persisted,

      beforeEnter(el) {
        var hook = onBeforeEnter;

        if (!state.isMounted) {
          if (appear) {
            hook = onBeforeAppear || onBeforeEnter;
          } else {
            return;
          }
        } // for same element (v-show)


        if (el._leaveCb) {
          el._leaveCb(true
          /* cancelled */
          );
        } // for toggled element with same key (v-if)


        var leavingVNode = leavingVNodesCache[key];

        if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
          // force early removal (not cancelled)
          leavingVNode.el._leaveCb();
        }

        callHook(hook, [el]);
      },

      enter(el) {
        var hook = onEnter;
        var afterHook = onAfterEnter;
        var cancelHook = onEnterCancelled;

        if (!state.isMounted) {
          if (appear) {
            hook = onAppear || onEnter;
            afterHook = onAfterAppear || onAfterEnter;
            cancelHook = onAppearCancelled || onEnterCancelled;
          } else {
            return;
          }
        }

        var called = false;

        var done = el._enterCb = cancelled => {
          if (called) return;
          called = true;

          if (cancelled) {
            callHook(cancelHook, [el]);
          } else {
            callHook(afterHook, [el]);
          }

          if (hooks.delayedLeave) {
            hooks.delayedLeave();
          }

          el._enterCb = undefined;
        };

        if (hook) {
          hook(el, done);

          if (hook.length <= 1) {
            done();
          }
        } else {
          done();
        }
      },

      leave(el, remove) {
        var key = String(vnode.key);

        if (el._enterCb) {
          el._enterCb(true
          /* cancelled */
          );
        }

        if (state.isUnmounting) {
          return remove();
        }

        callHook(onBeforeLeave, [el]);
        var called = false;

        var done = el._leaveCb = cancelled => {
          if (called) return;
          called = true;
          remove();

          if (cancelled) {
            callHook(onLeaveCancelled, [el]);
          } else {
            callHook(onAfterLeave, [el]);
          }

          el._leaveCb = undefined;

          if (leavingVNodesCache[key] === vnode) {
            delete leavingVNodesCache[key];
          }
        };

        leavingVNodesCache[key] = vnode;

        if (onLeave) {
          onLeave(el, done);

          if (onLeave.length <= 1) {
            done();
          }
        } else {
          done();
        }
      },

      clone(vnode) {
        return resolveTransitionHooks(vnode, props, state, instance);
      }

    };
    return hooks;
  } // the placeholder really only handles one special case: KeepAlive
  // in the case of a KeepAlive in a leave phase we need to return a KeepAlive
  // placeholder with empty content to avoid the KeepAlive instance from being
  // unmounted.


  function emptyPlaceholder(vnode) {
    if (isKeepAlive(vnode)) {
      vnode = cloneVNode(vnode);
      vnode.children = null;
      return vnode;
    }
  }

  function getKeepAliveChild(vnode) {
    return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : undefined : vnode;
  }

  function setTransitionHooks(vnode, hooks) {
    if (vnode.shapeFlag & 6
    /* COMPONENT */
    && vnode.component) {
      setTransitionHooks(vnode.component.subTree, hooks);
    } else if (vnode.shapeFlag & 128
    /* SUSPENSE */
    ) {
      vnode.ssContent.transition = hooks.clone(vnode.ssContent);
      vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
    } else {
      vnode.transition = hooks;
    }
  }

  function getTransitionRawChildren(children) {
    var keepComment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var ret = [];
    var keyedFragmentCount = 0;

    for (var i = 0; i < children.length; i++) {
      var child = children[i]; // handle fragment children case, e.g. v-for

      if (child.type === Fragment) {
        if (child.patchFlag & 128
        /* KEYED_FRAGMENT */
        ) keyedFragmentCount++;
        ret = ret.concat(getTransitionRawChildren(child.children, keepComment));
      } // comment placeholders should be skipped, e.g. v-if
      else if (keepComment || child.type !== Comment) {
        ret.push(child);
      }
    } // #1126 if a transition children list contains multiple sub fragments, these
    // fragments will be merged into a flat children array. Since each v-for
    // fragment may contain different static bindings inside, we need to de-op
    // these children to force full diffs to ensure correct behavior.


    if (keyedFragmentCount > 1) {
      for (var _i = 0; _i < ret.length; _i++) {
        ret[_i].patchFlag = -2
        /* BAIL */
        ;
      }
    }

    return ret;
  } // implementation, close to no-op


  function defineComponent(options) {
    return isFunction(options) ? {
      setup: options,
      name: options.name
    } : options;
  }

  var isAsyncWrapper = i => !!i.type.__asyncLoader;

  function defineAsyncComponent(source) {
    if (isFunction(source)) {
      source = {
        loader: source
      };
    }

    var {
      loader,
      loadingComponent,
      errorComponent,
      delay = 200,
      timeout,
      // undefined = never times out
      suspensible = true,
      onError: userOnError
    } = source;
    var pendingRequest = null;
    var resolvedComp;
    var retries = 0;

    var retry = () => {
      retries++;
      pendingRequest = null;
      return load();
    };

    var load = () => {
      var thisRequest;
      return pendingRequest || (thisRequest = pendingRequest = loader().catch(err => {
        err = err instanceof Error ? err : new Error(String(err));

        if (userOnError) {
          return new Promise((resolve, reject) => {
            var userRetry = () => resolve(retry());

            var userFail = () => reject(err);

            userOnError(err, userRetry, userFail, retries + 1);
          });
        } else {
          throw err;
        }
      }).then(comp => {
        if (thisRequest !== pendingRequest && pendingRequest) {
          return pendingRequest;
        } // interop module default


        if (comp && (comp.__esModule || comp[Symbol.toStringTag] === 'Module')) {
          comp = comp.default;
        }

        resolvedComp = comp;
        return comp;
      }));
    };

    return defineComponent({
      name: 'AsyncComponentWrapper',
      __asyncLoader: load,

      get __asyncResolved() {
        return resolvedComp;
      },

      setup() {
        var instance = currentInstance; // already resolved

        if (resolvedComp) {
          return () => createInnerComp(resolvedComp, instance);
        }

        var onError = err => {
          pendingRequest = null;
          handleError(err, instance, 13
          /* ASYNC_COMPONENT_LOADER */
          , !errorComponent
          /* do not throw in dev if user provided error component */
          );
        }; // suspense-controlled or SSR.


        if (suspensible && instance.suspense || isInSSRComponentSetup) {
          return load().then(comp => {
            return () => createInnerComp(comp, instance);
          }).catch(err => {
            onError(err);
            return () => errorComponent ? createVNode(errorComponent, {
              error: err
            }) : null;
          });
        }

        var loaded = ref(false);
        var error = ref();
        var delayed = ref(!!delay);

        if (delay) {
          setTimeout(() => {
            delayed.value = false;
          }, delay);
        }

        if (timeout != null) {
          setTimeout(() => {
            if (!loaded.value && !error.value) {
              var err = new Error("Async component timed out after ".concat(timeout, "ms."));
              onError(err);
              error.value = err;
            }
          }, timeout);
        }

        load().then(() => {
          loaded.value = true;

          if (instance.parent && isKeepAlive(instance.parent.vnode)) {
            // parent is keep-alive, force update so the loaded component's
            // name is taken into account
            queueJob(instance.parent.update);
          }
        }).catch(err => {
          onError(err);
          error.value = err;
        });
        return () => {
          if (loaded.value && resolvedComp) {
            return createInnerComp(resolvedComp, instance);
          } else if (error.value && errorComponent) {
            return createVNode(errorComponent, {
              error: error.value
            });
          } else if (loadingComponent && !delayed.value) {
            return createVNode(loadingComponent);
          }
        };
      }

    });
  }

  function createInnerComp(comp, _ref7) {
    var {
      vnode: {
        ref,
        props,
        children
      }
    } = _ref7;
    var vnode = createVNode(comp, props, children); // ensure inner component inherits the async wrapper's ref owner

    vnode.ref = ref;
    return vnode;
  }

  var isKeepAlive = vnode => vnode.type.__isKeepAlive;

  var KeepAliveImpl = {
    name: "KeepAlive",
    // Marker for special handling inside the renderer. We are not using a ===
    // check directly on KeepAlive in the renderer, because importing it directly
    // would prevent it from being tree-shaken.
    __isKeepAlive: true,
    props: {
      include: [String, RegExp, Array],
      exclude: [String, RegExp, Array],
      max: [String, Number]
    },

    setup(props, _ref8) {
      var {
        slots
      } = _ref8;
      var instance = getCurrentInstance(); // KeepAlive communicates with the instantiated renderer via the
      // ctx where the renderer passes in its internals,
      // and the KeepAlive instance exposes activate/deactivate implementations.
      // The whole point of this is to avoid importing KeepAlive directly in the
      // renderer to facilitate tree-shaking.

      var sharedContext = instance.ctx; // if the internal renderer is not registered, it indicates that this is server-side rendering,
      // for KeepAlive, we just need to render its children

      if (!sharedContext.renderer) {
        return slots.default;
      }

      var cache = new Map();
      var keys = new Set();
      var current = null;

      if (__VUE_PROD_DEVTOOLS__) {
        instance.__v_cache = cache;
      }

      var parentSuspense = instance.suspense;
      var {
        renderer: {
          p: patch,
          m: move,
          um: _unmount,
          o: {
            createElement
          }
        }
      } = sharedContext;
      var storageContainer = createElement('div');

      sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
        var instance = vnode.component;
        move(vnode, container, anchor, 0
        /* ENTER */
        , parentSuspense); // in case props have changed

        patch(instance.vnode, vnode, container, anchor, instance, parentSuspense, isSVG, vnode.slotScopeIds, optimized);
        queuePostRenderEffect(() => {
          instance.isDeactivated = false;

          if (instance.a) {
            invokeArrayFns(instance.a);
          }

          var vnodeHook = vnode.props && vnode.props.onVnodeMounted;

          if (vnodeHook) {
            invokeVNodeHook(vnodeHook, instance.parent, vnode);
          }
        }, parentSuspense);

        if (__VUE_PROD_DEVTOOLS__) {
          // Update components tree
          devtoolsComponentAdded(instance);
        }
      };

      sharedContext.deactivate = vnode => {
        var instance = vnode.component;
        move(vnode, storageContainer, null, 1
        /* LEAVE */
        , parentSuspense);
        queuePostRenderEffect(() => {
          if (instance.da) {
            invokeArrayFns(instance.da);
          }

          var vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;

          if (vnodeHook) {
            invokeVNodeHook(vnodeHook, instance.parent, vnode);
          }

          instance.isDeactivated = true;
        }, parentSuspense);

        if (__VUE_PROD_DEVTOOLS__) {
          // Update components tree
          devtoolsComponentAdded(instance);
        }
      };

      function unmount(vnode) {
        // reset the shapeFlag so it can be properly unmounted
        resetShapeFlag(vnode);

        _unmount(vnode, instance, parentSuspense);
      }

      function pruneCache(filter) {
        cache.forEach((vnode, key) => {
          var name = getComponentName(vnode.type);

          if (name && (!filter || !filter(name))) {
            pruneCacheEntry(key);
          }
        });
      }

      function pruneCacheEntry(key) {
        var cached = cache.get(key);

        if (!current || cached.type !== current.type) {
          unmount(cached);
        } else if (current) {
          // current active instance should no longer be kept-alive.
          // we can't unmount it now but it might be later, so reset its flag now.
          resetShapeFlag(current);
        }

        cache.delete(key);
        keys.delete(key);
      } // prune cache on include/exclude prop change


      watch(() => [props.include, props.exclude], _ref9 => {
        var [include, exclude] = _ref9;
        include && pruneCache(name => matches(include, name));
        exclude && pruneCache(name => !matches(exclude, name));
      }, // prune post-render after `current` has been updated
      {
        flush: 'post',
        deep: true
      }); // cache sub tree after render

      var pendingCacheKey = null;

      var cacheSubtree = () => {
        // fix #1621, the pendingCacheKey could be 0
        if (pendingCacheKey != null) {
          cache.set(pendingCacheKey, getInnerChild(instance.subTree));
        }
      };

      onMounted(cacheSubtree);
      onUpdated(cacheSubtree);
      onBeforeUnmount(() => {
        cache.forEach(cached => {
          var {
            subTree,
            suspense
          } = instance;
          var vnode = getInnerChild(subTree);

          if (cached.type === vnode.type) {
            // current instance will be unmounted as part of keep-alive's unmount
            resetShapeFlag(vnode); // but invoke its deactivated hook here

            var da = vnode.component.da;
            da && queuePostRenderEffect(da, suspense);
            return;
          }

          unmount(cached);
        });
      });
      return () => {
        pendingCacheKey = null;

        if (!slots.default) {
          return null;
        }

        var children = slots.default();
        var rawVNode = children[0];

        if (children.length > 1) {
          current = null;
          return children;
        } else if (!isVNode(rawVNode) || !(rawVNode.shapeFlag & 4
        /* STATEFUL_COMPONENT */
        ) && !(rawVNode.shapeFlag & 128
        /* SUSPENSE */
        )) {
          current = null;
          return rawVNode;
        }

        var vnode = getInnerChild(rawVNode);
        var comp = vnode.type; // for async components, name check should be based in its loaded
        // inner component if available

        var name = getComponentName(isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp);
        var {
          include,
          exclude,
          max
        } = props;

        if (include && (!name || !matches(include, name)) || exclude && name && matches(exclude, name)) {
          current = vnode;
          return rawVNode;
        }

        var key = vnode.key == null ? comp : vnode.key;
        var cachedVNode = cache.get(key); // clone vnode if it's reused because we are going to mutate it

        if (vnode.el) {
          vnode = cloneVNode(vnode);

          if (rawVNode.shapeFlag & 128
          /* SUSPENSE */
          ) {
            rawVNode.ssContent = vnode;
          }
        } // #1513 it's possible for the returned vnode to be cloned due to attr
        // fallthrough or scopeId, so the vnode here may not be the final vnode
        // that is mounted. Instead of caching it directly, we store the pending
        // key and cache `instance.subTree` (the normalized vnode) in
        // beforeMount/beforeUpdate hooks.


        pendingCacheKey = key;

        if (cachedVNode) {
          // copy over mounted state
          vnode.el = cachedVNode.el;
          vnode.component = cachedVNode.component;

          if (vnode.transition) {
            // recursively update transition hooks on subTree
            setTransitionHooks(vnode, vnode.transition);
          } // avoid vnode being mounted as fresh


          vnode.shapeFlag |= 512
          /* COMPONENT_KEPT_ALIVE */
          ; // make this key the freshest

          keys.delete(key);
          keys.add(key);
        } else {
          keys.add(key); // prune oldest entry

          if (max && keys.size > parseInt(max, 10)) {
            pruneCacheEntry(keys.values().next().value);
          }
        } // avoid vnode being unmounted


        vnode.shapeFlag |= 256
        /* COMPONENT_SHOULD_KEEP_ALIVE */
        ;
        current = vnode;
        return rawVNode;
      };
    }

  }; // export the public type for h/tsx inference
  // also to avoid inline import() in generated d.ts files

  var KeepAlive = KeepAliveImpl;

  function matches(pattern, name) {
    if (isArray(pattern)) {
      return pattern.some(p => matches(p, name));
    } else if (isString(pattern)) {
      return pattern.split(',').indexOf(name) > -1;
    } else if (pattern.test) {
      return pattern.test(name);
    }
    /* istanbul ignore next */


    return false;
  }

  function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a"
    /* ACTIVATED */
    , target);
  }

  function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da"
    /* DEACTIVATED */
    , target);
  }

  function registerKeepAliveHook(hook, type) {
    var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : currentInstance;

    // cache the deactivate branch check wrapper for injected hooks so the same
    // hook can be properly deduped by the scheduler. "__wdc" stands for "with
    // deactivation check".
    var wrappedHook = hook.__wdc || (hook.__wdc = () => {
      // only fire the hook if the target instance is NOT in a deactivated branch.
      var current = target;

      while (current) {
        if (current.isDeactivated) {
          return;
        }

        current = current.parent;
      }

      return hook();
    });

    injectHook(type, wrappedHook, target); // In addition to registering it on the target instance, we walk up the parent
    // chain and register it on all ancestor instances that are keep-alive roots.
    // This avoids the need to walk the entire component tree when invoking these
    // hooks, and more importantly, avoids the need to track child components in
    // arrays.

    if (target) {
      var current = target.parent;

      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type, target, current);
        }

        current = current.parent;
      }
    }
  }

  function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
    // injectHook wraps the original for error handling, so make sure to remove
    // the wrapped version.
    var injected = injectHook(type, hook, keepAliveRoot, true
    /* prepend */
    );
    onUnmounted(() => {
      remove(keepAliveRoot[type], injected);
    }, target);
  }

  function resetShapeFlag(vnode) {
    var shapeFlag = vnode.shapeFlag;

    if (shapeFlag & 256
    /* COMPONENT_SHOULD_KEEP_ALIVE */
    ) {
      shapeFlag -= 256
      /* COMPONENT_SHOULD_KEEP_ALIVE */
      ;
    }

    if (shapeFlag & 512
    /* COMPONENT_KEPT_ALIVE */
    ) {
      shapeFlag -= 512
      /* COMPONENT_KEPT_ALIVE */
      ;
    }

    vnode.shapeFlag = shapeFlag;
  }

  function getInnerChild(vnode) {
    return vnode.shapeFlag & 128
    /* SUSPENSE */
    ? vnode.ssContent : vnode;
  }

  function injectHook(type, hook) {
    var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : currentInstance;
    var prepend = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (target) {
      var hooks = target[type] || (target[type] = []); // cache the error handling wrapper for injected hooks so the same hook
      // can be properly deduped by the scheduler. "__weh" stands for "with error
      // handling".

      var wrappedHook = hook.__weh || (hook.__weh = function () {
        if (target.isUnmounted) {
          return;
        } // disable tracking inside all lifecycle hooks
        // since they can potentially be called inside effects.


        pauseTracking(); // Set currentInstance during hook invocation.
        // This assumes the hook does not synchronously trigger other hooks, which
        // can only be false when the user does something really funky.

        setCurrentInstance(target);

        for (var _len5 = arguments.length, args = new Array(_len5), _key6 = 0; _key6 < _len5; _key6++) {
          args[_key6] = arguments[_key6];
        }

        var res = callWithAsyncErrorHandling(hook, target, type, args);
        unsetCurrentInstance();
        resetTracking();
        return res;
      });

      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }

      return wrappedHook;
    }
  }

  var createHook = lifecycle => function (hook) {
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : currentInstance;
    return (// post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
      (!isInSSRComponentSetup || lifecycle === "sp"
      /* SERVER_PREFETCH */
      ) && injectHook(lifecycle, hook, target)
    );
  };

  var onBeforeMount = createHook("bm"
  /* BEFORE_MOUNT */
  );
  var onMounted = createHook("m"
  /* MOUNTED */
  );
  var onBeforeUpdate = createHook("bu"
  /* BEFORE_UPDATE */
  );
  var onUpdated = createHook("u"
  /* UPDATED */
  );
  var onBeforeUnmount = createHook("bum"
  /* BEFORE_UNMOUNT */
  );
  var onUnmounted = createHook("um"
  /* UNMOUNTED */
  );
  var onServerPrefetch = createHook("sp"
  /* SERVER_PREFETCH */
  );
  var onRenderTriggered = createHook("rtg"
  /* RENDER_TRIGGERED */
  );
  var onRenderTracked = createHook("rtc"
  /* RENDER_TRACKED */
  );

  function onErrorCaptured(hook) {
    var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : currentInstance;
    injectHook("ec"
    /* ERROR_CAPTURED */
    , hook, target);
  }

  var shouldCacheAccess = true;

  function applyOptions(instance) {
    var options = resolveMergedOptions(instance);
    var publicThis = instance.proxy;
    var ctx = instance.ctx; // do not cache property access on public proxy during state initialization

    shouldCacheAccess = false; // call beforeCreate first before accessing other options since
    // the hook may mutate resolved options (#2791)

    if (options.beforeCreate) {
      callHook(options.beforeCreate, instance, "bc"
      /* BEFORE_CREATE */
      );
    }

    var {
      // state
      data: dataOptions,
      computed: computedOptions,
      methods,
      watch: watchOptions,
      provide: provideOptions,
      inject: injectOptions,
      // lifecycle
      created,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
      activated,
      deactivated,
      beforeDestroy,
      beforeUnmount,
      destroyed,
      unmounted,
      render,
      renderTracked,
      renderTriggered,
      errorCaptured,
      serverPrefetch,
      // public API
      expose,
      inheritAttrs,
      // assets
      components,
      directives,
      filters
    } = options;
    var checkDuplicateProperties = null; // options initialization order (to be consistent with Vue 2):
    // - props (already done outside of this function)
    // - inject
    // - methods
    // - data (deferred since it relies on `this` access)
    // - computed
    // - watch (deferred since it relies on `this` access)

    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
    }

    if (methods) {
      for (var key in methods) {
        var methodHandler = methods[key];

        if (isFunction(methodHandler)) {
          // In dev mode, we use the `createRenderContext` function to define
          // methods to the proxy target, and those are read-only but
          // reconfigurable, so it needs to be redefined here
          {
            ctx[key] = methodHandler.bind(publicThis);
          }
        }
      }
    }

    if (dataOptions) {
      var data = dataOptions.call(publicThis, publicThis);
      if (!isObject(data)) ;else {
        instance.data = reactive(data);
      }
    } // state initialization complete at this point - start caching access


    shouldCacheAccess = true;

    if (computedOptions) {
      var _loop = function (_key7) {
        var opt = computedOptions[_key7];
        var get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
        var set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
        var c = computed({
          get,
          set
        });
        Object.defineProperty(ctx, _key7, {
          enumerable: true,
          configurable: true,
          get: () => c.value,
          set: v => c.value = v
        });
      };

      for (var _key7 in computedOptions) {
        _loop(_key7);
      }
    }

    if (watchOptions) {
      for (var _key8 in watchOptions) {
        createWatcher(watchOptions[_key8], ctx, publicThis, _key8);
      }
    }

    if (provideOptions) {
      var provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach(key => {
        provide(key, provides[key]);
      });
    }

    if (created) {
      callHook(created, instance, "c"
      /* CREATED */
      );
    }

    function registerLifecycleHook(register, hook) {
      if (isArray(hook)) {
        hook.forEach(_hook => register(_hook.bind(publicThis)));
      } else if (hook) {
        register(hook.bind(publicThis));
      }
    }

    registerLifecycleHook(onBeforeMount, beforeMount);
    registerLifecycleHook(onMounted, mounted);
    registerLifecycleHook(onBeforeUpdate, beforeUpdate);
    registerLifecycleHook(onUpdated, updated);
    registerLifecycleHook(onActivated, activated);
    registerLifecycleHook(onDeactivated, deactivated);
    registerLifecycleHook(onErrorCaptured, errorCaptured);
    registerLifecycleHook(onRenderTracked, renderTracked);
    registerLifecycleHook(onRenderTriggered, renderTriggered);
    registerLifecycleHook(onBeforeUnmount, beforeUnmount);
    registerLifecycleHook(onUnmounted, unmounted);
    registerLifecycleHook(onServerPrefetch, serverPrefetch);

    if (isArray(expose)) {
      if (expose.length) {
        var exposed = instance.exposed || (instance.exposed = {});
        expose.forEach(key => {
          Object.defineProperty(exposed, key, {
            get: () => publicThis[key],
            set: val => publicThis[key] = val
          });
        });
      } else if (!instance.exposed) {
        instance.exposed = {};
      }
    } // options that are handled when creating the instance but also need to be
    // applied from mixins


    if (render && instance.render === NOOP) {
      instance.render = render;
    }

    if (inheritAttrs != null) {
      instance.inheritAttrs = inheritAttrs;
    } // asset options.


    if (components) instance.components = components;
    if (directives) instance.directives = directives;
  }

  function resolveInjections(injectOptions, ctx) {
    var checkDuplicateProperties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : NOOP;
    var unwrapRef = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (isArray(injectOptions)) {
      injectOptions = normalizeInject(injectOptions);
    }

    var _loop2 = function (key) {
      var opt = injectOptions[key];
      var injected = void 0;

      if (isObject(opt)) {
        if ('default' in opt) {
          injected = inject(opt.from || key, opt.default, true
          /* treat default function as factory */
          );
        } else {
          injected = inject(opt.from || key);
        }
      } else {
        injected = inject(opt);
      }

      if (isRef(injected)) {
        // TODO remove the check in 3.3
        if (unwrapRef) {
          Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            get: () => injected.value,
            set: v => injected.value = v
          });
        } else {
          ctx[key] = injected;
        }
      } else {
        ctx[key] = injected;
      }
    };

    for (var key in injectOptions) {
      _loop2(key);
    }
  }

  function callHook(hook, instance, type) {
    callWithAsyncErrorHandling(isArray(hook) ? hook.map(h => h.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
  }

  function createWatcher(raw, ctx, publicThis, key) {
    var getter = key.includes('.') ? createPathGetter(publicThis, key) : () => publicThis[key];

    if (isString(raw)) {
      var handler = ctx[raw];

      if (isFunction(handler)) {
        watch(getter, handler);
      }
    } else if (isFunction(raw)) {
      watch(getter, raw.bind(publicThis));
    } else if (isObject(raw)) {
      if (isArray(raw)) {
        raw.forEach(r => createWatcher(r, ctx, publicThis, key));
      } else {
        var _handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];

        if (isFunction(_handler)) {
          watch(getter, _handler, raw);
        }
      }
    } else ;
  }
  /**
   * Resolve merged options and cache it on the component.
   * This is done only once per-component since the merging does not involve
   * instances.
   */


  function resolveMergedOptions(instance) {
    var base = instance.type;
    var {
      mixins,
      extends: extendsOptions
    } = base;
    var {
      mixins: globalMixins,
      optionsCache: cache,
      config: {
        optionMergeStrategies
      }
    } = instance.appContext;
    var cached = cache.get(base);
    var resolved;

    if (cached) {
      resolved = cached;
    } else if (!globalMixins.length && !mixins && !extendsOptions) {
      {
        resolved = base;
      }
    } else {
      resolved = {};

      if (globalMixins.length) {
        globalMixins.forEach(m => mergeOptions(resolved, m, optionMergeStrategies, true));
      }

      mergeOptions(resolved, base, optionMergeStrategies);
    }

    cache.set(base, resolved);
    return resolved;
  }

  function mergeOptions(to, from, strats) {
    var asMixin = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var {
      mixins,
      extends: extendsOptions
    } = from;

    if (extendsOptions) {
      mergeOptions(to, extendsOptions, strats, true);
    }

    if (mixins) {
      mixins.forEach(m => mergeOptions(to, m, strats, true));
    }

    for (var key in from) {
      if (asMixin && key === 'expose') ;else {
        var strat = internalOptionMergeStrats[key] || strats && strats[key];
        to[key] = strat ? strat(to[key], from[key]) : from[key];
      }
    }

    return to;
  }

  var internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeObjectOptions,
    emits: mergeObjectOptions,
    // objects
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    // lifecycle
    beforeCreate: mergeAsArray,
    created: mergeAsArray,
    beforeMount: mergeAsArray,
    mounted: mergeAsArray,
    beforeUpdate: mergeAsArray,
    updated: mergeAsArray,
    beforeDestroy: mergeAsArray,
    beforeUnmount: mergeAsArray,
    destroyed: mergeAsArray,
    unmounted: mergeAsArray,
    activated: mergeAsArray,
    deactivated: mergeAsArray,
    errorCaptured: mergeAsArray,
    serverPrefetch: mergeAsArray,
    // assets
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    // watch
    watch: mergeWatchOptions,
    // provide / inject
    provide: mergeDataFn,
    inject: mergeInject
  };

  function mergeDataFn(to, from) {
    if (!from) {
      return to;
    }

    if (!to) {
      return from;
    }

    return function mergedDataFn() {
      return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
    };
  }

  function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
  }

  function normalizeInject(raw) {
    if (isArray(raw)) {
      var res = {};

      for (var i = 0; i < raw.length; i++) {
        res[raw[i]] = raw[i];
      }

      return res;
    }

    return raw;
  }

  function mergeAsArray(to, from) {
    return to ? [...new Set([].concat(to, from))] : from;
  }

  function mergeObjectOptions(to, from) {
    return to ? extend(extend(Object.create(null), to), from) : from;
  }

  function mergeWatchOptions(to, from) {
    if (!to) return from;
    if (!from) return to;
    var merged = extend(Object.create(null), to);

    for (var key in from) {
      merged[key] = mergeAsArray(to[key], from[key]);
    }

    return merged;
  }

  function initProps(instance, rawProps, isStateful) {
    var isSSR = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var props = {};
    var attrs = {};
    def(attrs, InternalObjectKey, 1);
    instance.propsDefaults = Object.create(null);
    setFullProps(instance, rawProps, props, attrs); // ensure all declared prop keys are present

    for (var key in instance.propsOptions[0]) {
      if (!(key in props)) {
        props[key] = undefined;
      }
    }

    if (isStateful) {
      // stateful
      instance.props = isSSR ? props : shallowReactive(props);
    } else {
      if (!instance.type.props) {
        // functional w/ optional props, props === attrs
        instance.props = attrs;
      } else {
        // functional w/ declared props
        instance.props = props;
      }
    }

    instance.attrs = attrs;
  }

  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    var {
      props,
      attrs,
      vnode: {
        patchFlag
      }
    } = instance;
    var rawCurrentProps = toRaw(props);
    var [options] = instance.propsOptions;
    var hasAttrsChanged = false;

    if ( // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16
    /* FULL_PROPS */
    )) {
      if (patchFlag & 8
      /* PROPS */
      ) {
        // Compiler-generated props & no keys change, just set the updated
        // the props.
        var propsToUpdate = instance.vnode.dynamicProps;

        for (var i = 0; i < propsToUpdate.length; i++) {
          var key = propsToUpdate[i]; // PROPS flag guarantees rawProps to be non-null

          var value = rawProps[key];

          if (options) {
            // attr / props separation was done on init and will be consistent
            // in this code path, so just check if attrs have it.
            if (hasOwn(attrs, key)) {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            } else {
              var camelizedKey = camelize(key);
              props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false
              /* isAbsent */
              );
            }
          } else {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
    } else {
      // full props update.
      if (setFullProps(instance, rawProps, props, attrs)) {
        hasAttrsChanged = true;
      } // in case of dynamic props, check if we need to delete keys from
      // the props object


      var kebabKey;

      for (var _key9 in rawCurrentProps) {
        if (!rawProps || // for camelCase
        !hasOwn(rawProps, _key9) && ( // it's possible the original props was passed in as kebab-case
        // and converted to camelCase (#955)
        (kebabKey = hyphenate(_key9)) === _key9 || !hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps && ( // for camelCase
            rawPrevProps[_key9] !== undefined || // for kebab-case
            rawPrevProps[kebabKey] !== undefined)) {
              props[_key9] = resolvePropValue(options, rawCurrentProps, _key9, undefined, instance, true
              /* isAbsent */
              );
            }
          } else {
            delete props[_key9];
          }
        }
      } // in the case of functional component w/o props declaration, props and
      // attrs point to the same object so it should already have been updated.


      if (attrs !== rawCurrentProps) {
        for (var _key10 in attrs) {
          if (!rawProps || !hasOwn(rawProps, _key10)) {
            delete attrs[_key10];
            hasAttrsChanged = true;
          }
        }
      }
    } // trigger updates for $attrs in case it's used in component slots


    if (hasAttrsChanged) {
      trigger(instance, "set"
      /* SET */
      , '$attrs');
    }
  }

  function setFullProps(instance, rawProps, props, attrs) {
    var [options, needCastKeys] = instance.propsOptions;
    var hasAttrsChanged = false;
    var rawCastValues;

    if (rawProps) {
      for (var key in rawProps) {
        // key, ref are reserved and never passed down
        if (isReservedProp(key)) {
          continue;
        }

        var value = rawProps[key]; // prop option names are camelized during normalization, so to support
        // kebab -> camel conversion here we need to camelize the key.

        var camelKey = void 0;

        if (options && hasOwn(options, camelKey = camelize(key))) {
          if (!needCastKeys || !needCastKeys.includes(camelKey)) {
            props[camelKey] = value;
          } else {
            (rawCastValues || (rawCastValues = {}))[camelKey] = value;
          }
        } else if (!isEmitListener(instance.emitsOptions, key)) {
          if (!(key in attrs) || value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }

    if (needCastKeys) {
      var rawCurrentProps = toRaw(props);
      var castValues = rawCastValues || EMPTY_OBJ;

      for (var i = 0; i < needCastKeys.length; i++) {
        var _key11 = needCastKeys[i];
        props[_key11] = resolvePropValue(options, rawCurrentProps, _key11, castValues[_key11], instance, !hasOwn(castValues, _key11));
      }
    }

    return hasAttrsChanged;
  }

  function resolvePropValue(options, props, key, value, instance, isAbsent) {
    var opt = options[key];

    if (opt != null) {
      var hasDefault = hasOwn(opt, 'default'); // default values

      if (hasDefault && value === undefined) {
        var defaultValue = opt.default;

        if (opt.type !== Function && isFunction(defaultValue)) {
          var {
            propsDefaults
          } = instance;

          if (key in propsDefaults) {
            value = propsDefaults[key];
          } else {
            setCurrentInstance(instance);
            value = propsDefaults[key] = defaultValue.call(null, props);
            unsetCurrentInstance();
          }
        } else {
          value = defaultValue;
        }
      } // boolean casting


      if (opt[0
      /* shouldCast */
      ]) {
        if (isAbsent && !hasDefault) {
          value = false;
        } else if (opt[1
        /* shouldCastTrue */
        ] && (value === '' || value === hyphenate(key))) {
          value = true;
        }
      }
    }

    return value;
  }

  function normalizePropsOptions(comp, appContext) {
    var asMixin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var cache = appContext.propsCache;
    var cached = cache.get(comp);

    if (cached) {
      return cached;
    }

    var raw = comp.props;
    var normalized = {};
    var needCastKeys = []; // apply mixin/extends props

    var hasExtends = false;

    if (__VUE_OPTIONS_API__ && !isFunction(comp)) {
      var extendProps = raw => {
        hasExtends = true;
        var [props, keys] = normalizePropsOptions(raw, appContext, true);
        extend(normalized, props);
        if (keys) needCastKeys.push(...keys);
      };

      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendProps);
      }

      if (comp.extends) {
        extendProps(comp.extends);
      }

      if (comp.mixins) {
        comp.mixins.forEach(extendProps);
      }
    }

    if (!raw && !hasExtends) {
      cache.set(comp, EMPTY_ARR);
      return EMPTY_ARR;
    }

    if (isArray(raw)) {
      for (var i = 0; i < raw.length; i++) {
        var normalizedKey = camelize(raw[i]);

        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = EMPTY_OBJ;
        }
      }
    } else if (raw) {
      for (var key in raw) {
        var _normalizedKey = camelize(key);

        if (validatePropName(_normalizedKey)) {
          var opt = raw[key];
          var prop = normalized[_normalizedKey] = isArray(opt) || isFunction(opt) ? {
            type: opt
          } : opt;

          if (prop) {
            var booleanIndex = getTypeIndex(Boolean, prop.type);
            var stringIndex = getTypeIndex(String, prop.type);
            prop[0
            /* shouldCast */
            ] = booleanIndex > -1;
            prop[1
            /* shouldCastTrue */
            ] = stringIndex < 0 || booleanIndex < stringIndex; // if the prop needs boolean casting or default value

            if (booleanIndex > -1 || hasOwn(prop, 'default')) {
              needCastKeys.push(_normalizedKey);
            }
          }
        }
      }
    }

    var res = [normalized, needCastKeys];
    cache.set(comp, res);
    return res;
  }

  function validatePropName(key) {
    if (key[0] !== '$') {
      return true;
    }

    return false;
  } // use function string name to check type constructors
  // so that it works across vms / iframes.


  function getType(ctor) {
    var match = ctor && ctor.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : ctor === null ? 'null' : '';
  }

  function isSameType(a, b) {
    return getType(a) === getType(b);
  }

  function getTypeIndex(type, expectedTypes) {
    if (isArray(expectedTypes)) {
      return expectedTypes.findIndex(t => isSameType(t, type));
    } else if (isFunction(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1;
    }

    return -1;
  }

  var isInternalKey = key => key[0] === '_' || key === '$stable';

  var normalizeSlotValue = value => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];

  var normalizeSlot = (key, rawSlot, ctx) => {
    var normalized = withCtx(function () {
      return normalizeSlotValue(rawSlot(...arguments));
    }, ctx);
    normalized._c = false;
    return normalized;
  };

  var normalizeObjectSlots = (rawSlots, slots, instance) => {
    var ctx = rawSlots._ctx;

    for (var key in rawSlots) {
      if (isInternalKey(key)) continue;
      var value = rawSlots[key];

      if (isFunction(value)) {
        slots[key] = normalizeSlot(key, value, ctx);
      } else if (value != null) {
        (function () {
          var normalized = normalizeSlotValue(value);

          slots[key] = () => normalized;
        })();
      }
    }
  };

  var normalizeVNodeSlots = (instance, children) => {
    var normalized = normalizeSlotValue(children);

    instance.slots.default = () => normalized;
  };

  var initSlots = (instance, children) => {
    if (instance.vnode.shapeFlag & 32
    /* SLOTS_CHILDREN */
    ) {
      var type = children._;

      if (type) {
        // users can get the shallow readonly version of the slots object through `this.$slots`,
        // we should avoid the proxy object polluting the slots of the internal instance
        instance.slots = toRaw(children); // make compiler marker non-enumerable

        def(children, '_', type);
      } else {
        normalizeObjectSlots(children, instance.slots = {});
      }
    } else {
      instance.slots = {};

      if (children) {
        normalizeVNodeSlots(instance, children);
      }
    }

    def(instance.slots, InternalObjectKey, 1);
  };

  var updateSlots = (instance, children, optimized) => {
    var {
      vnode,
      slots
    } = instance;
    var needDeletionCheck = true;
    var deletionComparisonTarget = EMPTY_OBJ;

    if (vnode.shapeFlag & 32
    /* SLOTS_CHILDREN */
    ) {
      var type = children._;

      if (type) {
        // compiled slots.
        if (optimized && type === 1
        /* STABLE */
        ) {
          // compiled AND stable.
          // no need to update, and skip stale slots removal.
          needDeletionCheck = false;
        } else {
          // compiled but dynamic (v-if/v-for on slots) - update slots, but skip
          // normalization.
          extend(slots, children); // #2893
          // when rendering the optimized slots by manually written render function,
          // we need to delete the `slots._` flag if necessary to make subsequent updates reliable,
          // i.e. let the `renderSlot` create the bailed Fragment

          if (!optimized && type === 1
          /* STABLE */
          ) {
            delete slots._;
          }
        }
      } else {
        needDeletionCheck = !children.$stable;
        normalizeObjectSlots(children, slots);
      }

      deletionComparisonTarget = children;
    } else if (children) {
      // non slot object children (direct value) passed to a component
      normalizeVNodeSlots(instance, children);
      deletionComparisonTarget = {
        default: 1
      };
    } // delete stale slots


    if (needDeletionCheck) {
      for (var key in slots) {
        if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
          delete slots[key];
        }
      }
    }
  };
  /**
   * Adds directives to a VNode.
   */


  function withDirectives(vnode, directives) {
    var internalInstance = currentRenderingInstance;

    if (internalInstance === null) {
      return vnode;
    }

    var instance = internalInstance.proxy;
    var bindings = vnode.dirs || (vnode.dirs = []);

    for (var i = 0; i < directives.length; i++) {
      var [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];

      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }

      if (dir.deep) {
        traverse(value);
      }

      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }

    return vnode;
  }

  function invokeDirectiveHook(vnode, prevVNode, instance, name) {
    var bindings = vnode.dirs;
    var oldBindings = prevVNode && prevVNode.dirs;

    for (var i = 0; i < bindings.length; i++) {
      var binding = bindings[i];

      if (oldBindings) {
        binding.oldValue = oldBindings[i].value;
      }

      var hook = binding.dir[name];

      if (hook) {
        // disable tracking inside all lifecycle hooks
        // since they can potentially be called inside effects.
        pauseTracking();
        callWithAsyncErrorHandling(hook, instance, 8
        /* DIRECTIVE_HOOK */
        , [vnode.el, binding, vnode, prevVNode]);
        resetTracking();
      }
    }
  }

  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: undefined,
        warnHandler: undefined,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: Object.create(null),
      optionsCache: new WeakMap(),
      propsCache: new WeakMap(),
      emitsCache: new WeakMap()
    };
  }

  var uid = 0;

  function createAppAPI(render, hydrate) {
    return function createApp(rootComponent) {
      var rootProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (rootProps != null && !isObject(rootProps)) {
        rootProps = null;
      }

      var context = createAppContext();
      var installedPlugins = new Set();
      var isMounted = false;
      var app = context.app = {
        _uid: uid++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        _instance: null,
        version,

        get config() {
          return context.config;
        },

        set config(v) {},

        use(plugin) {
          for (var _len6 = arguments.length, options = new Array(_len6 > 1 ? _len6 - 1 : 0), _key12 = 1; _key12 < _len6; _key12++) {
            options[_key12 - 1] = arguments[_key12];
          }

          if (installedPlugins.has(plugin)) ;else if (plugin && isFunction(plugin.install)) {
            installedPlugins.add(plugin);
            plugin.install(app, ...options);
          } else if (isFunction(plugin)) {
            installedPlugins.add(plugin);
            plugin(app, ...options);
          } else ;
          return app;
        },

        mixin(mixin) {
          if (__VUE_OPTIONS_API__) {
            if (!context.mixins.includes(mixin)) {
              context.mixins.push(mixin);
            }
          }

          return app;
        },

        component(name, component) {
          if (!component) {
            return context.components[name];
          }

          context.components[name] = component;
          return app;
        },

        directive(name, directive) {
          if (!directive) {
            return context.directives[name];
          }

          context.directives[name] = directive;
          return app;
        },

        mount(rootContainer, isHydrate, isSVG) {
          if (!isMounted) {
            var vnode = createVNode(rootComponent, rootProps); // store app context on the root VNode.
            // this will be set on the root instance on initial mount.

            vnode.appContext = context;

            if (isHydrate && hydrate) {
              hydrate(vnode, rootContainer);
            } else {
              render(vnode, rootContainer, isSVG);
            }

            isMounted = true;
            app._container = rootContainer;
            rootContainer.__vue_app__ = app;

            if (__VUE_PROD_DEVTOOLS__) {
              app._instance = vnode.component;
              devtoolsInitApp(app, version);
            }

            return getExposeProxy(vnode.component) || vnode.component.proxy;
          }
        },

        unmount() {
          if (isMounted) {
            render(null, app._container);

            if (__VUE_PROD_DEVTOOLS__) {
              app._instance = null;
              devtoolsUnmountApp(app);
            }

            delete app._container.__vue_app__;
          }
        },

        provide(key, value) {
          // TypeScript doesn't allow symbols as index type
          // https://github.com/Microsoft/TypeScript/issues/24587
          context.provides[key] = value;
          return app;
        }

      };
      return app;
    };
  }

  var hasMismatch = false;

  var isSVGContainer = container => /svg/.test(container.namespaceURI) && container.tagName !== 'foreignObject';

  var isComment = node => node.nodeType === 8
  /* COMMENT */
  ; // Note: hydration is DOM-specific
  // But we have to place it in core due to tight coupling with core - splitting
  // it out creates a ton of unnecessary complexity.
  // Hydration also depends on some renderer internal logic which needs to be
  // passed in via arguments.


  function createHydrationFunctions(rendererInternals) {
    var {
      mt: mountComponent,
      p: patch,
      o: {
        patchProp,
        nextSibling,
        parentNode,
        remove,
        insert,
        createComment
      }
    } = rendererInternals;

    var hydrate = (vnode, container) => {
      if (!container.hasChildNodes()) {
        patch(null, vnode, container);
        flushPostFlushCbs();
        return;
      }

      hasMismatch = false;
      hydrateNode(container.firstChild, vnode, null, null, null);
      flushPostFlushCbs();

      if (hasMismatch && !false) {
        // this error should show up in production
        console.error("Hydration completed but contains mismatches.");
      }
    };

    var hydrateNode = function (node, vnode, parentComponent, parentSuspense, slotScopeIds) {
      var optimized = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
      var isFragmentStart = isComment(node) && node.data === '[';

      var onMismatch = () => handleMismatch(node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragmentStart);

      var {
        type,
        ref,
        shapeFlag
      } = vnode;
      var domType = node.nodeType;
      vnode.el = node;
      var nextNode = null;

      switch (type) {
        case Text:
          if (domType !== 3
          /* TEXT */
          ) {
            nextNode = onMismatch();
          } else {
            if (node.data !== vnode.children) {
              hasMismatch = true;
              node.data = vnode.children;
            }

            nextNode = nextSibling(node);
          }

          break;

        case Comment:
          if (domType !== 8
          /* COMMENT */
          || isFragmentStart) {
            nextNode = onMismatch();
          } else {
            nextNode = nextSibling(node);
          }

          break;

        case Static:
          if (domType !== 1
          /* ELEMENT */
          ) {
            nextNode = onMismatch();
          } else {
            // determine anchor, adopt content
            nextNode = node; // if the static vnode has its content stripped during build,
            // adopt it from the server-rendered HTML.

            var needToAdoptContent = !vnode.children.length;

            for (var i = 0; i < vnode.staticCount; i++) {
              if (needToAdoptContent) vnode.children += nextNode.outerHTML;

              if (i === vnode.staticCount - 1) {
                vnode.anchor = nextNode;
              }

              nextNode = nextSibling(nextNode);
            }

            return nextNode;
          }

          break;

        case Fragment:
          if (!isFragmentStart) {
            nextNode = onMismatch();
          } else {
            nextNode = hydrateFragment(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
          }

          break;

        default:
          if (shapeFlag & 1
          /* ELEMENT */
          ) {
            if (domType !== 1
            /* ELEMENT */
            || vnode.type.toLowerCase() !== node.tagName.toLowerCase()) {
              nextNode = onMismatch();
            } else {
              nextNode = hydrateElement(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
            }
          } else if (shapeFlag & 6
          /* COMPONENT */
          ) {
            // when setting up the render effect, if the initial vnode already
            // has .el set, the component will perform hydration instead of mount
            // on its sub-tree.
            vnode.slotScopeIds = slotScopeIds;
            var container = parentNode(node);
            mountComponent(vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container), optimized); // component may be async, so in the case of fragments we cannot rely
            // on component's rendered output to determine the end of the fragment
            // instead, we do a lookahead to find the end anchor node.

            nextNode = isFragmentStart ? locateClosingAsyncAnchor(node) : nextSibling(node); // #3787
            // if component is async, it may get moved / unmounted before its
            // inner component is loaded, so we need to give it a placeholder
            // vnode that matches its adopted DOM.

            if (isAsyncWrapper(vnode)) {
              var subTree;

              if (isFragmentStart) {
                subTree = createVNode(Fragment);
                subTree.anchor = nextNode ? nextNode.previousSibling : container.lastChild;
              } else {
                subTree = node.nodeType === 3 ? createTextVNode('') : createVNode('div');
              }

              subTree.el = node;
              vnode.component.subTree = subTree;
            }
          } else if (shapeFlag & 64
          /* TELEPORT */
          ) {
            if (domType !== 8
            /* COMMENT */
            ) {
              nextNode = onMismatch();
            } else {
              nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, rendererInternals, hydrateChildren);
            }
          } else if (shapeFlag & 128
          /* SUSPENSE */
          ) {
            nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, isSVGContainer(parentNode(node)), slotScopeIds, optimized, rendererInternals, hydrateNode);
          } else ;

      }

      if (ref != null) {
        setRef(ref, null, parentSuspense, vnode);
      }

      return nextNode;
    };

    var hydrateElement = (el, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
      optimized = optimized || !!vnode.dynamicChildren;
      var {
        type,
        props,
        patchFlag,
        shapeFlag,
        dirs
      } = vnode; // #4006 for form elements with non-string v-model value bindings
      // e.g. <option :value="obj">, <input type="checkbox" :true-value="1">

      var forcePatchValue = type === 'input' && dirs || type === 'option'; // skip props & children if this is hoisted static nodes

      if (forcePatchValue || patchFlag !== -1
      /* HOISTED */
      ) {
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, 'created');
        } // props


        if (props) {
          if (forcePatchValue || !optimized || patchFlag & (16
          /* FULL_PROPS */
          | 32
          /* HYDRATE_EVENTS */
          )) {
            for (var key in props) {
              if (forcePatchValue && key.endsWith('value') || isOn(key) && !isReservedProp(key)) {
                patchProp(el, key, null, props[key], false, undefined, parentComponent);
              }
            }
          } else if (props.onClick) {
            // Fast path for click listeners (which is most often) to avoid
            // iterating through props.
            patchProp(el, 'onClick', null, props.onClick, false, undefined, parentComponent);
          }
        } // vnode / directive hooks


        var vnodeHooks;

        if (vnodeHooks = props && props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHooks, parentComponent, vnode);
        }

        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, 'beforeMount');
        }

        if ((vnodeHooks = props && props.onVnodeMounted) || dirs) {
          queueEffectWithSuspense(() => {
            vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
            dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted');
          }, parentSuspense);
        } // children


        if (shapeFlag & 16
        /* ARRAY_CHILDREN */
        && // skip if element has innerHTML / textContent
        !(props && (props.innerHTML || props.textContent))) {
          var next = hydrateChildren(el.firstChild, vnode, el, parentComponent, parentSuspense, slotScopeIds, optimized);

          while (next) {
            hasMismatch = true; // The SSRed DOM contains more nodes than it should. Remove them.

            var cur = next;
            next = next.nextSibling;
            remove(cur);
          }
        } else if (shapeFlag & 8
        /* TEXT_CHILDREN */
        ) {
          if (el.textContent !== vnode.children) {
            hasMismatch = true;
            el.textContent = vnode.children;
          }
        }
      }

      return el.nextSibling;
    };

    var hydrateChildren = (node, parentVNode, container, parentComponent, parentSuspense, slotScopeIds, optimized) => {
      optimized = optimized || !!parentVNode.dynamicChildren;
      var children = parentVNode.children;
      var l = children.length;

      for (var i = 0; i < l; i++) {
        var vnode = optimized ? children[i] : children[i] = normalizeVNode(children[i]);

        if (node) {
          node = hydrateNode(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
        } else if (vnode.type === Text && !vnode.children) {
          continue;
        } else {
          hasMismatch = true; // the SSRed DOM didn't contain enough nodes. Mount the missing ones.

          patch(null, vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container), slotScopeIds);
        }
      }

      return node;
    };

    var hydrateFragment = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
      var {
        slotScopeIds: fragmentSlotScopeIds
      } = vnode;

      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }

      var container = parentNode(node);
      var next = hydrateChildren(nextSibling(node), vnode, container, parentComponent, parentSuspense, slotScopeIds, optimized);

      if (next && isComment(next) && next.data === ']') {
        return nextSibling(vnode.anchor = next);
      } else {
        // fragment didn't hydrate successfully, since we didn't get a end anchor
        // back. This should have led to node/children mismatch warnings.
        hasMismatch = true; // since the anchor is missing, we need to create one and insert it

        insert(vnode.anchor = createComment("]"), container, next);
        return next;
      }
    };

    var handleMismatch = (node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragment) => {
      hasMismatch = true;
      vnode.el = null;

      if (isFragment) {
        // remove excessive fragment nodes
        var end = locateClosingAsyncAnchor(node);

        while (true) {
          var _next = nextSibling(node);

          if (_next && _next !== end) {
            remove(_next);
          } else {
            break;
          }
        }
      }

      var next = nextSibling(node);
      var container = parentNode(node);
      remove(node);
      patch(null, vnode, container, next, parentComponent, parentSuspense, isSVGContainer(container), slotScopeIds);
      return next;
    };

    var locateClosingAsyncAnchor = node => {
      var match = 0;

      while (node) {
        node = nextSibling(node);

        if (node && isComment(node)) {
          if (node.data === '[') match++;

          if (node.data === ']') {
            if (match === 0) {
              return nextSibling(node);
            } else {
              match--;
            }
          }
        }
      }

      return node;
    };

    return [hydrate, hydrateNode];
  }
  /**
   * This is only called in esm-bundler builds.
   * It is called when a renderer is created, in `baseCreateRenderer` so that
   * importing runtime-core is side-effects free.
   *
   * istanbul-ignore-next
   */


  function initFeatureFlags() {
    if (typeof __VUE_OPTIONS_API__ !== 'boolean') {
      getGlobalThis().__VUE_OPTIONS_API__ = true;
    }

    if (typeof __VUE_PROD_DEVTOOLS__ !== 'boolean') {
      getGlobalThis().__VUE_PROD_DEVTOOLS__ = false;
    }
  }

  var queuePostRenderEffect = queueEffectWithSuspense;
  /**
   * The createRenderer function accepts two generic arguments:
   * HostNode and HostElement, corresponding to Node and Element types in the
   * host environment. For example, for runtime-dom, HostNode would be the DOM
   * `Node` interface and HostElement would be the DOM `Element` interface.
   *
   * Custom renderers can pass in the platform specific types like this:
   *
   * ``` js
   * const { render, createApp } = createRenderer<Node, Element>({
   *   patchProp,
   *   ...nodeOps
   * })
   * ```
   */

  function createRenderer(options) {
    return baseCreateRenderer(options);
  } // Separate API for creating hydration-enabled renderer.
  // Hydration logic is only used when calling this function, making it
  // tree-shakable.


  function createHydrationRenderer(options) {
    return baseCreateRenderer(options, createHydrationFunctions);
  } // implementation


  function baseCreateRenderer(options, createHydrationFns) {
    // compile-time feature flags check
    {
      initFeatureFlags();
    }
    var target = getGlobalThis();
    target.__VUE__ = true;

    if (__VUE_PROD_DEVTOOLS__) {
      setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
    }

    var {
      insert: hostInsert,
      remove: hostRemove,
      patchProp: hostPatchProp,
      forcePatchProp: hostForcePatchProp,
      // fixed by xxxxxx
      createElement: hostCreateElement,
      createText: hostCreateText,
      createComment: hostCreateComment,
      setText: hostSetText,
      setElementText: hostSetElementText,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setScopeId: hostSetScopeId = NOOP,
      cloneNode: hostCloneNode,
      insertStaticContent: hostInsertStaticContent
    } = options; // Note: functions inside this closure should use `const xxx = () => {}`
    // style in order to prevent being inlined by minifiers.

    var patch = function (n1, n2, container) {
      var anchor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var parentComponent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var parentSuspense = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
      var isSVG = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
      var slotScopeIds = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
      var optimized = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : !!n2.dynamicChildren;

      if (n1 === n2) {
        return;
      } // patching & not same type, unmount old tree


      if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1);
        unmount(n1, parentComponent, parentSuspense, true);
        n1 = null;
      }

      if (n2.patchFlag === -2
      /* BAIL */
      ) {
        optimized = false;
        n2.dynamicChildren = null;
      }

      var {
        type,
        ref,
        shapeFlag
      } = n2;

      switch (type) {
        case Text:
          processText(n1, n2, container, anchor);
          break;

        case Comment:
          processCommentNode(n1, n2, container, anchor);
          break;

        case Static:
          if (n1 == null) {
            mountStaticNode(n2, container, anchor, isSVG);
          }

          break;

        case Fragment:
          processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          break;

        default:
          if (shapeFlag & 1
          /* ELEMENT */
          ) {
            processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          } else if (shapeFlag & 6
          /* COMPONENT */
          ) {
            processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          } else if (shapeFlag & 64
          /* TELEPORT */
          ) {
            type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
          } else if (shapeFlag & 128
          /* SUSPENSE */
          ) {
            type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
          } else ;

      } // set ref


      if (ref != null && parentComponent) {
        setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
      }
    };

    var processText = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
      } else {
        var el = n2.el = n1.el;

        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    };

    var processCommentNode = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(n2.el = hostCreateComment(n2.children || ''), container, anchor);
      } else {
        // there's no support for dynamic comments
        n2.el = n1.el;
      }
    };

    var mountStaticNode = (n2, container, anchor, isSVG) => {
      [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG);
    };

    var moveStaticNode = (_ref10, container, nextSibling) => {
      var {
        el,
        anchor
      } = _ref10;
      var next;

      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostInsert(el, container, nextSibling);
        el = next;
      }

      hostInsert(anchor, container, nextSibling);
    };

    var removeStaticNode = _ref11 => {
      var {
        el,
        anchor
      } = _ref11;
      var next;

      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostRemove(el);
        el = next;
      }

      hostRemove(anchor);
    };

    var processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      isSVG = isSVG || n2.type === 'svg';

      if (n1 == null) {
        mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    };

    var mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      var el;
      var vnodeHook;
      var {
        type,
        props,
        shapeFlag,
        transition,
        patchFlag,
        dirs
      } = vnode;

      if (vnode.el && hostCloneNode !== undefined && patchFlag === -1
      /* HOISTED */
      ) {
        // If a vnode has non-null el, it means it's being reused.
        // Only static vnodes can be reused, so its mounted DOM nodes should be
        // exactly the same, and we can simply do a clone here.
        // only do this in production since cloned trees cannot be HMR updated.
        el = vnode.el = hostCloneNode(vnode.el);
      } else {
        el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props); // mount children first, since some props may rely on child content
        // being already rendered, e.g. `<select value>`

        if (shapeFlag & 8
        /* TEXT_CHILDREN */
        ) {
          hostSetElementText(el, vnode.children);
        } else if (shapeFlag & 16
        /* ARRAY_CHILDREN */
        ) {
          mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== 'foreignObject', slotScopeIds, optimized);
        }

        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, 'created');
        } // props


        if (props) {
          for (var key in props) {
            if (key !== 'value' && !isReservedProp(key)) {
              hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
          /**
           * Special case for setting value on DOM elements:
           * - it can be order-sensitive (e.g. should be set *after* min/max, #2325, #4024)
           * - it needs to be forced (#1471)
           * #2353 proposes adding another renderer option to configure this, but
           * the properties affects are so finite it is worth special casing it
           * here to reduce the complexity. (Special casing it also should not
           * affect non-DOM renderers)
           */


          if ('value' in props) {
            hostPatchProp(el, 'value', null, props.value);
          }

          if (vnodeHook = props.onVnodeBeforeMount) {
            invokeVNodeHook(vnodeHook, parentComponent, vnode);
          }
        } // scopeId


        setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
      }

      if (__VUE_PROD_DEVTOOLS__) {
        Object.defineProperty(el, '__vnode', {
          value: vnode,
          enumerable: false
        });
        Object.defineProperty(el, '__vueParentComponent', {
          value: parentComponent,
          enumerable: false
        });
      }

      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, 'beforeMount');
      } // #1583 For inside suspense + suspense not resolved case, enter hook should call when suspense resolved
      // #1689 For inside suspense + suspense resolved case, just call it


      var needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;

      if (needCallTransitionHooks) {
        transition.beforeEnter(el);
      }

      hostInsert(el, container, anchor);

      if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted');
        }, parentSuspense);
      }
    };

    var setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
      if (scopeId) {
        hostSetScopeId(el, scopeId);
      }

      if (slotScopeIds) {
        for (var i = 0; i < slotScopeIds.length; i++) {
          hostSetScopeId(el, slotScopeIds[i]);
        }
      }

      if (parentComponent) {
        var subTree = parentComponent.subTree;

        if (vnode === subTree) {
          var parentVNode = parentComponent.vnode;
          setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
        }
      }
    };

    var mountChildren = function (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) {
      var start = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;

      for (var i = start; i < children.length; i++) {
        var child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
        patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    };

    var patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      var el = n2.el = n1.el;
      var {
        patchFlag,
        dynamicChildren,
        dirs
      } = n2; // #1426 take the old vnode's patch flag into account since user may clone a
      // compiler-generated vnode, which de-opts to FULL_PROPS

      patchFlag |= n1.patchFlag & 16
      /* FULL_PROPS */
      ;
      var oldProps = n1.props || EMPTY_OBJ;
      var newProps = n2.props || EMPTY_OBJ;
      var vnodeHook;

      if (vnodeHook = newProps.onVnodeBeforeUpdate) {
        invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      }

      if (dirs) {
        invokeDirectiveHook(n2, n1, parentComponent, 'beforeUpdate');
      }

      var areChildrenSVG = isSVG && n2.type !== 'foreignObject';

      if (dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
      } else if (!optimized) {
        // full diff
        patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
      }

      if (patchFlag > 0) {
        // the presence of a patchFlag means this element's render code was
        // generated by the compiler and can take the fast path.
        // in this path old node and new node are guaranteed to have the same shape
        // (i.e. at the exact same position in the source template)
        if (patchFlag & 16
        /* FULL_PROPS */
        ) {
          // element props contain dynamic keys, full diff needed
          patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
        } else {
          // class
          // this flag is matched when the element has dynamic class bindings.
          if (patchFlag & 2
          /* CLASS */
          ) {
            if (oldProps.class !== newProps.class) {
              hostPatchProp(el, 'class', null, newProps.class, isSVG);
            }
          } // style
          // this flag is matched when the element has dynamic style bindings


          if (patchFlag & 4
          /* STYLE */
          ) {
            hostPatchProp(el, 'style', oldProps.style, newProps.style, isSVG);
          } // props
          // This flag is matched when the element has dynamic prop/attr bindings
          // other than class and style. The keys of dynamic prop/attrs are saved for
          // faster iteration.
          // Note dynamic keys like :[foo]="bar" will cause this optimization to
          // bail out and go through a full diff because we need to unset the old key


          if (patchFlag & 8
          /* PROPS */
          ) {
            // if the flag is present then dynamicProps must be non-null
            var propsToUpdate = n2.dynamicProps;

            for (var i = 0; i < propsToUpdate.length; i++) {
              var key = propsToUpdate[i];
              var prev = oldProps[key];
              var next = newProps[key]; // #1471 force patch value

              if (next !== prev || key === 'value' || hostForcePatchProp && hostForcePatchProp(el, key) // fixed by xxxxxx
              ) {
                hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
              }
            }
          }
        } // text
        // This flag is matched when the element has only dynamic text children.


        if (patchFlag & 1
        /* TEXT */
        ) {
          if (n1.children !== n2.children) {
            hostSetElementText(el, n2.children);
          }
        }
      } else if (!optimized && dynamicChildren == null) {
        // unoptimized, full diff
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      }

      if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          dirs && invokeDirectiveHook(n2, n1, parentComponent, 'updated');
        }, parentSuspense);
      }
    }; // The fast path for blocks.


    var patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
      for (var i = 0; i < newChildren.length; i++) {
        var oldVNode = oldChildren[i];
        var newVNode = newChildren[i]; // Determine the container (parent element) for the patch.

        var container = // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && ( // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6
        /* COMPONENT */
        | 64
        /* TELEPORT */
        )) ? hostParentNode(oldVNode.el) : // In other cases, the parent container is not actually used so we
        // just pass the block element here to avoid a DOM parentNode call.
        fallbackContainer;
        patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
      }
    };

    var patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
      if (oldProps !== newProps) {
        for (var key in newProps) {
          // empty string is not valid prop
          if (isReservedProp(key)) continue;
          var next = newProps[key];
          var prev = oldProps[key]; // defer patching value

          if (next !== prev && key !== 'value' || hostForcePatchProp && hostForcePatchProp(el, key) // fixed by xxxxxx
          ) {
            hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }

        if (oldProps !== EMPTY_OBJ) {
          for (var _key13 in oldProps) {
            if (!isReservedProp(_key13) && !(_key13 in newProps)) {
              hostPatchProp(el, _key13, oldProps[_key13], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }

        if ('value' in newProps) {
          hostPatchProp(el, 'value', oldProps.value, newProps.value);
        }
      }
    };

    var processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      var fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText('');
      var fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText('');
      var {
        patchFlag,
        dynamicChildren,
        slotScopeIds: fragmentSlotScopeIds
      } = n2; // check if this is a slot fragment with :slotted scope ids

      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }

      if (n1 == null) {
        hostInsert(fragmentStartAnchor, container, anchor);
        hostInsert(fragmentEndAnchor, container, anchor); // a fragment can only have array children
        // since they are either generated by the compiler, or implicitly created
        // from arrays.

        mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        if (patchFlag > 0 && patchFlag & 64
        /* STABLE_FRAGMENT */
        && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
        // of renderSlot() with no valid children
        n1.dynamicChildren) {
          // a stable fragment (template root or <template v-for>) doesn't need to
          // patch children order, but it may contain dynamicChildren.
          patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);

          if ( // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree) {
            traverseStaticChildren(n1, n2, true
            /* shallow */
            );
          }
        } else {
          // keyed / unkeyed, or manual fragments.
          // for keyed & unkeyed, since they are compiler generated from v-for,
          // each child is guaranteed to be a block so the fragment will never
          // have dynamicChildren.
          patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    };

    var processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      n2.slotScopeIds = slotScopeIds;

      if (n1 == null) {
        if (n2.shapeFlag & 512
        /* COMPONENT_KEPT_ALIVE */
        ) {
          parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
        } else {
          mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
        }
      } else {
        updateComponent(n1, n2, optimized);
      }
    };

    var mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
      var instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense); // inject renderer internals for keepAlive

      if (isKeepAlive(initialVNode)) {
        instance.ctx.renderer = internals;
      } // resolve props and slots for setup context


      {
        setupComponent(instance);
      } // setup() is async. This component relies on async logic to be resolved
      // before proceeding

      if (instance.asyncDep) {
        parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect); // Give it a placeholder if this is not hydration
        // TODO handle self-defined fallback

        if (!initialVNode.el) {
          var placeholder = instance.subTree = createVNode(Comment);
          processCommentNode(null, placeholder, container, anchor);
        }

        return;
      }

      setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
    };

    var updateComponent = (n1, n2, optimized) => {
      var instance = n2.component = n1.component;

      if (shouldUpdateComponent(n1, n2, optimized)) {
        if (instance.asyncDep && !instance.asyncResolved) {
          updateComponentPreRender(instance, n2, optimized);
          return;
        } else {
          // normal update
          instance.next = n2; // in case the child component is also queued, remove it to avoid
          // double updating the same child component in the same flush.

          invalidateJob(instance.update); // instance.update is the reactive effect.

          instance.update();
        }
      } else {
        // no update needed. just copy over properties
        n2.component = n1.component;
        n2.el = n1.el;
        instance.vnode = n2;
      }
    };

    var setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
      var componentUpdateFn = () => {
        if (!instance.isMounted) {
          var vnodeHook;
          var {
            el,
            props
          } = initialVNode;
          var {
            bm,
            m,
            parent
          } = instance;
          var isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
          effect.allowRecurse = false; // beforeMount hook

          if (bm) {
            invokeArrayFns(bm);
          } // onVnodeBeforeMount


          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
          }

          effect.allowRecurse = true;

          if (el && hydrateNode) {
            // vnode has adopted host node - perform hydration instead of mount.
            var hydrateSubTree = () => {
              instance.subTree = renderComponentRoot(instance);
              hydrateNode(el, instance.subTree, instance, parentSuspense, null);
            };

            if (isAsyncWrapperVNode) {
              initialVNode.type.__asyncLoader().then( // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree());
            } else {
              hydrateSubTree();
            }
          } else {
            var subTree = instance.subTree = renderComponentRoot(instance);
            patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
            initialVNode.el = subTree.el;
          } // mounted hook


          if (m) {
            queuePostRenderEffect(m, parentSuspense);
          } // onVnodeMounted


          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
            var scopedInitialVNode = initialVNode;
            queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
          } // activated hook for keep-alive roots.
          // #1742 activated hook must be accessed after first render
          // since the hook may be injected by a child keep-alive


          if (initialVNode.shapeFlag & 256
          /* COMPONENT_SHOULD_KEEP_ALIVE */
          ) {
            instance.a && queuePostRenderEffect(instance.a, parentSuspense);
          }

          instance.isMounted = true;

          if (__VUE_PROD_DEVTOOLS__) {
            devtoolsComponentAdded(instance);
          } // #2458: deference mount-only object parameters to prevent memleaks


          initialVNode = container = anchor = null;
        } else {
          // updateComponent
          // This is triggered by mutation of component's own state (next: null)
          // OR parent calling processComponent (next: VNode)
          var {
            next,
            bu,
            u,
            parent: _parent,
            vnode
          } = instance;
          var originNext = next;

          var _vnodeHook; // Disallow component effect recursion during pre-lifecycle hooks.


          effect.allowRecurse = false;

          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next, optimized);
          } else {
            next = vnode;
          } // beforeUpdate hook


          if (bu) {
            invokeArrayFns(bu);
          } // onVnodeBeforeUpdate


          if (_vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
            invokeVNodeHook(_vnodeHook, _parent, next, vnode);
          }

          effect.allowRecurse = true;
          var nextTree = renderComponentRoot(instance);
          var prevTree = instance.subTree;
          instance.subTree = nextTree;
          patch(prevTree, nextTree, // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el), // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree), instance, parentSuspense, isSVG);
          next.el = nextTree.el;

          if (originNext === null) {
            // self-triggered update. In case of HOC, update parent component
            // vnode el. HOC is indicated by parent instance's subTree pointing
            // to child component's vnode
            updateHOCHostEl(instance, nextTree.el);
          } // updated hook


          if (u) {
            queuePostRenderEffect(u, parentSuspense);
          } // onVnodeUpdated


          if (_vnodeHook = next.props && next.props.onVnodeUpdated) {
            queuePostRenderEffect(() => invokeVNodeHook(_vnodeHook, _parent, next, vnode), parentSuspense);
          }

          if (__VUE_PROD_DEVTOOLS__) {
            devtoolsComponentUpdated(instance);
          }
        }
      }; // create reactive effect for rendering


      var effect = new ReactiveEffect(componentUpdateFn, () => queueJob(instance.update), instance.scope // track it in component's effect scope
      );
      var update = instance.update = effect.run.bind(effect);
      update.id = instance.uid; // allowRecurse
      // #1801, #2043 component render effects should allow recursive updates

      effect.allowRecurse = update.allowRecurse = true;
      update();
    };

    var updateComponentPreRender = (instance, nextVNode, optimized) => {
      nextVNode.component = instance;
      var prevProps = instance.vnode.props;
      instance.vnode = nextVNode;
      instance.next = null;
      updateProps(instance, nextVNode.props, prevProps, optimized);
      updateSlots(instance, nextVNode.children, optimized);
      pauseTracking(); // props update may have triggered pre-flush watchers.
      // flush them before the render update.

      flushPreFlushCbs(undefined, instance.update);
      resetTracking();
    };

    var patchChildren = function (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds) {
      var optimized = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : false;
      var c1 = n1 && n1.children;
      var prevShapeFlag = n1 ? n1.shapeFlag : 0;
      var c2 = n2.children;
      var {
        patchFlag,
        shapeFlag
      } = n2; // fast path

      if (patchFlag > 0) {
        if (patchFlag & 128
        /* KEYED_FRAGMENT */
        ) {
          // this could be either fully-keyed or mixed (some keyed some not)
          // presence of patchFlag means children are guaranteed to be arrays
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          return;
        } else if (patchFlag & 256
        /* UNKEYED_FRAGMENT */
        ) {
          // unkeyed
          patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          return;
        }
      } // children has 3 possibilities: text, array or no children.


      if (shapeFlag & 8
      /* TEXT_CHILDREN */
      ) {
        // text children fast path
        if (prevShapeFlag & 16
        /* ARRAY_CHILDREN */
        ) {
          unmountChildren(c1, parentComponent, parentSuspense);
        }

        if (c2 !== c1) {
          hostSetElementText(container, c2);
        }
      } else {
        if (prevShapeFlag & 16
        /* ARRAY_CHILDREN */
        ) {
          // prev children was array
          if (shapeFlag & 16
          /* ARRAY_CHILDREN */
          ) {
            // two arrays, cannot assume anything, do full diff
            patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          } else {
            // no new children, just unmount old
            unmountChildren(c1, parentComponent, parentSuspense, true);
          }
        } else {
          // prev children was text OR null
          // new children is array OR null
          if (prevShapeFlag & 8
          /* TEXT_CHILDREN */
          ) {
            hostSetElementText(container, '');
          } // mount new if array


          if (shapeFlag & 16
          /* ARRAY_CHILDREN */
          ) {
            mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          }
        }
      }
    };

    var patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      c1 = c1 || EMPTY_ARR;
      c2 = c2 || EMPTY_ARR;
      var oldLength = c1.length;
      var newLength = c2.length;
      var commonLength = Math.min(oldLength, newLength);
      var i;

      for (i = 0; i < commonLength; i++) {
        var nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }

      if (oldLength > newLength) {
        // remove old
        unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
      } else {
        // mount new
        mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
      }
    }; // can be all-keyed or mixed


    var patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      var i = 0;
      var l2 = c2.length;
      var e1 = c1.length - 1; // prev ending index

      var e2 = l2 - 1; // next ending index
      // 1. sync from start
      // (a b) c
      // (a b) d e

      while (i <= e1 && i <= e2) {
        var n1 = c1[i];
        var n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);

        if (isSameVNodeType(n1, n2)) {
          patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          break;
        }

        i++;
      } // 2. sync from end
      // a (b c)
      // d e (b c)


      while (i <= e1 && i <= e2) {
        var _n = c1[e1];

        var _n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);

        if (isSameVNodeType(_n, _n2)) {
          patch(_n, _n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          break;
        }

        e1--;
        e2--;
      } // 3. common sequence + mount
      // (a b)
      // (a b) c
      // i = 2, e1 = 1, e2 = 2
      // (a b)
      // c (a b)
      // i = 0, e1 = -1, e2 = 0


      if (i > e1) {
        if (i <= e2) {
          var nextPos = e2 + 1;
          var anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;

          while (i <= e2) {
            patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            i++;
          }
        }
      } // 4. common sequence + unmount
      // (a b) c
      // (a b)
      // i = 2, e1 = 2, e2 = 1
      // a (b c)
      // (b c)
      // i = 0, e1 = 0, e2 = -1
      else if (i > e2) {
        while (i <= e1) {
          unmount(c1[i], parentComponent, parentSuspense, true);
          i++;
        }
      } // 5. unknown sequence
      // [i ... e1 + 1]: a b [c d e] f g
      // [i ... e2 + 1]: a b [e d c h] f g
      // i = 2, e1 = 4, e2 = 5
      else {
        var s1 = i; // prev starting index

        var s2 = i; // next starting index
        // 5.1 build key:index map for newChildren

        var keyToNewIndexMap = new Map();

        for (i = s2; i <= e2; i++) {
          var nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);

          if (nextChild.key != null) {
            keyToNewIndexMap.set(nextChild.key, i);
          }
        } // 5.2 loop through old children left to be patched and try to patch
        // matching nodes & remove nodes that are no longer present


        var j;
        var patched = 0;
        var toBePatched = e2 - s2 + 1;
        var moved = false; // used to track whether any node has moved

        var maxNewIndexSoFar = 0; // works as Map<newIndex, oldIndex>
        // Note that oldIndex is offset by +1
        // and oldIndex = 0 is a special value indicating the new node has
        // no corresponding old node.
        // used for determining longest stable subsequence

        var newIndexToOldIndexMap = new Array(toBePatched);

        for (i = 0; i < toBePatched; i++) {
          newIndexToOldIndexMap[i] = 0;
        }

        for (i = s1; i <= e1; i++) {
          var prevChild = c1[i];

          if (patched >= toBePatched) {
            // all new children have been patched so this can only be a removal
            unmount(prevChild, parentComponent, parentSuspense, true);
            continue;
          }

          var newIndex = void 0;

          if (prevChild.key != null) {
            newIndex = keyToNewIndexMap.get(prevChild.key);
          } else {
            // key-less node, try to locate a key-less node of the same type
            for (j = s2; j <= e2; j++) {
              if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                newIndex = j;
                break;
              }
            }
          }

          if (newIndex === undefined) {
            unmount(prevChild, parentComponent, parentSuspense, true);
          } else {
            newIndexToOldIndexMap[newIndex - s2] = i + 1;

            if (newIndex >= maxNewIndexSoFar) {
              maxNewIndexSoFar = newIndex;
            } else {
              moved = true;
            }

            patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            patched++;
          }
        } // 5.3 move and mount
        // generate longest stable subsequence only when nodes have moved


        var increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
        j = increasingNewIndexSequence.length - 1; // looping backwards so that we can use last patched node as anchor

        for (i = toBePatched - 1; i >= 0; i--) {
          var nextIndex = s2 + i;
          var _nextChild = c2[nextIndex];

          var _anchor2 = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;

          if (newIndexToOldIndexMap[i] === 0) {
            // mount new
            patch(null, _nextChild, container, _anchor2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          } else if (moved) {
            // move if:
            // There is no stable subsequence (e.g. a reverse)
            // OR current node is not among the stable sequence
            if (j < 0 || i !== increasingNewIndexSequence[j]) {
              move(_nextChild, container, _anchor2, 2
              /* REORDER */
              );
            } else {
              j--;
            }
          }
        }
      }
    };

    var move = function (vnode, container, anchor, moveType) {
      var parentSuspense = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var {
        el,
        type,
        transition,
        children,
        shapeFlag
      } = vnode;

      if (shapeFlag & 6
      /* COMPONENT */
      ) {
        move(vnode.component.subTree, container, anchor, moveType);
        return;
      }

      if (shapeFlag & 128
      /* SUSPENSE */
      ) {
        vnode.suspense.move(container, anchor, moveType);
        return;
      }

      if (shapeFlag & 64
      /* TELEPORT */
      ) {
        type.move(vnode, container, anchor, internals);
        return;
      }

      if (type === Fragment) {
        hostInsert(el, container, anchor);

        for (var i = 0; i < children.length; i++) {
          move(children[i], container, anchor, moveType);
        }

        hostInsert(vnode.anchor, container, anchor);
        return;
      }

      if (type === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      } // single nodes


      var needTransition = moveType !== 2
      /* REORDER */
      && shapeFlag & 1
      /* ELEMENT */
      && transition;

      if (needTransition) {
        if (moveType === 0
        /* ENTER */
        ) {
          transition.beforeEnter(el);
          hostInsert(el, container, anchor);
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        } else {
          var {
            leave,
            delayLeave,
            afterLeave
          } = transition;

          var _remove = () => hostInsert(el, container, anchor);

          var performLeave = () => {
            leave(el, () => {
              _remove();

              afterLeave && afterLeave();
            });
          };

          if (delayLeave) {
            delayLeave(el, _remove, performLeave);
          } else {
            performLeave();
          }
        }
      } else {
        hostInsert(el, container, anchor);
      }
    };

    var unmount = function (vnode, parentComponent, parentSuspense) {
      var doRemove = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var optimized = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var {
        type,
        props,
        ref,
        children,
        dynamicChildren,
        shapeFlag,
        patchFlag,
        dirs
      } = vnode; // unset ref

      if (ref != null) {
        setRef(ref, null, parentSuspense, vnode, true);
      }

      if (shapeFlag & 256
      /* COMPONENT_SHOULD_KEEP_ALIVE */
      ) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }

      var shouldInvokeDirs = shapeFlag & 1
      /* ELEMENT */
      && dirs;
      var shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
      var vnodeHook;

      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }

      if (shapeFlag & 6
      /* COMPONENT */
      ) {
        unmountComponent(vnode.component, parentSuspense, doRemove);
      } else {
        if (shapeFlag & 128
        /* SUSPENSE */
        ) {
          vnode.suspense.unmount(parentSuspense, doRemove);
          return;
        }

        if (shouldInvokeDirs) {
          invokeDirectiveHook(vnode, null, parentComponent, 'beforeUnmount');
        }

        if (shapeFlag & 64
        /* TELEPORT */
        ) {
          vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
        } else if (dynamicChildren && ( // #1153: fast path should not be taken for non-stable (v-for) fragments
        type !== Fragment || patchFlag > 0 && patchFlag & 64
        /* STABLE_FRAGMENT */
        )) {
          // fast path for block nodes: only need to unmount dynamic children.
          unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
        } else if (type === Fragment && patchFlag & (128
        /* KEYED_FRAGMENT */
        | 256
        /* UNKEYED_FRAGMENT */
        ) || !optimized && shapeFlag & 16
        /* ARRAY_CHILDREN */
        ) {
          unmountChildren(children, parentComponent, parentSuspense);
        }

        if (doRemove) {
          remove(vnode);
        }
      }

      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, 'unmounted');
        }, parentSuspense);
      }
    };

    var remove = vnode => {
      var {
        type,
        el,
        anchor,
        transition
      } = vnode;

      if (type === Fragment) {
        removeFragment(el, anchor);
        return;
      }

      if (type === Static) {
        removeStaticNode(vnode);
        return;
      }

      var performRemove = () => {
        hostRemove(el);

        if (transition && !transition.persisted && transition.afterLeave) {
          transition.afterLeave();
        }
      };

      if (vnode.shapeFlag & 1
      /* ELEMENT */
      && transition && !transition.persisted) {
        var {
          leave,
          delayLeave
        } = transition;

        var performLeave = () => leave(el, performRemove);

        if (delayLeave) {
          delayLeave(vnode.el, performRemove, performLeave);
        } else {
          performLeave();
        }
      } else {
        performRemove();
      }
    };

    var removeFragment = (cur, end) => {
      // For fragments, directly remove all contained DOM nodes.
      // (fragment child nodes cannot have transition)
      var next;

      while (cur !== end) {
        next = hostNextSibling(cur);
        hostRemove(cur);
        cur = next;
      }

      hostRemove(end);
    };

    var unmountComponent = (instance, parentSuspense, doRemove) => {
      var {
        bum,
        scope,
        update,
        subTree,
        um
      } = instance; // beforeUnmount hook

      if (bum) {
        invokeArrayFns(bum);
      } // stop effects in component scope


      scope.stop(); // update may be null if a component is unmounted before its async
      // setup has resolved.

      if (update) {
        // so that scheduler will no longer invoke it
        update.active = false;
        unmount(subTree, instance, parentSuspense, doRemove);
      } // unmounted hook


      if (um) {
        queuePostRenderEffect(um, parentSuspense);
      }

      queuePostRenderEffect(() => {
        instance.isUnmounted = true;
      }, parentSuspense); // A component with async dep inside a pending suspense is unmounted before
      // its async dep resolves. This should remove the dep from the suspense, and
      // cause the suspense to resolve immediately if that was the last dep.

      if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
        parentSuspense.deps--;

        if (parentSuspense.deps === 0) {
          parentSuspense.resolve();
        }
      }

      if (__VUE_PROD_DEVTOOLS__) {
        devtoolsComponentRemoved(instance);
      }
    };

    var unmountChildren = function (children, parentComponent, parentSuspense) {
      var doRemove = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var optimized = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var start = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

      for (var i = start; i < children.length; i++) {
        unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
      }
    };

    var getNextHostNode = vnode => {
      if (vnode.shapeFlag & 6
      /* COMPONENT */
      ) {
        return getNextHostNode(vnode.component.subTree);
      }

      if (vnode.shapeFlag & 128
      /* SUSPENSE */
      ) {
        return vnode.suspense.next();
      }

      return hostNextSibling(vnode.anchor || vnode.el);
    };

    var render = (vnode, container, isSVG) => {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null, null, true);
        }
      } else {
        patch(container._vnode || null, vnode, container, null, null, null, isSVG);
      }

      flushPostFlushCbs();
      container._vnode = vnode;
    };

    var internals = {
      p: patch,
      um: unmount,
      m: move,
      r: remove,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    var hydrate;
    var hydrateNode;

    if (createHydrationFns) {
      [hydrate, hydrateNode] = createHydrationFns(internals);
    }

    return {
      render,
      hydrate,
      createApp: createAppAPI(render, hydrate)
    };
  }

  function setRef(rawRef, oldRawRef, parentSuspense, vnode) {
    var isUnmount = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    if (isArray(rawRef)) {
      rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
      return;
    }

    if (isAsyncWrapper(vnode) && !isUnmount) {
      // when mounting async components, nothing needs to be done,
      // because the template ref is forwarded to inner component
      return;
    }

    var refValue = vnode.shapeFlag & 4
    /* STATEFUL_COMPONENT */
    ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
    var value = isUnmount ? null : refValue;
    var {
      i: owner,
      r: ref
    } = rawRef;
    var oldRef = oldRawRef && oldRawRef.r;
    var refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
    var setupState = owner.setupState; // dynamic ref changed. unset old ref

    if (oldRef != null && oldRef !== ref) {
      if (isString(oldRef)) {
        refs[oldRef] = null;

        if (hasOwn(setupState, oldRef)) {
          setupState[oldRef] = null;
        }
      } else if (isRef(oldRef)) {
        oldRef.value = null;
      }
    }

    if (isString(ref)) {
      var doSet = () => {
        {
          refs[ref] = value;
        }

        if (hasOwn(setupState, ref)) {
          setupState[ref] = value;
        }
      }; // #1789: for non-null values, set them after render
      // null values means this is unmount and it should not overwrite another
      // ref with the same key


      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    } else if (isRef(ref)) {
      var _doSet = () => {
        ref.value = value;
      };

      if (value) {
        _doSet.id = -1;
        queuePostRenderEffect(_doSet, parentSuspense);
      } else {
        _doSet();
      }
    } else if (isFunction(ref)) {
      callWithErrorHandling(ref, owner, 12
      /* FUNCTION_REF */
      , [value, refs]);
    } else ;
  }

  function invokeVNodeHook(hook, instance, vnode) {
    var prevVNode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    callWithAsyncErrorHandling(hook, instance, 7
    /* VNODE_HOOK */
    , [vnode, prevVNode]);
  }
  /**
   * #1156
   * When a component is HMR-enabled, we need to make sure that all static nodes
   * inside a block also inherit the DOM element from the previous tree so that
   * HMR updates (which are full updates) can retrieve the element for patching.
   *
   * #2080
   * Inside keyed `template` fragment static children, if a fragment is moved,
   * the children will always be moved. Therefore, in order to ensure correct move
   * position, el should be inherited from previous nodes.
   */


  function traverseStaticChildren(n1, n2) {
    var shallow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var ch1 = n1.children;
    var ch2 = n2.children;

    if (isArray(ch1) && isArray(ch2)) {
      for (var i = 0; i < ch1.length; i++) {
        // this is only called in the optimized path so array children are
        // guaranteed to be vnodes
        var c1 = ch1[i];
        var c2 = ch2[i];

        if (c2.shapeFlag & 1
        /* ELEMENT */
        && !c2.dynamicChildren) {
          if (c2.patchFlag <= 0 || c2.patchFlag === 32
          /* HYDRATE_EVENTS */
          ) {
            c2 = ch2[i] = cloneIfMounted(ch2[i]);
            c2.el = c1.el;
          }

          if (!shallow) traverseStaticChildren(c1, c2);
        }
      }
    }
  } // https://en.wikipedia.org/wiki/Longest_increasing_subsequence


  function getSequence(arr) {
    var p = arr.slice();
    var result = [0];
    var i, j, u, v, c;
    var len = arr.length;

    for (i = 0; i < len; i++) {
      var arrI = arr[i];

      if (arrI !== 0) {
        j = result[result.length - 1];

        if (arr[j] < arrI) {
          p[i] = j;
          result.push(i);
          continue;
        }

        u = 0;
        v = result.length - 1;

        while (u < v) {
          c = u + v >> 1;

          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }

        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1];
          }

          result[u] = i;
        }
      }
    }

    u = result.length;
    v = result[u - 1];

    while (u-- > 0) {
      result[u] = v;
      v = p[v];
    }

    return result;
  }

  var isTeleport = type => type.__isTeleport;

  var isTeleportDisabled = props => props && (props.disabled || props.disabled === '');

  var isTargetSVG = target => typeof SVGElement !== 'undefined' && target instanceof SVGElement;

  var resolveTarget = (props, select) => {
    var targetSelector = props && props.to;

    if (isString(targetSelector)) {
      if (!select) {
        return null;
      } else {
        var target = select(targetSelector);
        return target;
      }
    } else {
      return targetSelector;
    }
  };

  var TeleportImpl = {
    __isTeleport: true,

    process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals) {
      var {
        mc: mountChildren,
        pc: patchChildren,
        pbc: patchBlockChildren,
        o: {
          insert,
          querySelector,
          createText,
          createComment
        }
      } = internals;
      var disabled = isTeleportDisabled(n2.props);
      var {
        shapeFlag,
        children,
        dynamicChildren
      } = n2;

      if (n1 == null) {
        // insert anchors in the main view
        var placeholder = n2.el = createText('');
        var mainAnchor = n2.anchor = createText('');
        insert(placeholder, container, anchor);
        insert(mainAnchor, container, anchor);
        var target = n2.target = resolveTarget(n2.props, querySelector);
        var targetAnchor = n2.targetAnchor = createText('');

        if (target) {
          insert(targetAnchor, target); // #2652 we could be teleporting from a non-SVG tree into an SVG tree

          isSVG = isSVG || isTargetSVG(target);
        }

        var mount = (container, anchor) => {
          // Teleport *always* has Array children. This is enforced in both the
          // compiler and vnode children normalization.
          if (shapeFlag & 16
          /* ARRAY_CHILDREN */
          ) {
            mountChildren(children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          }
        };

        if (disabled) {
          mount(container, mainAnchor);
        } else if (target) {
          mount(target, targetAnchor);
        }
      } else {
        // update content
        n2.el = n1.el;

        var _mainAnchor = n2.anchor = n1.anchor;

        var _target = n2.target = n1.target;

        var _targetAnchor = n2.targetAnchor = n1.targetAnchor;

        var wasDisabled = isTeleportDisabled(n1.props);
        var currentContainer = wasDisabled ? container : _target;
        var currentAnchor = wasDisabled ? _mainAnchor : _targetAnchor;
        isSVG = isSVG || isTargetSVG(_target);

        if (dynamicChildren) {
          // fast path when the teleport happens to be a block root
          patchBlockChildren(n1.dynamicChildren, dynamicChildren, currentContainer, parentComponent, parentSuspense, isSVG, slotScopeIds); // even in block tree mode we need to make sure all root-level nodes
          // in the teleport inherit previous DOM references so that they can
          // be moved in future patches.

          traverseStaticChildren(n1, n2, true);
        } else if (!optimized) {
          patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, false);
        }

        if (disabled) {
          if (!wasDisabled) {
            // enabled -> disabled
            // move into main container
            moveTeleport(n2, container, _mainAnchor, internals, 1
            /* TOGGLE */
            );
          }
        } else {
          // target changed
          if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
            var nextTarget = n2.target = resolveTarget(n2.props, querySelector);

            if (nextTarget) {
              moveTeleport(n2, nextTarget, null, internals, 0
              /* TARGET_CHANGE */
              );
            }
          } else if (wasDisabled) {
            // disabled -> enabled
            // move into teleport target
            moveTeleport(n2, _target, _targetAnchor, internals, 1
            /* TOGGLE */
            );
          }
        }
      }
    },

    remove(vnode, parentComponent, parentSuspense, optimized, _ref12, doRemove) {
      var {
        um: unmount,
        o: {
          remove: hostRemove
        }
      } = _ref12;
      var {
        shapeFlag,
        children,
        anchor,
        targetAnchor,
        target,
        props
      } = vnode;

      if (target) {
        hostRemove(targetAnchor);
      } // an unmounted teleport should always remove its children if not disabled


      if (doRemove || !isTeleportDisabled(props)) {
        hostRemove(anchor);

        if (shapeFlag & 16
        /* ARRAY_CHILDREN */
        ) {
          for (var i = 0; i < children.length; i++) {
            var child = children[i];
            unmount(child, parentComponent, parentSuspense, true, !!child.dynamicChildren);
          }
        }
      }
    },

    move: moveTeleport,
    hydrate: hydrateTeleport
  };

  function moveTeleport(vnode, container, parentAnchor, _ref13) {
    var {
      o: {
        insert
      },
      m: move
    } = _ref13;
    var moveType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 2;

    // move target anchor if this is a target change.
    if (moveType === 0
    /* TARGET_CHANGE */
    ) {
      insert(vnode.targetAnchor, container, parentAnchor);
    }

    var {
      el,
      anchor,
      shapeFlag,
      children,
      props
    } = vnode;
    var isReorder = moveType === 2
    /* REORDER */
    ; // move main view anchor if this is a re-order.

    if (isReorder) {
      insert(el, container, parentAnchor);
    } // if this is a re-order and teleport is enabled (content is in target)
    // do not move children. So the opposite is: only move children if this
    // is not a reorder, or the teleport is disabled


    if (!isReorder || isTeleportDisabled(props)) {
      // Teleport has either Array children or no children.
      if (shapeFlag & 16
      /* ARRAY_CHILDREN */
      ) {
        for (var i = 0; i < children.length; i++) {
          move(children[i], container, parentAnchor, 2
          /* REORDER */
          );
        }
      }
    } // move main view anchor if this is a re-order.


    if (isReorder) {
      insert(anchor, container, parentAnchor);
    }
  }

  function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, _ref14, hydrateChildren) {
    var {
      o: {
        nextSibling,
        parentNode,
        querySelector
      }
    } = _ref14;
    var target = vnode.target = resolveTarget(vnode.props, querySelector);

    if (target) {
      // if multiple teleports rendered to the same target element, we need to
      // pick up from where the last teleport finished instead of the first node
      var targetNode = target._lpa || target.firstChild;

      if (vnode.shapeFlag & 16
      /* ARRAY_CHILDREN */
      ) {
        if (isTeleportDisabled(vnode.props)) {
          vnode.anchor = hydrateChildren(nextSibling(node), vnode, parentNode(node), parentComponent, parentSuspense, slotScopeIds, optimized);
          vnode.targetAnchor = targetNode;
        } else {
          vnode.anchor = nextSibling(node);
          vnode.targetAnchor = hydrateChildren(targetNode, vnode, target, parentComponent, parentSuspense, slotScopeIds, optimized);
        }

        target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
      }
    }

    return vnode.anchor && nextSibling(vnode.anchor);
  } // Force-casted public typing for h and TSX props inference


  var Teleport = TeleportImpl;
  var COMPONENTS = 'components';
  var DIRECTIVES = 'directives';
  /**
   * @private
   */

  function resolveComponent(name, maybeSelfReference) {
    return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
  }

  var NULL_DYNAMIC_COMPONENT = Symbol();
  /**
   * @private
   */

  function resolveDynamicComponent(component) {
    if (isString(component)) {
      return resolveAsset(COMPONENTS, component, false) || component;
    } else {
      // invalid types will fallthrough to createVNode and raise warning
      return component || NULL_DYNAMIC_COMPONENT;
    }
  }
  /**
   * @private
   */


  function resolveDirective(name) {
    return resolveAsset(DIRECTIVES, name);
  } // implementation


  function resolveAsset(type, name) {
    var warnMissing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var maybeSelfReference = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var instance = currentRenderingInstance || currentInstance;

    if (instance) {
      var Component = instance.type; // explicit self name has highest priority

      if (type === COMPONENTS) {
        var selfName = getComponentName(Component);

        if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
          return Component;
        }
      }

      var res = // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name);

      if (!res && maybeSelfReference) {
        // fallback to implicit self-reference
        return Component;
      }

      return res;
    }
  }

  function resolve(registry, name) {
    return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
  }

  var Fragment = Symbol(undefined);
  var Text = Symbol(undefined);
  var Comment = Symbol(undefined);
  var Static = Symbol(undefined); // Since v-if and v-for are the two possible ways node structure can dynamically
  // change, once we consider v-if branches and each v-for fragment a block, we
  // can divide a template into nested blocks, and within each block the node
  // structure would be stable. This allows us to skip most children diffing
  // and only worry about the dynamic nodes (indicated by patch flags).

  var blockStack = [];
  var currentBlock = null;
  /**
   * Open a block.
   * This must be called before `createBlock`. It cannot be part of `createBlock`
   * because the children of the block are evaluated before `createBlock` itself
   * is called. The generated code typically looks like this:
   *
   * ```js
   * function render() {
   *   return (openBlock(),createBlock('div', null, [...]))
   * }
   * ```
   * disableTracking is true when creating a v-for fragment block, since a v-for
   * fragment always diffs its children.
   *
   * @private
   */

  function openBlock() {
    var disableTracking = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    blockStack.push(currentBlock = disableTracking ? null : []);
  }

  function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
  } // Whether we should be tracking dynamic child nodes inside a block.
  // Only tracks when this value is > 0
  // We are not using a simple boolean because this value may need to be
  // incremented/decremented by nested usage of v-once (see below)


  var isBlockTreeEnabled = 1;
  /**
   * Block tracking sometimes needs to be disabled, for example during the
   * creation of a tree that needs to be cached by v-once. The compiler generates
   * code like this:
   *
   * ``` js
   * _cache[1] || (
   *   setBlockTracking(-1),
   *   _cache[1] = createVNode(...),
   *   setBlockTracking(1),
   *   _cache[1]
   * )
   * ```
   *
   * @private
   */

  function setBlockTracking(value) {
    isBlockTreeEnabled += value;
  }

  function setupBlock(vnode) {
    // save current block children on the block vnode
    vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null; // close block

    closeBlock(); // a block is always going to be patched, so track it as a child of its
    // parent block

    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(vnode);
    }

    return vnode;
  }
  /**
   * @private
   */


  function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
    return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true
    /* isBlock */
    ));
  }
  /**
   * Create a block root vnode. Takes the same exact arguments as `createVNode`.
   * A block root keeps track of dynamic nodes within the block in the
   * `dynamicChildren` array.
   *
   * @private
   */


  function createBlock(type, props, children, patchFlag, dynamicProps) {
    return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true
    /* isBlock: prevent a block from tracking itself */
    ));
  }

  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }

  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  /**
   * Internal API for registering an arguments transform for createVNode
   * used for creating stubs in the test-utils
   * It is *internal* but needs to be exposed for test-utils to pick up proper
   * typings
   */


  function transformVNodeArgs(transformer) {}

  var InternalObjectKey = "__vInternal";

  var normalizeKey = _ref15 => {
    var {
      key
    } = _ref15;
    return key != null ? key : null;
  };

  var normalizeRef = _ref16 => {
    var {
      ref
    } = _ref16;
    return ref != null ? isString(ref) || isRef(ref) || isFunction(ref) ? {
      i: currentRenderingInstance,
      r: ref
    } : ref : null;
  };

  function createBaseVNode(type) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var patchFlag = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var dynamicProps = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var shapeFlag = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : type === Fragment ? 0 : 1;
    var isBlockNode = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
    var needFullChildrenNormalization = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    var vnode = {
      __v_isVNode: true,
      __v_skip: true,
      type,
      props,
      key: props && normalizeKey(props),
      ref: props && normalizeRef(props),
      scopeId: currentScopeId,
      slotScopeIds: null,
      children,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag,
      patchFlag,
      dynamicProps,
      dynamicChildren: null,
      appContext: null
    };

    if (needFullChildrenNormalization) {
      normalizeChildren(vnode, children); // normalize suspense children

      if (shapeFlag & 128
      /* SUSPENSE */
      ) {
        type.normalize(vnode);
      }
    } else if (children) {
      // compiled element vnode - if children is passed, only possible types are
      // string or Array.
      vnode.shapeFlag |= isString(children) ? 8
      /* TEXT_CHILDREN */
      : 16
      /* ARRAY_CHILDREN */
      ;
    } // track vnode for block tree


    if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
    !isBlockNode && // has current parent block
    currentBlock && ( // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    vnode.patchFlag > 0 || shapeFlag & 6
    /* COMPONENT */
    ) && // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    vnode.patchFlag !== 32
    /* HYDRATE_EVENTS */
    ) {
      currentBlock.push(vnode);
    }

    return vnode;
  }

  var createVNode = _createVNode;

  function _createVNode(type) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var patchFlag = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var dynamicProps = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var isBlockNode = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

    if (!type || type === NULL_DYNAMIC_COMPONENT) {
      type = Comment;
    }

    if (isVNode(type)) {
      // createVNode receiving an existing vnode. This happens in cases like
      // <component :is="vnode"/>
      // #2078 make sure to merge refs during the clone instead of overwriting it
      var cloned = cloneVNode(type, props, true
      /* mergeRef: true */
      );

      if (children) {
        normalizeChildren(cloned, children);
      }

      return cloned;
    } // class component normalization.


    if (isClassComponent(type)) {
      type = type.__vccOpts;
    } // class & style normalization.


    if (props) {
      // for reactive or proxy objects, we need to clone it to enable mutation.
      props = guardReactiveProps(props);
      var {
        class: klass,
        style
      } = props;

      if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
      }

      if (isObject(style)) {
        // reactive state objects need to be cloned since they are likely to be
        // mutated
        if (isProxy(style) && !isArray(style)) {
          style = extend({}, style);
        }

        props.style = normalizeStyle(style);
      }
    } // encode the vnode type information into a bitmap


    var shapeFlag = isString(type) ? 1
    /* ELEMENT */
    : isSuspense(type) ? 128
    /* SUSPENSE */
    : isTeleport(type) ? 64
    /* TELEPORT */
    : isObject(type) ? 4
    /* STATEFUL_COMPONENT */
    : isFunction(type) ? 2
    /* FUNCTIONAL_COMPONENT */
    : 0;
    return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
  }

  function guardReactiveProps(props) {
    if (!props) return null;
    return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
  }

  function cloneVNode(vnode, extraProps) {
    var mergeRef = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    // This is intentionally NOT using spread or extend to avoid the runtime
    // key enumeration cost.
    var {
      props,
      ref,
      patchFlag,
      children
    } = vnode;
    var mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
    var cloned = {
      __v_isVNode: true,
      __v_skip: true,
      type: vnode.type,
      props: mergedProps,
      key: mergedProps && normalizeKey(mergedProps),
      ref: extraProps && extraProps.ref ? // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref ? isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
      scopeId: vnode.scopeId,
      slotScopeIds: vnode.slotScopeIds,
      children: children,
      target: vnode.target,
      targetAnchor: vnode.targetAnchor,
      staticCount: vnode.staticCount,
      shapeFlag: vnode.shapeFlag,
      // if the vnode is cloned with extra props, we can no longer assume its
      // existing patch flag to be reliable and need to add the FULL_PROPS flag.
      // note: perserve flag for fragments since they use the flag for children
      // fast paths only.
      patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 // hoisted node
      ? 16
      /* FULL_PROPS */
      : patchFlag | 16
      /* FULL_PROPS */
      : patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition: vnode.transition,
      // These should technically only be non-null on mounted VNodes. However,
      // they *should* be copied for kept-alive vnodes. So we just always copy
      // them since them being non-null during a mount doesn't affect the logic as
      // they will simply be overwritten.
      component: vnode.component,
      suspense: vnode.suspense,
      ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
      ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
      el: vnode.el,
      anchor: vnode.anchor
    };
    return cloned;
  }
  /**
   * @private
   */


  function createTextVNode() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ' ';
    var flag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return createVNode(Text, null, text, flag);
  }
  /**
   * @private
   */


  function createStaticVNode(content, numberOfNodes) {
    // A static vnode can contain multiple stringified elements, and the number
    // of elements is necessary for hydration.
    var vnode = createVNode(Static, null, content);
    vnode.staticCount = numberOfNodes;
    return vnode;
  }
  /**
   * @private
   */


  function createCommentVNode() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var asBlock = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
  }

  function normalizeVNode(child) {
    if (child == null || typeof child === 'boolean') {
      // empty placeholder
      return createVNode(Comment);
    } else if (isArray(child)) {
      // fragment
      return createVNode(Fragment, null, // #3666, avoid reference pollution when reusing vnode
      child.slice());
    } else if (typeof child === 'object') {
      // already vnode, this should be the most common since compiled templates
      // always produce all-vnode children arrays
      return cloneIfMounted(child);
    } else {
      // strings and numbers
      return createVNode(Text, null, String(child));
    }
  } // optimized normalization for template-compiled render fns


  function cloneIfMounted(child) {
    return child.el === null || child.memo ? child : cloneVNode(child);
  }

  function normalizeChildren(vnode, children) {
    var type = 0;
    var {
      shapeFlag
    } = vnode;

    if (children == null) {
      children = null;
    } else if (isArray(children)) {
      type = 16
      /* ARRAY_CHILDREN */
      ;
    } else if (typeof children === 'object') {
      if (shapeFlag & (1
      /* ELEMENT */
      | 64
      /* TELEPORT */
      )) {
        // Normalize slot to plain children for plain element and Teleport
        var slot = children.default;

        if (slot) {
          // _c marker is added by withCtx() indicating this is a compiled slot
          slot._c && (slot._d = false);
          normalizeChildren(vnode, slot());
          slot._c && (slot._d = true);
        }

        return;
      } else {
        type = 32
        /* SLOTS_CHILDREN */
        ;
        var slotFlag = children._;

        if (!slotFlag && !(InternalObjectKey in children)) {
          children._ctx = currentRenderingInstance;
        } else if (slotFlag === 3
        /* FORWARDED */
        && currentRenderingInstance) {
          // a child component receives forwarded slots from the parent.
          // its slot type is determined by its parent's slot type.
          if (currentRenderingInstance.slots._ === 1
          /* STABLE */
          ) {
            children._ = 1
            /* STABLE */
            ;
          } else {
            children._ = 2
            /* DYNAMIC */
            ;
            vnode.patchFlag |= 1024
            /* DYNAMIC_SLOTS */
            ;
          }
        }
      }
    } else if (isFunction(children)) {
      children = {
        default: children,
        _ctx: currentRenderingInstance
      };
      type = 32
      /* SLOTS_CHILDREN */
      ;
    } else {
      children = String(children); // force teleport children to array so it can be moved around

      if (shapeFlag & 64
      /* TELEPORT */
      ) {
        type = 16
        /* ARRAY_CHILDREN */
        ;
        children = [createTextVNode(children)];
      } else {
        type = 8
        /* TEXT_CHILDREN */
        ;
      }
    }

    vnode.children = children;
    vnode.shapeFlag |= type;
  }

  function mergeProps() {
    var ret = {};

    for (var i = 0; i < arguments.length; i++) {
      var toMerge = i < 0 || arguments.length <= i ? undefined : arguments[i];

      for (var key in toMerge) {
        if (key === 'class') {
          if (ret.class !== toMerge.class) {
            ret.class = normalizeClass([ret.class, toMerge.class]);
          }
        } else if (key === 'style') {
          ret.style = normalizeStyle([ret.style, toMerge.style]);
        } else if (isOn(key)) {
          var existing = ret[key];
          var incoming = toMerge[key];

          if (existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
            ret[key] = existing ? [].concat(existing, incoming) : incoming;
          }
        } else if (key !== '') {
          ret[key] = toMerge[key];
        }
      }
    }

    return ret;
  }
  /**
   * Actual implementation
   */


  function renderList(source, renderItem, cache, index) {
    var ret;
    var cached = cache && cache[index];

    if (isArray(source) || isString(source)) {
      ret = new Array(source.length);

      for (var i = 0, l = source.length; i < l; i++) {
        ret[i] = renderItem(source[i], i, undefined, cached && cached[i]);
      }
    } else if (typeof source === 'number') {
      ret = new Array(source);

      for (var _i2 = 0; _i2 < source; _i2++) {
        ret[_i2] = renderItem(_i2 + 1, _i2, undefined, cached && cached[_i2]);
      }
    } else if (isObject(source)) {
      if (source[Symbol.iterator]) {
        ret = Array.from(source, (item, i) => renderItem(item, i, undefined, cached && cached[i]));
      } else {
        var keys = Object.keys(source);
        ret = new Array(keys.length);

        for (var _i3 = 0, _l = keys.length; _i3 < _l; _i3++) {
          var key = keys[_i3];
          ret[_i3] = renderItem(source[key], key, _i3, cached && cached[_i3]);
        }
      }
    } else {
      ret = [];
    }

    if (cache) {
      cache[index] = ret;
    }

    return ret;
  }
  /**
   * Compiler runtime helper for creating dynamic slots object
   * @private
   */


  function createSlots(slots, dynamicSlots) {
    for (var i = 0; i < dynamicSlots.length; i++) {
      var slot = dynamicSlots[i]; // array of dynamic slot generated by <template v-for="..." #[...]>

      if (isArray(slot)) {
        for (var j = 0; j < slot.length; j++) {
          slots[slot[j].name] = slot[j].fn;
        }
      } else if (slot) {
        // conditional single slot generated by <template v-if="..." #foo>
        slots[slot.name] = slot.fn;
      }
    }

    return slots;
  }
  /**
   * Compiler runtime helper for rendering `<slot/>`
   * @private
   */


  function renderSlot(slots, name) {
    var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var // this is not a user-facing function, so the fallback is always generated by
    // the compiler and guaranteed to be a function returning an array
    fallback = arguments.length > 3 ? arguments[3] : undefined;
    var noSlotted = arguments.length > 4 ? arguments[4] : undefined;

    if (currentRenderingInstance.isCE) {
      return createVNode('slot', name === 'default' ? null : {
        name
      }, fallback && fallback());
    }

    var slot = slots[name]; // a compiled slot disables block tracking by default to avoid manual
    // invocation interfering with template-based block tracking, but in
    // `renderSlot` we can be sure that it's template-based so we can force
    // enable it.

    if (slot && slot._c) {
      slot._d = false;
    }

    openBlock();
    var validSlotContent = slot && ensureValidVNode(slot(props));
    var rendered = createBlock(Fragment, {
      key: props.key || "_".concat(name)
    }, validSlotContent || (fallback ? fallback() : []), validSlotContent && slots._ === 1
    /* STABLE */
    ? 64
    /* STABLE_FRAGMENT */
    : -2
    /* BAIL */
    );

    if (!noSlotted && rendered.scopeId) {
      rendered.slotScopeIds = [rendered.scopeId + '-s'];
    }

    if (slot && slot._c) {
      slot._d = true;
    }

    return rendered;
  }

  function ensureValidVNode(vnodes) {
    return vnodes.some(child => {
      if (!isVNode(child)) return true;
      if (child.type === Comment) return false;
      if (child.type === Fragment && !ensureValidVNode(child.children)) return false;
      return true;
    }) ? vnodes : null;
  }
  /**
   * For prefixing keys in v-on="obj" with "on"
   * @private
   */


  function toHandlers(obj) {
    var ret = {};

    for (var key in obj) {
      ret[toHandlerKey(key)] = obj[key];
    }

    return ret;
  }
  /**
   * #2437 In Vue 3, functional components do not have a public instance proxy but
   * they exist in the internal parent chain. For code that relies on traversing
   * public $parent chains, skip functional ones and go to the parent instead.
   */


  var getPublicInstance = i => {
    if (!i) return null;
    if (isStatefulComponent(i)) return getExposeProxy(i) || i.proxy;
    return getPublicInstance(i.parent);
  };

  var publicPropertiesMap = extend(Object.create(null), {
    $: i => i,
    $el: i => i.vnode.el,
    $data: i => i.data,
    $props: i => i.props,
    $attrs: i => i.attrs,
    $slots: i => i.slots,
    $refs: i => i.refs,
    $parent: i => getPublicInstance(i.parent),
    $root: i => getPublicInstance(i.root),
    $emit: i => i.emit,
    $options: i => __VUE_OPTIONS_API__ ? resolveMergedOptions(i) : i.type,
    $forceUpdate: i => () => queueJob(i.update),
    $nextTick: i => nextTick.bind(i.proxy),
    $watch: i => __VUE_OPTIONS_API__ ? instanceWatch.bind(i) : NOOP
  });
  var PublicInstanceProxyHandlers = {
    get(_ref17, key) {
      var {
        _: instance
      } = _ref17;
      var {
        ctx,
        setupState,
        data,
        props,
        accessCache,
        type,
        appContext
      } = instance; // data / props / ctx
      // This getter gets called for every property access on the render context
      // during render and is a major hotspot. The most expensive part of this
      // is the multiple hasOwn() calls. It's much faster to do a simple property
      // access on a plain object, so we use an accessCache object (with null
      // prototype) to memoize what access type a key corresponds to.

      var normalizedProps;

      if (key[0] !== '$') {
        var n = accessCache[key];

        if (n !== undefined) {
          switch (n) {
            case 1
            /* SETUP */
            :
              return setupState[key];

            case 2
            /* DATA */
            :
              return data[key];

            case 4
            /* CONTEXT */
            :
              return ctx[key];

            case 3
            /* PROPS */
            :
              return props[key];
            // default: just fallthrough
          }
        } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
          accessCache[key] = 1
          /* SETUP */
          ;
          return setupState[key];
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          accessCache[key] = 2
          /* DATA */
          ;
          return data[key];
        } else if ( // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)) {
          accessCache[key] = 3
          /* PROPS */
          ;
          return props[key];
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4
          /* CONTEXT */
          ;
          return ctx[key];
        } else if (!__VUE_OPTIONS_API__ || shouldCacheAccess) {
          accessCache[key] = 0
          /* OTHER */
          ;
        }
      }

      var publicGetter = publicPropertiesMap[key];
      var cssModule, globalProperties; // public $xxx properties

      if (publicGetter) {
        if (key === '$attrs') {
          track(instance, "get"
          /* GET */
          , key);
        }

        return publicGetter(instance);
      } else if ( // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        // user may set custom properties to `this` that start with `$`
        accessCache[key] = 4
        /* CONTEXT */
        ;
        return ctx[key];
      } else if ( // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
        {
          return globalProperties[key];
        }
      } else ;
    },

    set(_ref18, key, value) {
      var {
        _: instance
      } = _ref18;
      var {
        data,
        setupState,
        ctx
      } = instance;

      if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        setupState[key] = value;
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        data[key] = value;
      } else if (hasOwn(instance.props, key)) {
        return false;
      }

      if (key[0] === '$' && key.slice(1) in instance) {
        return false;
      } else {
        {
          ctx[key] = value;
        }
      }

      return true;
    },

    has(_ref19, key) {
      var {
        _: {
          data,
          setupState,
          accessCache,
          ctx,
          appContext,
          propsOptions
        }
      } = _ref19;
      var normalizedProps;
      return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
    }

  };
  var RuntimeCompiledPublicInstanceProxyHandlers = /*#__PURE__*/extend({}, PublicInstanceProxyHandlers, {
    get(target, key) {
      // fast path for unscopables when using `with` block
      if (key === Symbol.unscopables) {
        return;
      }

      return PublicInstanceProxyHandlers.get(target, key, target);
    },

    has(_, key) {
      var has = key[0] !== '_' && !isGloballyWhitelisted(key);
      return has;
    }

  });
  var emptyAppContext = createAppContext();
  var uid$1 = 0;

  function createComponentInstance(vnode, parent, suspense) {
    var type = vnode.type; // inherit parent app context - or - if root, adopt from root vnode

    var appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    var instance = {
      uid: uid$1++,
      vnode,
      type,
      parent,
      appContext,
      root: null,
      next: null,
      subTree: null,
      update: null,
      scope: new EffectScope(true
      /* detached */
      ),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      accessCache: null,
      renderCache: [],
      // local resovled assets
      components: null,
      directives: null,
      // resolved props and emits options
      propsOptions: normalizePropsOptions(type, appContext),
      emitsOptions: normalizeEmitsOptions(type, appContext),
      // emit
      emit: null,
      emitted: null,
      // props default value
      propsDefaults: EMPTY_OBJ,
      // inheritAttrs
      inheritAttrs: type.inheritAttrs,
      // state
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      // suspense related
      suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: false,
      // lifecycle hooks
      // not using enums here because it results in computed properties
      isMounted: false,
      isUnmounted: false,
      isDeactivated: false,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    };
    {
      instance.ctx = {
        _: instance
      };
    }
    instance.root = parent ? parent.root : instance;
    instance.emit = emit$1.bind(null, instance); // apply custom element special handling

    if (vnode.ce) {
      vnode.ce(instance);
    }

    return instance;
  }

  var currentInstance = null;

  var getCurrentInstance = () => currentInstance || currentRenderingInstance;

  var setCurrentInstance = instance => {
    currentInstance = instance;
    instance.scope.on();
  };

  var unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off();
    currentInstance = null;
  };

  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4
    /* STATEFUL_COMPONENT */
    ;
  }

  var isInSSRComponentSetup = false;

  function setupComponent(instance) {
    var isSSR = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    isInSSRComponentSetup = isSSR;
    var {
      props,
      children
    } = instance.vnode;
    var isStateful = isStatefulComponent(instance);
    initProps(instance, props, isStateful, isSSR);
    initSlots(instance, children);
    var setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : undefined;
    isInSSRComponentSetup = false;
    return setupResult;
  }

  function setupStatefulComponent(instance, isSSR) {
    var Component = instance.type; // 0. create render proxy property access cache

    instance.accessCache = Object.create(null); // 1. create public instance / render proxy
    // also mark it raw so it's never observed

    instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers)); // 2. call setup()

    var {
      setup
    } = Component;

    if (setup) {
      var setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
      setCurrentInstance(instance);
      pauseTracking();
      var setupResult = callWithErrorHandling(setup, instance, 0
      /* SETUP_FUNCTION */
      , [instance.props, setupContext]);
      resetTracking();
      unsetCurrentInstance();

      if (isPromise(setupResult)) {
        setupResult.then(unsetCurrentInstance, unsetCurrentInstance);

        if (isSSR) {
          // return the promise so server-renderer can wait on it
          return setupResult.then(resolvedResult => {
            handleSetupResult(instance, resolvedResult, isSSR);
          }).catch(e => {
            handleError(e, instance, 0
            /* SETUP_FUNCTION */
            );
          });
        } else {
          // async setup returned Promise.
          // bail here and wait for re-entry.
          instance.asyncDep = setupResult;
        }
      } else {
        handleSetupResult(instance, setupResult, isSSR);
      }
    } else {
      finishComponentSetup(instance, isSSR);
    }
  }

  function handleSetupResult(instance, setupResult, isSSR) {
    if (isFunction(setupResult)) {
      // setup returned an inline render function
      if (instance.type.__ssrInlineRender) {
        // when the function's name is `ssrRender` (compiled by SFC inline mode),
        // set it as ssrRender instead.
        instance.ssrRender = setupResult;
      } else {
        instance.render = setupResult;
      }
    } else if (isObject(setupResult)) {
      // setup returned bindings.
      // assuming a render function compiled from template is present.
      if (__VUE_PROD_DEVTOOLS__) {
        instance.devtoolsRawSetupState = setupResult;
      }

      instance.setupState = proxyRefs(setupResult);
    } else ;

    finishComponentSetup(instance, isSSR);
  }

  var compile;
  var installWithProxy;
  /**
   * For runtime-dom to register the compiler.
   * Note the exported method uses any to avoid d.ts relying on the compiler types.
   */

  function registerRuntimeCompiler(_compile) {
    compile = _compile;

    installWithProxy = i => {
      if (i.render._rc) {
        i.withProxy = new Proxy(i.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
      }
    };
  } // dev only


  var isRuntimeOnly = () => !compile;

  function finishComponentSetup(instance, isSSR, skipOptions) {
    var Component = instance.type; // template / render function normalization
    // could be already set when returned from setup()

    if (!instance.render) {
      // only do on-the-fly compile if not in SSR - SSR on-the-fly compliation
      // is done by server-renderer
      if (!isSSR && compile && !Component.render) {
        var template = Component.template;

        if (template) {
          var {
            isCustomElement,
            compilerOptions
          } = instance.appContext.config;
          var {
            delimiters,
            compilerOptions: componentCompilerOptions
          } = Component;
          var finalCompilerOptions = extend(extend({
            isCustomElement,
            delimiters
          }, compilerOptions), componentCompilerOptions);
          Component.render = compile(template, finalCompilerOptions);
        }
      }

      instance.render = Component.render || NOOP; // for runtime-compiled render functions using `with` blocks, the render
      // proxy used needs a different `has` handler which is more performant and
      // also only allows a whitelist of globals to fallthrough.

      if (installWithProxy) {
        installWithProxy(instance);
      }
    } // support for 2.x options


    if (__VUE_OPTIONS_API__ && !false) {
      setCurrentInstance(instance);
      pauseTracking();
      applyOptions(instance);
      resetTracking();
      unsetCurrentInstance();
    }
  }

  function createAttrsProxy(instance) {
    return new Proxy(instance.attrs, {
      get(target, key) {
        track(instance, "get"
        /* GET */
        , '$attrs');
        return target[key];
      }

    });
  }

  function createSetupContext(instance) {
    var expose = exposed => {
      instance.exposed = exposed || {};
    };

    var attrs;
    {
      return {
        get attrs() {
          return attrs || (attrs = createAttrsProxy(instance));
        },

        slots: instance.slots,
        emit: instance.emit,
        expose
      };
    }
  }

  function getExposeProxy(instance) {
    if (instance.exposed) {
      return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key) {
          if (key in target) {
            return target[key];
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
          }
        }

      }));
    }
  }

  var classifyRE = /(?:^|[-_])(\w)/g;

  var classify = str => str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '');

  function getComponentName(Component) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name;
  }
  /* istanbul ignore next */


  function formatComponentName(instance, Component) {
    var isRoot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var name = getComponentName(Component);

    if (!name && Component.__file) {
      var match = Component.__file.match(/([^/\\]+)\.\w+$/);

      if (match) {
        name = match[1];
      }
    }

    if (!name && instance && instance.parent) {
      // try to infer the name based on reverse resolution
      var inferFromRegistry = registry => {
        for (var key in registry) {
          if (registry[key] === Component) {
            return key;
          }
        }
      };

      name = inferFromRegistry(instance.components || instance.parent.type.components) || inferFromRegistry(instance.appContext.components);
    }

    return name ? classify(name) : isRoot ? "App" : "Anonymous";
  }

  function isClassComponent(value) {
    return isFunction(value) && '__vccOpts' in value;
  }

  var stack = [];

  function warn$1(msg) {
    // avoid props formatting or warn handler tracking deps that might be mutated
    // during patch, leading to infinite recursion.
    pauseTracking();
    var instance = stack.length ? stack[stack.length - 1].component : null;
    var appWarnHandler = instance && instance.appContext.config.warnHandler;
    var trace = getComponentTrace();

    for (var _len7 = arguments.length, args = new Array(_len7 > 1 ? _len7 - 1 : 0), _key14 = 1; _key14 < _len7; _key14++) {
      args[_key14 - 1] = arguments[_key14];
    }

    if (appWarnHandler) {
      callWithErrorHandling(appWarnHandler, instance, 11
      /* APP_WARN_HANDLER */
      , [msg + args.join(''), instance && instance.proxy, trace.map(_ref20 => {
        var {
          vnode
        } = _ref20;
        return "at <".concat(formatComponentName(instance, vnode.type), ">");
      }).join('\n'), trace]);
    } else {
      var warnArgs = ["[Vue warn]: ".concat(msg), ...args];
      /* istanbul ignore if */

      if (trace.length && // avoid spamming console during tests
      !false) {
        warnArgs.push("\n", ...formatTrace(trace));
      }

      console.warn(...warnArgs);
    }

    resetTracking();
  }

  function getComponentTrace() {
    var currentVNode = stack[stack.length - 1];

    if (!currentVNode) {
      return [];
    } // we can't just use the stack because it will be incomplete during updates
    // that did not start from the root. Re-construct the parent chain using
    // instance parent pointers.


    var normalizedStack = [];

    while (currentVNode) {
      var last = normalizedStack[0];

      if (last && last.vnode === currentVNode) {
        last.recurseCount++;
      } else {
        normalizedStack.push({
          vnode: currentVNode,
          recurseCount: 0
        });
      }

      var parentInstance = currentVNode.component && currentVNode.component.parent;
      currentVNode = parentInstance && parentInstance.vnode;
    }

    return normalizedStack;
  }
  /* istanbul ignore next */


  function formatTrace(trace) {
    var logs = [];
    trace.forEach((entry, i) => {
      logs.push(...(i === 0 ? [] : ["\n"]), ...formatTraceEntry(entry));
    });
    return logs;
  }

  function formatTraceEntry(_ref21) {
    var {
      vnode,
      recurseCount
    } = _ref21;
    var postfix = recurseCount > 0 ? "... (".concat(recurseCount, " recursive calls)") : "";
    var isRoot = vnode.component ? vnode.component.parent == null : false;
    var open = " at <".concat(formatComponentName(vnode.component, vnode.type, isRoot));
    var close = ">" + postfix;
    return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
  }
  /* istanbul ignore next */


  function formatProps(props) {
    var res = [];
    var keys = Object.keys(props);
    keys.slice(0, 3).forEach(key => {
      res.push(...formatProp(key, props[key]));
    });

    if (keys.length > 3) {
      res.push(" ...");
    }

    return res;
  }
  /* istanbul ignore next */


  function formatProp(key, value, raw) {
    if (isString(value)) {
      value = JSON.stringify(value);
      return raw ? value : ["".concat(key, "=").concat(value)];
    } else if (typeof value === 'number' || typeof value === 'boolean' || value == null) {
      return raw ? value : ["".concat(key, "=").concat(value)];
    } else if (isRef(value)) {
      value = formatProp(key, toRaw(value.value), true);
      return raw ? value : ["".concat(key, "=Ref<"), value, ">"];
    } else if (isFunction(value)) {
      return ["".concat(key, "=fn").concat(value.name ? "<".concat(value.name, ">") : "")];
    } else {
      value = toRaw(value);
      return raw ? value : ["".concat(key, "="), value];
    }
  }

  function callWithErrorHandling(fn, instance, type, args) {
    var res;

    try {
      res = args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, instance, type);
    }

    return res;
  }

  function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunction(fn)) {
      var res = callWithErrorHandling(fn, instance, type, args);

      if (res && isPromise(res)) {
        res.catch(err => {
          handleError(err, instance, type);
        });
      }

      return res;
    }

    var values = [];

    for (var i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }

    return values;
  }

  function handleError(err, instance, type) {
    var throwInDev = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var contextVNode = instance ? instance.vnode : null;

    if (instance) {
      var cur = instance.parent; // the exposed instance is the render proxy to keep it consistent with 2.x

      var exposedInstance = instance.proxy; // in production the hook receives only the error code
      // fixed by xxxxxx

      var errorInfo = type;

      while (cur) {
        var errorCapturedHooks = cur.ec;

        if (errorCapturedHooks) {
          for (var i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }

        cur = cur.parent;
      } // app-level handling


      var appErrorHandler = instance.appContext.config.errorHandler;

      if (appErrorHandler) {
        callWithErrorHandling(appErrorHandler, null, 10
        /* APP_ERROR_HANDLER */
        , [err, exposedInstance, errorInfo]);
        return;
      }
    }

    logError(err, type, contextVNode, throwInDev);
  }

  function logError(err, type, contextVNode) {
    var throwInDev = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    {
      // recover in prod to reduce the impact on end-user
      console.error(err);
    }
  }

  var isFlushing = false;
  var isFlushPending = false;
  var queue = [];
  var flushIndex = 0;
  var pendingPreFlushCbs = [];
  var activePreFlushCbs = null;
  var preFlushIndex = 0;
  var pendingPostFlushCbs = [];
  var activePostFlushCbs = null;
  var postFlushIndex = 0;
  var resolvedPromise = Promise.resolve();
  var currentFlushPromise = null;
  var currentPreFlushParentJob = null;

  function nextTick(fn) {
    var p = currentFlushPromise || resolvedPromise;
    return fn ? p.then(this ? fn.bind(this) : fn) : p;
  } // #2768
  // Use binary-search to find a suitable position in the queue,
  // so that the queue maintains the increasing order of job's id,
  // which can prevent the job from being skipped and also can avoid repeated patching.


  function findInsertionIndex(id) {
    // the start index should be `flushIndex + 1`
    var start = flushIndex + 1;
    var end = queue.length;

    while (start < end) {
      var middle = start + end >>> 1;
      var middleJobId = getId(queue[middle]);
      middleJobId < id ? start = middle + 1 : end = middle;
    }

    return start;
  }

  function queueJob(job) {
    // the dedupe search uses the startIndex argument of Array.includes()
    // by default the search index includes the current job that is being run
    // so it cannot recursively trigger itself again.
    // if the job is a watch() callback, the search will start with a +1 index to
    // allow it recursively trigger itself - it is the user's responsibility to
    // ensure it doesn't end up in an infinite loop.
    if ((!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) && job !== currentPreFlushParentJob) {
      if (job.id == null) {
        queue.push(job);
      } else {
        queue.splice(findInsertionIndex(job.id), 0, job);
      }

      queueFlush();
    }
  }

  function queueFlush() {
    if (!isFlushing && !isFlushPending) {
      isFlushPending = true;
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }

  function invalidateJob(job) {
    var i = queue.indexOf(job);

    if (i > flushIndex) {
      queue.splice(i, 1);
    }
  }

  function queueCb(cb, activeQueue, pendingQueue, index) {
    if (!isArray(cb)) {
      if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index + 1 : index)) {
        pendingQueue.push(cb);
      }
    } else {
      // if cb is an array, it is a component lifecycle hook which can only be
      // triggered by a job, which is already deduped in the main queue, so
      // we can skip duplicate check here to improve perf
      pendingQueue.push(...cb);
    }

    queueFlush();
  }

  function queuePreFlushCb(cb) {
    queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
  }

  function queuePostFlushCb(cb) {
    queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
  }

  function flushPreFlushCbs(seen) {
    var parentJob = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (pendingPreFlushCbs.length) {
      currentPreFlushParentJob = parentJob;
      activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
      pendingPreFlushCbs.length = 0;

      for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
        activePreFlushCbs[preFlushIndex]();
      }

      activePreFlushCbs = null;
      preFlushIndex = 0;
      currentPreFlushParentJob = null; // recursively flush until it drains

      flushPreFlushCbs(seen, parentJob);
    }
  }

  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      var deduped = [...new Set(pendingPostFlushCbs)];
      pendingPostFlushCbs.length = 0; // #1947 already has active queue, nested flushPostFlushCbs call

      if (activePostFlushCbs) {
        activePostFlushCbs.push(...deduped);
        return;
      }

      activePostFlushCbs = deduped;
      activePostFlushCbs.sort((a, b) => getId(a) - getId(b));

      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        activePostFlushCbs[postFlushIndex]();
      }

      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }

  var getId = job => job.id == null ? Infinity : job.id;

  function flushJobs(seen) {
    isFlushPending = false;
    isFlushing = true;
    flushPreFlushCbs(seen); // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child so its render effect will have smaller
    //    priority number)
    // 2. If a component is unmounted during a parent component's update,
    //    its update can be skipped.

    queue.sort((a, b) => getId(a) - getId(b)); // conditional usage of checkRecursiveUpdate must be determined out of
    // try ... catch block since Rollup by default de-optimizes treeshaking
    // inside try-catch. This can leave all warning code unshaked. Although
    // they would get eventually shaken by a minifier like terser, some minifiers
    // would fail to do that (e.g. https://github.com/evanw/esbuild/issues/1610)

    var check = NOOP;

    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        var job = queue[flushIndex];

        if (job && job.active !== false) {
          if ("production" !== 'production' && check(job)) ; // console.log(`running:`, job.id)

          callWithErrorHandling(job, null, 14
          /* SCHEDULER */
          );
        }
      }
    } finally {
      flushIndex = 0;
      queue.length = 0;
      flushPostFlushCbs();
      isFlushing = false;
      currentFlushPromise = null; // some postFlushCb queued jobs!
      // keep flushing until it drains.

      if (queue.length || pendingPreFlushCbs.length || pendingPostFlushCbs.length) {
        flushJobs(seen);
      }
    }
  } // Simple effect.


  function watchEffect(effect, options) {
    return doWatch(effect, null, options);
  }

  function watchPostEffect(effect, options) {
    return doWatch(effect, null, {
      flush: 'post'
    });
  }

  function watchSyncEffect(effect, options) {
    return doWatch(effect, null, {
      flush: 'sync'
    });
  } // initial value for watchers to trigger on undefined initial values


  var INITIAL_WATCHER_VALUE = {}; // implementation

  function watch(source, cb, options) {
    return doWatch(source, cb, options);
  }

  function doWatch(source, cb) {
    var {
      immediate,
      deep,
      flush,
      onTrack,
      onTrigger
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EMPTY_OBJ;
    var instance = currentInstance;
    var getter;
    var forceTrigger = false;
    var isMultiSource = false;

    if (isRef(source)) {
      getter = () => source.value;

      forceTrigger = !!source._shallow;
    } else if (isReactive(source)) {
      getter = () => source;

      deep = true;
    } else if (isArray(source)) {
      isMultiSource = true;
      forceTrigger = source.some(isReactive);

      getter = () => source.map(s => {
        if (isRef(s)) {
          return s.value;
        } else if (isReactive(s)) {
          return traverse(s);
        } else if (isFunction(s)) {
          return callWithErrorHandling(s, instance, 2
          /* WATCH_GETTER */
          );
        } else ;
      });
    } else if (isFunction(source)) {
      if (cb) {
        // getter with cb
        getter = () => callWithErrorHandling(source, instance, 2
        /* WATCH_GETTER */
        );
      } else {
        // no cb -> simple effect
        getter = () => {
          if (instance && instance.isUnmounted) {
            return;
          }

          if (cleanup) {
            cleanup();
          }

          return callWithAsyncErrorHandling(source, instance, 3
          /* WATCH_CALLBACK */
          , [onInvalidate]);
        };
      }
    } else {
      getter = NOOP;
    }

    if (cb && deep) {
      var baseGetter = getter;

      getter = () => traverse(baseGetter());
    }

    var cleanup;

    var onInvalidate = fn => {
      cleanup = effect.onStop = () => {
        callWithErrorHandling(fn, instance, 4
        /* WATCH_CLEANUP */
        );
      };
    }; // in SSR there is no need to setup an actual effect, and it should be noop
    // unless it's eager


    if (isInSSRComponentSetup) {
      // we will also not call the invalidate callback (+ runner is not set up)
      onInvalidate = NOOP;

      if (!cb) {
        getter();
      } else if (immediate) {
        callWithAsyncErrorHandling(cb, instance, 3
        /* WATCH_CALLBACK */
        , [getter(), isMultiSource ? [] : undefined, onInvalidate]);
      }

      return NOOP;
    }

    var oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;

    var job = () => {
      if (!effect.active) {
        return;
      }

      if (cb) {
        // watch(source, cb)
        var newValue = effect.run();

        if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
          // cleanup before running cb again
          if (cleanup) {
            cleanup();
          }

          callWithAsyncErrorHandling(cb, instance, 3
          /* WATCH_CALLBACK */
          , [newValue, // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue, onInvalidate]);
          oldValue = newValue;
        }
      } else {
        // watchEffect
        effect.run();
      }
    }; // important: mark the job as a watcher callback so that scheduler knows
    // it is allowed to self-trigger (#1727)


    job.allowRecurse = !!cb;
    var scheduler;

    if (flush === 'sync') {
      scheduler = job; // the scheduler function gets called directly
    } else if (flush === 'post') {
      scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
    } else {
      // default: 'pre'
      scheduler = () => {
        if (!instance || instance.isMounted) {
          queuePreFlushCb(job);
        } else {
          // with 'pre' option, the first call must happen before
          // the component is mounted so it is called synchronously.
          job();
        }
      };
    }

    var effect = new ReactiveEffect(getter, scheduler); // initial run

    if (cb) {
      if (immediate) {
        job();
      } else {
        oldValue = effect.run();
      }
    } else if (flush === 'post') {
      queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
    } else {
      effect.run();
    }

    return () => {
      effect.stop();

      if (instance && instance.scope) {
        remove(instance.scope.effects, effect);
      }
    };
  } // this.$watch


  function instanceWatch(source, value, options) {
    var publicThis = this.proxy;
    var getter = isString(source) ? source.includes('.') ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
    var cb;

    if (isFunction(value)) {
      cb = value;
    } else {
      cb = value.handler;
      options = value;
    }

    var cur = currentInstance;
    setCurrentInstance(this);
    var res = doWatch(getter, cb.bind(publicThis), options);

    if (cur) {
      setCurrentInstance(cur);
    } else {
      unsetCurrentInstance();
    }

    return res;
  }

  function createPathGetter(ctx, path) {
    var segments = path.split('.');
    return () => {
      var cur = ctx;

      for (var i = 0; i < segments.length && cur; i++) {
        cur = cur[segments[i]];
      }

      return cur;
    };
  }

  function traverse(value, seen) {
    if (!isObject(value) || value["__v_skip"
    /* SKIP */
    ]) {
      return value;
    }

    seen = seen || new Set();

    if (seen.has(value)) {
      return value;
    }

    seen.add(value);

    if (isRef(value)) {
      traverse(value.value, seen);
    } else if (isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        traverse(value[i], seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach(v => {
        traverse(v, seen);
      });
    } else if (isPlainObject(value)) {
      for (var key in value) {
        traverse(value[key], seen);
      }
    }

    return value;
  } // implementation


  function defineProps() {
    return null;
  } // implementation


  function defineEmits() {
    return null;
  }
  /**
   * Vue `<script setup>` compiler macro for declaring a component's exposed
   * instance properties when it is accessed by a parent component via template
   * refs.
   *
   * `<script setup>` components are closed by default - i.e. varaibles inside
   * the `<script setup>` scope is not exposed to parent unless explicitly exposed
   * via `defineExpose`.
   *
   * This is only usable inside `<script setup>`, is compiled away in the
   * output and should **not** be actually called at runtime.
   */


  function defineExpose(exposed) {}
  /**
   * Vue `<script setup>` compiler macro for providing props default values when
   * using type-based `defineProps` declaration.
   *
   * Example usage:
   * ```ts
   * withDefaults(defineProps<{
   *   size?: number
   *   labels?: string[]
   * }>(), {
   *   size: 3,
   *   labels: () => ['default label']
   * })
   * ```
   *
   * This is only usable inside `<script setup>`, is compiled away in the output
   * and should **not** be actually called at runtime.
   */


  function withDefaults(props, defaults) {
    return null;
  }

  function useSlots() {
    return getContext().slots;
  }

  function useAttrs() {
    return getContext().attrs;
  }

  function getContext() {
    var i = getCurrentInstance();
    return i.setupContext || (i.setupContext = createSetupContext(i));
  }
  /**
   * Runtime helper for merging default declarations. Imported by compiled code
   * only.
   * @internal
   */


  function mergeDefaults(raw, defaults) {
    var props = isArray(raw) ? raw.reduce((normalized, p) => (normalized[p] = {}, normalized), {}) : raw;

    for (var key in defaults) {
      var opt = props[key];

      if (opt) {
        if (isArray(opt) || isFunction(opt)) {
          props[key] = {
            type: opt,
            default: defaults[key]
          };
        } else {
          opt.default = defaults[key];
        }
      } else if (opt === null) {
        props[key] = {
          default: defaults[key]
        };
      } else ;
    }

    return props;
  }
  /**
   * Used to create a proxy for the rest element when destructuring props with
   * defineProps().
   * @internal
   */


  function createPropsRestProxy(props, excludedKeys) {
    var ret = {};

    var _loop3 = function (key) {
      if (!excludedKeys.includes(key)) {
        Object.defineProperty(ret, key, {
          enumerable: true,
          get: () => props[key]
        });
      }
    };

    for (var key in props) {
      _loop3(key);
    }

    return ret;
  }
  /**
   * `<script setup>` helper for persisting the current instance context over
   * async/await flows.
   *
   * `@vue/compiler-sfc` converts the following:
   *
   * ```ts
   * const x = await foo()
   * ```
   *
   * into:
   *
   * ```ts
   * let __temp, __restore
   * const x = (([__temp, __restore] = withAsyncContext(() => foo())),__temp=await __temp,__restore(),__temp)
   * ```
   * @internal
   */


  function withAsyncContext(getAwaitable) {
    var ctx = getCurrentInstance();
    var awaitable = getAwaitable();
    unsetCurrentInstance();

    if (isPromise(awaitable)) {
      awaitable = awaitable.catch(e => {
        setCurrentInstance(ctx);
        throw e;
      });
    }

    return [awaitable, () => setCurrentInstance(ctx)];
  } // Actual implementation


  function h(type, propsOrChildren, children) {
    var l = arguments.length;

    if (l === 2) {
      if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
        // single vnode without props
        if (isVNode(propsOrChildren)) {
          return createVNode(type, null, [propsOrChildren]);
        } // props without children


        return createVNode(type, propsOrChildren);
      } else {
        // omit props
        return createVNode(type, null, propsOrChildren);
      }
    } else {
      if (l > 3) {
        children = Array.prototype.slice.call(arguments, 2);
      } else if (l === 3 && isVNode(children)) {
        children = [children];
      }

      return createVNode(type, propsOrChildren, children);
    }
  }

  var ssrContextKey = Symbol("");

  var useSSRContext = () => {
    {
      var ctx = inject(ssrContextKey);

      if (!ctx) {
        warn$1("Server rendering context not provided. Make sure to only call " + "useSSRContext() conditionally in the server build.");
      }

      return ctx;
    }
  };

  function initCustomFormatter() {
    /* eslint-disable no-restricted-globals */
    {
      return;
    }
  }

  function withMemo(memo, render, cache, index) {
    var cached = cache[index];

    if (cached && isMemoSame(cached, memo)) {
      return cached;
    }

    var ret = render(); // shallow clone

    ret.memo = memo.slice();
    return cache[index] = ret;
  }

  function isMemoSame(cached, memo) {
    var prev = cached.memo;

    if (prev.length != memo.length) {
      return false;
    }

    for (var i = 0; i < prev.length; i++) {
      if (prev[i] !== memo[i]) {
        return false;
      }
    } // make sure to let parent block track it when returning cached


    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(cached);
    }

    return true;
  } // Core API ------------------------------------------------------------------


  var version = "3.2.24";
  var _ssrUtils = {
    createComponentInstance,
    setupComponent,
    renderComponentRoot,
    setCurrentRenderingInstance,
    isVNode,
    normalizeVNode
  };
  /**
   * SSR utils for \@vue/server-renderer. Only exposed in cjs builds.
   * @internal
   */

  var ssrUtils = _ssrUtils;
  /**
   * @internal only exposed in compat builds
   */

  var resolveFilter = null;
  /**
   * @internal only exposed in compat builds.
   */

  var compatUtils = null;
  var nodeOps = {
    insert: (child, parent, anchor) => {
      if (!anchor) {
        return parent.appendChild(child);
      }

      return parent.insertBefore(child, anchor);
    },
    remove: child => {
      var parent = child.parentNode;

      if (parent) {
        parent.removeChild(child);
      }
    },
    createElement: tag => {
      return document.createElement(tag);
    },
    createText: text => new NVueTextNode(text),
    createComment: text => document.createComment(text),
    setText: (node, text) => {
      node.text = text;
    },
    setElementText: (el, text) => {
      if (el.parentNode) {
        el.parentNode.setAttr('value', text);
      }
    },
    parentNode: node => node.parentNode,
    nextSibling: node => node.nextSibling
  };

  var patchProp = function (el, key, prevValue, nextValue) {
    var isSVG = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var prevChildren = arguments.length > 5 ? arguments[5] : undefined;
    var parentComponent = arguments.length > 6 ? arguments[6] : undefined;
    var parentSuspense = arguments.length > 7 ? arguments[7] : undefined;
    var unmountChildren = arguments.length > 8 ? arguments[8] : undefined;
  };

  function useCssModule() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '$style';

    /* istanbul ignore else */
    {
      var instance = getCurrentInstance();

      if (!instance) {
        return EMPTY_OBJ;
      }

      var modules = instance.type.__cssModules;

      if (!modules) {
        return EMPTY_OBJ;
      }

      var mod = modules[name];

      if (!mod) {
        return EMPTY_OBJ;
      }

      return mod;
    }
  }
  /**
   * Runtime helper for SFC's CSS variable injection feature.
   * @private
   */


  function useCssVars(getter) {
    var instance = getCurrentInstance();
    /* istanbul ignore next */

    if (!instance) {
      return;
    }

    var setVars = () => setVarsOnVNode(instance.subTree, getter(instance.proxy));

    onMounted(() => watchEffect(setVars, {
      flush: 'post'
    }));
    onUpdated(setVars);
  }

  function setVarsOnVNode(vnode, vars) {
    if (vnode.shapeFlag & 128
    /* SUSPENSE */
    ) {
      var suspense = vnode.suspense;
      vnode = suspense.activeBranch;

      if (suspense.pendingBranch && !suspense.isHydrating) {
        suspense.effects.push(() => {
          setVarsOnVNode(suspense.activeBranch, vars);
        });
      }
    } // drill down HOCs until it's a non-component vnode


    while (vnode.component) {
      vnode = vnode.component.subTree;
    }

    if (vnode.shapeFlag & 1
    /* ELEMENT */
    && vnode.el) {
      var style = vnode.el.style;

      for (var key in vars) {
        style.setProperty("--".concat(key), vars[key]);
      }
    } else if (vnode.type === Fragment) {
      vnode.children.forEach(c => setVarsOnVNode(c, vars));
    }
  }

  function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
  }

  var getModelAssigner = vnode => {
    var fn = vnode.props['onUpdate:modelValue'];
    return isArray(fn) ? value => invokeArrayFns(fn, value) : fn;
  }; // We are exporting the v-model runtime directly as vnode hooks so that it can
  // be tree-shaken in case v-model is never used.


  var vModelText = {
    created(el, _ref22, vnode) {
      var {
        value,
        modifiers: {
          trim,
          number
        }
      } = _ref22;
      el.value = value == null ? '' : value;
      el._assign = getModelAssigner(vnode);
      addEventListener(el, 'input', e => {
        var domValue = e.detail.value; // 从 view 层接收到新值后，赋值给 service 层元素，注意，需要临时解除 pageNode，否则赋值 value 会触发向 view 层的再次同步数据

        var pageNode = el.pageNode;
        el.pageNode = null;
        el.value = domValue;
        el.pageNode = pageNode;

        if (trim) {
          domValue = domValue.trim();
        } else if (number) {
          domValue = toNumber(domValue);
        }

        el._assign(domValue);
      });
    },

    beforeUpdate(el, _ref23, vnode) {
      var {
        value
      } = _ref23;
      el._assign = getModelAssigner(vnode);
      var newValue = value == null ? '' : value;

      if (el.value !== newValue) {
        el.value = newValue;
      }
    }

  };
  var systemModifiers = ['ctrl', 'shift', 'alt', 'meta'];
  var modifierGuards = {
    stop: e => e.stopPropagation(),
    prevent: e => e.preventDefault(),
    self: e => e.target !== e.currentTarget,
    ctrl: e => !e.ctrlKey,
    shift: e => !e.shiftKey,
    alt: e => !e.altKey,
    meta: e => !e.metaKey,
    left: e => 'button' in e && e.button !== 0,
    middle: e => 'button' in e && e.button !== 1,
    right: e => 'button' in e && e.button !== 2,
    exact: (e, modifiers) => systemModifiers.some(m => e["".concat(m, "Key")] && !modifiers.includes(m))
  };
  /**
   * @private
   */

  var withModifiers = (fn, modifiers) => {
    // fixed by xxxxxx 补充 modifiers 标记，方便同步给 view 层
    var wrapper = function (event) {
      for (var i = 0; i < modifiers.length; i++) {
        var guard = modifierGuards[modifiers[i]];
        if (guard && guard(event, modifiers)) return;
      }

      for (var _len8 = arguments.length, args = new Array(_len8 > 1 ? _len8 - 1 : 0), _key15 = 1; _key15 < _len8; _key15++) {
        args[_key15 - 1] = arguments[_key15];
      }

      return fn(event, ...args);
    };

    wrapper.modifiers = modifiers;
    return wrapper;
  }; // Kept for 2.x compat.
  // Note: IE11 compat for `spacebar` and `del` is removed for now.


  var keyNames = {
    esc: 'escape',
    space: ' ',
    up: 'arrow-up',
    left: 'arrow-left',
    right: 'arrow-right',
    down: 'arrow-down',
    delete: 'backspace'
  };
  /**
   * @private
   */

  var withKeys = (fn, modifiers) => {
    return event => {
      if (!('key' in event)) {
        return;
      }

      var eventKey = hyphenate(event.key);

      if (modifiers.some(k => k === eventKey || keyNames[k] === eventKey)) {
        return fn(event);
      }
    };
  };

  var vShow = {
    beforeMount(el, _ref24) {
      var {
        value
      } = _ref24;
      setDisplay(el, value);
    },

    updated(el, _ref25) {
      var {
        value,
        oldValue
      } = _ref25;
      if (!value === !oldValue) return;
      setDisplay(el, value);
    },

    beforeUnmount(el, _ref26) {
      var {
        value
      } = _ref26;
      setDisplay(el, value);
    }

  };

  function setDisplay(el, value) {
    el.setAttribute('.vShow', !!value);
  }

  var rendererOptions = extend({
    patchProp
  }, nodeOps); // lazy create the renderer - this makes core renderer logic tree-shakable
  // in case the user only imports reactivity utilities from Vue.

  var renderer;

  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions));
  } // use explicit type casts here to avoid import() calls in rolled-up d.ts


  var render = function () {
    ensureRenderer().render(...arguments);
  };

  var createApp = function () {
    var app = ensureRenderer().createApp(...arguments);
    var {
      mount
    } = app;

    app.mount = container => {
      if (container !== '#root') return;
      return mount(container);
    };

    return app;
  };

  var Vue = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BaseTransition: BaseTransition,
    Comment: Comment,
    EffectScope: EffectScope,
    Fragment: Fragment,
    KeepAlive: KeepAlive,
    ReactiveEffect: ReactiveEffect,
    Static: Static,
    Suspense: Suspense,
    Teleport: Teleport,
    Text: Text,
    callWithAsyncErrorHandling: callWithAsyncErrorHandling,
    callWithErrorHandling: callWithErrorHandling,
    cloneVNode: cloneVNode,
    compatUtils: compatUtils,
    computed: computed,
    createApp: createApp,
    createBlock: createBlock,
    createCommentVNode: createCommentVNode,
    createElementBlock: createElementBlock,
    createElementVNode: createBaseVNode,
    createHydrationRenderer: createHydrationRenderer,
    createPropsRestProxy: createPropsRestProxy,
    createRenderer: createRenderer,
    createSlots: createSlots,
    createStaticVNode: createStaticVNode,
    createTextVNode: createTextVNode,
    createVNode: createVNode,
    customRef: customRef,
    defineAsyncComponent: defineAsyncComponent,
    defineComponent: defineComponent,
    defineEmits: defineEmits,
    defineExpose: defineExpose,
    defineProps: defineProps,

    get devtools() {
      return devtools;
    },

    effect: effect,
    effectScope: effectScope,
    getCurrentInstance: getCurrentInstance,
    getCurrentScope: getCurrentScope,
    getTransitionRawChildren: getTransitionRawChildren,
    guardReactiveProps: guardReactiveProps,
    h: h,
    handleError: handleError,
    initCustomFormatter: initCustomFormatter,
    inject: inject,
    injectHook: injectHook,

    get isInSSRComponentSetup() {
      return isInSSRComponentSetup;
    },

    isMemoSame: isMemoSame,
    isProxy: isProxy,
    isReactive: isReactive,
    isReadonly: isReadonly,
    isRef: isRef,
    isRuntimeOnly: isRuntimeOnly,
    isVNode: isVNode,
    markRaw: markRaw,
    mergeDefaults: mergeDefaults,
    mergeProps: mergeProps,
    nextTick: nextTick,
    onActivated: onActivated,
    onBeforeMount: onBeforeMount,
    onBeforeUnmount: onBeforeUnmount,
    onBeforeUpdate: onBeforeUpdate,
    onDeactivated: onDeactivated,
    onErrorCaptured: onErrorCaptured,
    onMounted: onMounted,
    onRenderTracked: onRenderTracked,
    onRenderTriggered: onRenderTriggered,
    onScopeDispose: onScopeDispose,
    onServerPrefetch: onServerPrefetch,
    onUnmounted: onUnmounted,
    onUpdated: onUpdated,
    openBlock: openBlock,
    popScopeId: popScopeId,
    provide: provide,
    proxyRefs: proxyRefs,
    pushScopeId: pushScopeId,
    queuePostFlushCb: queuePostFlushCb,
    reactive: reactive,
    readonly: readonly,
    ref: ref,
    registerRuntimeCompiler: registerRuntimeCompiler,
    render: render,
    renderList: renderList,
    renderSlot: renderSlot,
    resolveComponent: resolveComponent,
    resolveDirective: resolveDirective,
    resolveDynamicComponent: resolveDynamicComponent,
    resolveFilter: resolveFilter,
    resolveTransitionHooks: resolveTransitionHooks,
    setBlockTracking: setBlockTracking,
    setDevtoolsHook: setDevtoolsHook,
    setTransitionHooks: setTransitionHooks,
    shallowReactive: shallowReactive,
    shallowReadonly: shallowReadonly,
    shallowRef: shallowRef,
    ssrContextKey: ssrContextKey,
    ssrUtils: ssrUtils,
    stop: stop,
    toHandlers: toHandlers,
    toRaw: toRaw,
    toRef: toRef,
    toRefs: toRefs,
    transformVNodeArgs: transformVNodeArgs,
    triggerRef: triggerRef,
    unref: unref,
    useAttrs: useAttrs,
    useCssModule: useCssModule,
    useCssVars: useCssVars,
    useSSRContext: useSSRContext,
    useSlots: useSlots,
    useTransitionState: useTransitionState,
    vModelText: vModelText,
    vShow: vShow,
    version: version,
    warn: warn$1,
    watch: watch,
    watchEffect: watchEffect,
    watchPostEffect: watchPostEffect,
    watchSyncEffect: watchSyncEffect,
    withAsyncContext: withAsyncContext,
    withCtx: withCtx,
    withDefaults: withDefaults,
    withDirectives: withDirectives,
    withKeys: withKeys,
    withMemo: withMemo,
    withModifiers: withModifiers,
    withScopeId: withScopeId,
    camelize: camelize,
    capitalize: capitalize,
    normalizeClass: normalizeClass,
    normalizeProps: normalizeProps,
    normalizeStyle: normalizeStyle,
    toDisplayString: toDisplayString,
    toHandlerKey: toHandlerKey
  });
  exports.Vue = Vue;
}