### initGlobalAPI
初始化了Vue.config对象,给config设置了方法

```javascript
Object.defineProperty(Vue, 'config', configDef)

Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement
```
设置了Vue.util

让一个对象可响应

初始化Vue.options 对象,并给其扩展
```js
Vue.options = Object.create(null)
```
设置keep-alive组件

```js
extend(Vue.options.components, builtComponents)

// 注册Vue.use()用来注册插件
initUse(Vue)
// 注册Vue.mixin()实现混入
initMixin(Vue)
// 注册Vue.extend()基于传入的options返回一个组件的构造函数
initExtend(Vue)
// 注册Vue.directive(), Vue.component(), Vue.filter
initAssetRegisters(Vue)
```
**initUse(Vue)**
传入了Vue构造函数,给Vue增加了一个use方法,use接收一个plugin插件, 定义一个常量保存所安装的插件,接着判断当前注册的插件是否在数组中存在。
- 如果这个插件已经注册,直接返回,否则注册插件
- 如果传入的plugin是对象,就会调用plugin.install方法
- 如果是函数,会直接调用函数
- 最后注册完成插件,保存在数组中,返回Vue
```js
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }
    // additional parameters
    // 把数组中的第一个元素plugin去除
    const args = toArray(arguments, 1)
    // 把this(Vue) 插入第一个元素的位置
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
```

**initMixin(Vue)**
- 通过mergeOptions 把mixin所有的成员拷贝到this.options,this指向Vue
```js
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```

**initExtend(Vue)**
- 给Vue 注册一个extend方法 `Vue.extend`,接收一个参数options选项
- 创建了一个构造函数VueComponent,也就是组件对象的构造函数,接着继承Vue
```javascript
const Sub = function VueComponent (options) {
  // 调用_init()初始化
  this._init(options)
}
// 原型继承自Vue
Sub.prototype = Object.create(Super.prototype)
Sub.prototype.constructor = Sub
```

**initAssetRegisters(Vue)**

- 注册Vue.directive(), Vue.component(), Vue.filter
- 判断是component 还是directive
- 把组件配置转换为组件的构造函数
- 全局注册,存储资源并赋值
```js
// 遍历ASSET_TYPES包括了directive, component, filter
ASSET_TYPES.forEach(type => {
  ...
}
```