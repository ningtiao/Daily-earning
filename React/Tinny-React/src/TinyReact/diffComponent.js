import mountElement from "./mountElement"
import updateComponent from './updateComponent'
export default function diffComponent(virtualDOM, oldComponent, oldDOM, container) {
  if (isSameCompnent(virtualDOM, oldComponent)) {
    // 同一个组件做组件更新操作
    updateComponent(virtualDOM, oldComponent, oldDOM, container)
  } else {
    // 不是同一个组件
    mountElement(virtualDOM, container, oldDOM)
  }
}

function isSameCompnent (virtualDOM, oldComponent) {
  return oldComponent && virtualDOM.type === oldComponent.constructor
}