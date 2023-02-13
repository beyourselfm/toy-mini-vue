import { effect } from "../reactivity";
import { isEmptyObject } from "../utils";
import {
  createComponentInstance,
  ComponentInstance,
  setupComponent,
} from "./component";
import { createAppApi, Nullable } from "./createApp";
import { ShapeFlags } from "./ShapeFlags";
import { AnyObject, VNode, VNodeProps, Component, Children } from "./vnode";

export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");

export type RenderOptions<Node> = {
  createElement: (type: string) => Node;
  patchProp: (n: Node, key: string, oldVal: any, newVal: any) => void;
  insert: (n: Node, container: Node) => void;
  setText: (n: Node, text: string) => void;
  remove: (n: Node) => void;
};
export function createRender<Node = AnyObject>(options: RenderOptions<Node>) {
  const { createElement, patchProp, insert, setText, remove } = options;

  function render(
    vnode: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance
  ) {
    // init
    patch(null, vnode, container, parentComponent);
  }

  function patch(
    n1: Nullable<VNode<Node>>,
    n2: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance
  ) {
    const { type, shapeFlag } = n2;

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }

  function processComponent(
    n1: Nullable<VNode<Node>>,
    n2: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance
  ) {
    // stateful component
    if (!n1) {
      mountComponent(n2, container, parentComponent);
    } else {
      patchComponent(n1, n2);
    }
  }
  function patchComponent(n1: VNode<Node>, n2: VNode<Node>) {}

  function mountComponent(
    vnode: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance
  ) {
    const instance = createComponentInstance(vnode, parentComponent);
    setupComponent(instance);

    setupRenderEffect(instance, vnode, container);
  }

  function setupRenderEffect(
    instance: ComponentInstance<Node>,
    initialVNode: VNode<Node>,
    container: Node
  ) {
    effect(() => {
      if (!instance.isMounted) {
        debugger;
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));
        // 子组件patch
        patch(null, subTree, container, instance);
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        // update
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;

        instance.subTree = subTree;
        patch(prevSubTree, subTree, container, instance);
      }
    });
  }

  function processElement(
    n1: Nullable<VNode<Node>>,
    n2: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance
  ) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container, parentComponent);
    }
  }

  function mountElement(
    vnode: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance
  ) {
    const el = (vnode.el = createElement(vnode.type as string));

    const { children, shapeFlag ,props} = vnode;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      setText(container, children as string);
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children as VNode<Node>[], el, parentComponent);
    }
    for (const key in props) {
      patchProp(el, key, null, props[key]);
    }
    insert(el, container);
  }
  function mountChildren(
    children: VNode<Node>[],
    container: Node,
    parentComponent: ComponentInstance
  ) {
    children.forEach((v) => {
      patch(null, v, container, parentComponent);
    });
  }

  function processFragment(
    n1: Nullable<VNode<Node>>,
    n2: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance
  ) {
    mountChildren(n2.children as VNode<Node>[], container, parentComponent);
  }

  function processText(n1: VNode, n2: VNode, container: Node) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children as string));
    insert(textNode as Node, container);
  }

  function patchChildren(
    n1: Nullable<VNode<Node>>,
    n2: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance
  ) {
    const prevShapeFlag = n1.shapeFlag;
    const nextShapeFlag = n2.shapeFlag;
    const prevChildren = n1.children;
    const nextChildren = n2.children;
    const prevEl = n1.el;
    if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // text/array -> text
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 清空旧的children
        unmountChildren(n1.children as VNode<Node>[]);
      }
      if (prevChildren !== nextChildren) {
        setText(prevEl, nextChildren as string);
      }
    } else if (nextShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // text/array -> array
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        setText(prevEl, "");
        mountChildren(nextChildren as VNode<Node>[], prevEl, parentComponent);
      }
    }
  }

  function unmountChildren(children: VNode<Node>[]) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el;
      remove(el);
    }
  }

  function patchElement(
    n1: Nullable<VNode<Node>>,
    n2: VNode<Node>,
    container: Node,
    parentComponent?: ComponentInstance
  ) {
    // updateElement
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    const el = (n2.el = n1.el);
    patchChildren(n1, n2, container, parentComponent);
    patchProps(el, oldProps, newProps);
  }

  function patchProps(el: any, oldProps: VNodeProps, newProps: VNodeProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        //
        const prevProp = oldProps[key];
        const newProp = newProps[key];
        if (prevProp !== newProp) {
          patchProp(el, key, prevProp, newProp);
        }
      }
    }

    if (!isEmptyObject(oldProps)) {
      // remove oldProp
      for (const key in oldProps) {
        if (!(key in newProps)) {
          patchProp(el, key, oldProps[key], null);
        }
      }
    }
  }

  return { createApp: createAppApi(render) };
}
