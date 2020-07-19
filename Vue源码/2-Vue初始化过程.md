
### 初始化过程
#### 1.platforms/web/runtime/index.js
- 给Vue.config注册了一些方法
```javascipt
// 判断是否是关键属性(表单元素input/ checked/selected/muted)
// 如果是这些属性,这只el.props属性(属性不设置到标签上)
// install platform specific utils
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement
```

#### 2.通过extend给全局注册了指令和组件
```js
extend(Vue.options.directives, platformDirectives)
// model和show
extend(Vue.options.components, platformComponents)
// 分别是Transitions和TransitionGroup
```
#### 3.在Vue原型上注册了__patch__函数,功能把虚拟DOM转换成真实DOM
```js
Vue.prototype.__patch__ = inBrowser ? patch : noop
// inBrowser判断是个是浏览器环境
```
#### 4. 在Vue原型上注册了$mount 内部调用mountComponent方法,渲染DOM
#### 5. 最后导出了Vue


### 在src/core/index.js文件中
调用了initGlobalApi(Vue),给Vue构造函数增加静态方法

**initGlobalApi(Vue)**
```javascript
// 静态方法 set/delete/nextTick
Vue.observable // 让一个对象可响应

// 初始化Vue.options对象,并给其扩展
// components/directives/filters
Vue.options = Object.create(null)
ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

// this is used to identify the "base" constructor to extend all plain-object
// components with in Weex's multi-instance scenarios.
Vue.options._base = Vue
//这是keep-alive 组件
extend(Vue.options.components, builtInComponents)
// 注册Vue.use()用来注册插件
initUse(Vue)
// 注册Vue.mixin()实现混入
initMixin(Vue)
// 注册Vue.extend()基于传入的options返回一个组件的构造函数
initExtend(Vue)
// 注册Vue.directive(), Vue.component(), Vue.filter
initAssetRegisters(Vue)
```

**在src/core/instance/index.js**
- 在vue构造函数判断了是否是生产环境
- 调用init方法
- initMixin(Vue) 注册vm的_init()方法,初始化vm
- stateMixin(Vue) 注册vm的$data/props/$set/$delete/$watch
- eventsMixin(Vue) 初始化事件相关方法 $on/$once/$off/$emit
- lifecycleMixin(Vue) 初始化生命周期相关的混入方法 $on/$forceUpdate/$destory
- renderMixin(Vue) 混入render $nextTick/_render

**总结**
**四个导出Vue的模块**
> src/platforms/web/entry-runtime-with-compiler.js
- web平台相关的入口
- 重写了平台相关的Smount)方法
- 注册了Vue compile()方法，传递一个HTML字符串返回render函数
> src/platforms/web/runtime/index.js
  - web平台相关
  - 注册和平台相关的全局指令: v-model. v-show
  - 注册和平台相关的全局组件: v-transition和v-transition-group
  - 全局方法:
    - patch _:把虚拟DOM转换成真实DOM
    - $mount:挂载方法

>  src/core/index.js
- 与平台无关
- 设置了Vue的静态方法，itiltbalaPl(Vue)
> src/core/instance/index.js
- 与平台无关
- 定义了构造函数，调用了this, iptons)方法
- 给Vue中混入了常用的实例成员
