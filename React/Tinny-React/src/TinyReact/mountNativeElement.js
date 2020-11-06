
import createDOMElement from './createDOMElement'
import unmountNode from './unmountNode'
export default function mountNativeElement(virtualDOM, container, oldDOM) {
  const newElement = createDOMElement(virtualDOM)
  // 判断旧的 oldDOM 是否存在， 如果存在删除
  if (oldDOM) {
    container.insertBefore(newElement, oldDOM)
  } else {
    // 将转换之后的DOM 对象放置到在页面中
    container.appendChild(newElement)
  }
  if (oldDOM) {
    unmountNode(oldDOM)
  }

  let component = virtualDOM.component
  if (component) {
    component.setDOM(newElement)
  }
}
