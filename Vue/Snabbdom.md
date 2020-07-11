
## Vue虚拟DOM
#### 课程目标
- 了解什么是虚拟DOM,以及虚拟DOM的作用
- Snabbdom的基本使用
- Snabbdom的源码分析

### 什么是Virtual DOM
- Virtual DOM 是由普通的JS对象来描述DOM对象,因为不是真实的DOM对象,所以叫 Virtual DOM
- 真实DOM成员
```js
let element = documemt.querySeletor('#app')
let s = ''
for (var key in element) {
  s += key + ','
}
console.log(s)
```
- 可以使用Virtual DOM来描述真实DOM,示例
```js
{
  sel: 'div',
  data: {},
  children: undefined,
  text: "Hello Virtual DOM",
  elm: undefined,
  key: undefined
}
```
### 为什么使用Virtual DOM
- 手动操作DOM比较麻烦，还需要考虑浏览器兼容性问题，虽然有jQuery等库简化DOM操作，但是随着项目的复杂DOM操作复杂提升

- 为了简化DOM的复杂操作于是出现了各种MVVM框架，MVVM 框架解决了视图和状态的同步问题

- 为了简化视图的操作我们可以使用模板引擎，但是模板引擎没有解决跟踪状态变化的问题，于是Virtual DOM出现了Virtual DOM的好处是当状态改变时不需要立即更新DOM,只需要创建一个虚拟树来描述DOM, Virtual DOM内部将弄清楚如何有效(dif)的更新DOM

- 参考github上yirtual-dom的描述

- 虚拟DOM可以维护程序的状态，跟踪上-次的状态

- 通过比较前后两次状态的差异更新真实DOM

### 虚拟DOM的作用
- 维护视图和状态的关系
- 复杂视图情况下提升渲染性能
- 除了渲染DOM以外,还可以实现SSR(Nuxt.js/Next.js),原生应用(Weex/React Native),小程序(mpvue/uni-app)等

         -> 真实DOM
虚拟DOM  -> SSR
         -> 原生应用
         -> 小程序

Virtual DOM库

- Snabbdom 
 - Vue 2.x内部使用的Virtal DOM 就是改造的Snabbdom
 - 大约200 SLOC (single line of code)
 - 通过模块可扩展
 - 源码使用TypeScript 开发
 - 最快的Virtual DOM之一
- virtual-dom

## Snabbdom基本使用
### 创建项目
- 打包工具为了方便使用 parcel
- 创建项目, 并安装parcel
- parcel使用简单 0配置
```
# 创建项目目录
md snabbdom-demo
# 进入项目目录
cd snabbdom-demo
#创建pageage.json
yarn init -y
# 本地安装 parcel
yarn add parcel-bundler

```
- 配置pageage.json 的script
```
"script": {
  "dev": "parcel index.html --open",
  "build": "parcel build index.html"
}

```
- 创建目录结构
```
index.html
pageage.json
src
 01-basicusage.js

```
## 导入Snabbdom

- 看文档的意义
- 学习任何一 个库都要先看文档
- 通过文档了解库的作用
- 看文档中提供的示例，自己快速实现一个demo通过文档查看API的使用
### 文档地址
- https//github.com/snabbdom/snabbdom中文翻逢

### 安装Snabbdom
- 安装Snabbdom

```
yarn add snabbdom
```

### 导入Snabbdom

- Snabbdom的官网demo中导入使用的是commonis模块化语法，我们使用更流行的ES6语法import
- 关于模块化的语法请参考阮峰老师的 Module的语法
- ES6模块与CommonJS模块的差异

```
import { init, h, thunk } from snabbdom

```

- Snabbdom的核心仅提供最基本的功能，只导出了三个函数it( h0、 thunk(). init() 是一个高阶函数，返回patch()

- h()返回虚拟节点VNode,这个函数我们在使用Vue.js的时候见过

```javascript
 new Vue({
  router ,
  store,
  render: h => h(App)
}).$mount(" #app')
```

- thunk() 是一种优化策略，可以在处理不可变数据时使用

- 注意:导入时候不能使用import snabbdom from ， snabbdom'

- 原因: node_ modules/src/snabbdom.ts 末尾导出使用的语法是export导出API,没有使用export default 导出默认输出

### 基本使用Snabbdom
```javascript
// 01-basicuage.js
import { h, init } from 'snabbdom'


// 参数: 数组,模块
// 返回值: patch函数,作用对比两个vnode的差异更新到真实DOM
console.log(h, init)
// 1 Hello Word
let patch = init([])
// 第一个参数, 标签+选择器
// 第二个参数: 如果是字符串的话就是标签中内容
let vnode = h('div#container.cls', 'Hello word')
let app = document.querySelector('#app')
// 第一个参数: 可以使DOM元素,内部会把DOM元素转换成VNode
// 第二个参数: VNode
// 返回值
let oldVnode = patch(app, vnode)

// 假设的时刻
vnode = h('div', 'Hello Snabbom')
// div中放置子元素 h1,p
patch(oldVnode, vnode)
```


```javascript
// 02-basicuage.js
import { h, init } from 'snabbdom'

let patch = init([])

let vnode = h('div#container', [
  h('h1', 'Hello Snavvdom'),
  h('p', '这是一个p标签')
])

let app = document.querySelector('#app')

let oldVnode = patch(app, vnode)

setTimeout(() => {
  vnode = h('div#container', [
    h('h1', '大白菜'),
    h('p', 'Hello')
  ])
  patch(oldVnode, vnode)
  patch(oldVnode, h('!'))
  // patch(oldVnode, null)  //这是错误做法哦,会报错

}, 1000)

```













## Snabbdom源码解析概述

### 如何学习源码

- 先宏观了解
- 带着目标看源码
- 看源码的过程要不求甚解调试
- 参考资料

### Snabbdom的核心

- 使用h()函数创建JavaScript对象(VNode)描述真实DOMinit()设置模块，创建patch()
- patch()比较新旧两个VNode
- 把变化的内容更新到真实DOM树上
- Snabbdom源码

### 源码地址:
- https://ithub.com/snabbdom/snabbdom
src目录结构
```javascript
  h.ts
  hooks.ts
  htmldomapi.ts
```

- h()函数，用来创建VNode所有钩子函数的定义

- 对DOM API的包装 
- 搜索的内容

## h函数

- h()函数介绍
- 在使用Vue的时候见过h()函数
```javascript
new vue({
  routerm
  store,
  render: h => h(App)
}).$mount('#app)

```
- h函数最早见于hypescript,使用JavaScript创建超文本
- Snabbdom 中的h()函数不是用来创建超文本,而是创建Vnode

- 函数重载
- 概念
- 参数个数或类型不同的函数
- JavaScript 中没有重载的概念
- TypeScript中重载, 不过重载的实现还是通过代码调整参数

### 重载的示意
```javascript
function add (a, b) {
  console.log(a + b)
}

function add (a, b, c) {
  console.log(a + b + c)
}

add(1, 2)
add(1, 2, 3)
```

## Snabbdom
- patch(oldVnode, newVnode)
- 打补丁，把新节点中变化的内容渲染到真实DOM,最后返回新节点作为下一-次处理的旧节点
- 对比新旧VNode是否相同节点(节点的key和sel相同)
- 如果不是相同节点，删除之前的内容，重新渲染
- 如果是相同节点，再判断新的VNode是否有text, 如果有并且和oldVnode的text不同，直接更新文本内容如果新的VNode有children,判断子节点是否有变化，判断子节点的过程使用的就是diff算法
- diff 过程只进行同层级比较

### modules 源码
- patch -> patchVnode -> updateChildren()
- Snabbdom 为了保证核心库的精炼,处理元素的属性/事件/样式等工作,放置模块中
- 模块可以按照需要引入
- 模块的使用可以查看官方文档
- 模块实现的核心是基于Hooks

Hooks
- 预定义的钩子函数的名称
- 源码位置: src/hooks