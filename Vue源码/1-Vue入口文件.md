### 入口文件
- src/platform/web/entry-runtime-with-compiler.js

```js
const vm = new Vue({
  el: '#app',
  template: '<h3> Hello template</h3>',
  render (h) {
    return h('h4', 'Hello render')
  }
})
// 输出谁
```

```js
// 保留 Vue实例的 $mount 方法
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  // 非ssr情况下的为false, ssr时候为true
  hydrating?: boolean
): Component {
  el = el && query(el)
  /* istanbul ignore if */
  // el不能是body 或者html
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  // 把template/el 转换成render函数
  if (!options.render) {
    let template = options.template
    if (template) {
      ...
    }
  }
  return mount.call(this, el, hydrating)
}
```
首先执行了$mount方法把生成的DOM挂载到页面上

el = el && query(el) 获取el对象,el就是创建Vue实例传过来的选项,判断了el是否存在,存在则调用query方法,那么query内部做了什么呢,query先判断了el是否是字符串,如果不是字符串,就认为是DOM对象,直接返回,如果是字符串,那么久认为是选择器,通过querySelector获取选择器对应的DOM元素,如果没有找到则会通过NODE_ENV环境变量判断当前是生产模式还是开发模式。开发模式会创建一个div返回

```js
const options = this.$options
  if (!options.render) {
    let template = options.template
    if (template) {
      ...
    }
  }
```
获取options选项,判断options是否有render参数,如果没有传递,则会进去if语句进行执行,代码很多。我们只需关注核心的作用。
如果没有传递render 此时会去获取template,整个if语句只做一件事,就是将template转换成render函数
如果传递了render函数,此时会调用$mount方法,渲染DOM
```js
return mount.call(this, el, hydrating)
```