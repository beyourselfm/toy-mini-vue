'use strict';

const targetMap = new WeakMap();
let activeEffect;
let shouldTrack;
function track(target, key) {
    if (!isTracking())
        return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    trackEffects(dep);
}
function trigger(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    let dep = depsMap === null || depsMap === void 0 ? void 0 : depsMap.get(key);
    if (!dep)
        return;
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}
class ReactiveEffect {
    constructor(fn, scheduler) {
        this.active = true;
        this._fn = fn;
        this.scheduler = scheduler;
        this.deps = [];
    }
    run() {
        if (!this.active) {
            return this._fn();
        }
        // ++ => get and set
        shouldTrack = true;
        //
        activeEffect = this;
        const result = this._fn();
        shouldTrack = false;
        return result;
    }
    stop() {
        if (this.active) {
            cleanupEffect(this);
            this.onStop && this.onStop();
            this.active = false;
        }
    }
}
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}
function trackEffects(dep) {
    if (dep.has(activeEffect))
        return;
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}
function cleanupEffect(effect) {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}
function stop(runner) {
    var _a;
    if (!runner.effect)
        return;
    (_a = runner.effect) === null || _a === void 0 ? void 0 : _a.stop();
}
function effect(fn, options = {}) {
    const { scheduler } = options;
    const _effect = new ReactiveEffect(fn, scheduler);
    Object.assign(_effect, options);
    // run called when init
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}

const isObject = (val) => val !== null && typeof val === 'object';
const hasChanged = (val, newVal) => !Object.is(val, newVal);
const isString = (val) => typeof val === 'string';

// created once
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, isShallow = false) {
    return function get(target, key) {
        if (key === "__is_reactive__" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__is_readonly__" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (isShallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        if (!isReadonly) {
            track(target, key);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}
const mutableHandlers = {
    get,
    set,
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key: ${key.toString()} set fail,${target} readonly`);
        return true;
    }
};
const shallowReadonlyHandlers = Object.assign({}, readonlyGet, {
    get: shallowReadonlyGet,
});

function reactive(raw) {
    return createReactiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers);
}
function createReactiveObject(target, baseHandlers) {
    return new Proxy(target, baseHandlers);
}
function isReactive(value) {
    return !!value["__is_reactive__" /* ReactiveFlags.IS_REACTIVE */];
}
function isReadonly(value) {
    return !!value["__is_readonly__" /* ReactiveFlags.IS_READONLY */];
}
function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}

class ComputedIMpl {
    constructor(getter) {
        this._getter = getter;
        this._dirty = true;
        this._effect = new ReactiveEffect(getter, () => {
            if (!this._dirty) {
                this._dirty = true;
            }
        });
    }
    get value() {
        if (this._dirty) {
            this._dirty = false;
            this._value = this._effect.run();
        }
        return this._value;
    }
}
function computed(getter) {
    return new ComputedIMpl(getter);
}

class RefImpl {
    constructor(value) {
        this._rawValue = value;
        this._value = convertToReactive(value);
        this.dep = new Set();
        this.__is_ref = true;
    }
    get value() {
        if (isTracking()) {
            trackEffects(this.dep);
        }
        return this._value;
    }
    set value(newValue) {
        if (hasChanged(this._rawValue, newValue)) {
            this._rawValue = newValue;
            this._value = convertToReactive(newValue);
            triggerEffects(this.dep);
        }
    }
}
function convertToReactive(value) {
    return isObject(value) ? reactive(value) : value;
}
function ref(value) {
    return new RefImpl(value);
}
function isRef(value) {
    return !!(value && value.__is_ref);
}
function unRef(ref) {
    return isRef(ref) ? ref.value : ref;
}
function proxyRefs(ref) {
    return new Proxy(ref, {
        get(target, key, receiver) {
            return unRef(Reflect.get(target, key, receiver));
        },
        set(target, key, newValue, receiver) {
            if (isRef(target[key]) && !isRef(newValue)) {
                target[key].value = newValue;
                return true;
            }
            else {
                return Reflect.set(target, key, newValue, receiver);
            }
        }
    });
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type
    };
    return component;
}
function setupComponent(instance) {
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        // fn or object
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    //
    if (isObject(setupResult)) {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    if (isString(vnode.type)) {
        processElement(vnode, container);
    }
    else {
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.type.render();
    patch(subTree, container);
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = document.createElement(vnode.type);
    const { children } = vnode;
    if (isString(children)) {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    const { props } = vnode;
    for (const key in props) {
        el.setAttribute(key, props[key]);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(v => {
        patch(v, container);
    });
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
    };
    return vnode;
}

function createApp(root) {
    return {
        mount(rootContainer) {
            const vnode = createVNode(root);
            render(vnode, rootContainer);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.ReactiveEffect = ReactiveEffect;
exports.computed = computed;
exports.convertToReactive = convertToReactive;
exports.createApp = createApp;
exports.createComponentInstance = createComponentInstance;
exports.createVNode = createVNode;
exports.effect = effect;
exports.h = h;
exports.isProxy = isProxy;
exports.isReactive = isReactive;
exports.isReadonly = isReadonly;
exports.isRef = isRef;
exports.isTracking = isTracking;
exports.proxyRefs = proxyRefs;
exports.reactive = reactive;
exports.readonly = readonly;
exports.ref = ref;
exports.render = render;
exports.setupComponent = setupComponent;
exports.shallowReadonly = shallowReadonly;
exports.stop = stop;
exports.track = track;
exports.trackEffects = trackEffects;
exports.trigger = trigger;
exports.triggerEffects = triggerEffects;
exports.unRef = unRef;
