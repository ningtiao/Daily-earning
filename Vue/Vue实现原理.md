---
# 主题使用方法：https://github.com/xitu/juejin-markdown-themes
theme: juejin
highlight: juejin
---

来自**拉勾教育大前端训练营** vue 框架源码与进阶模块,以下内容为个人在学习过程中对响应式原理的总结～

先实现 mini 版 Vue 之前,我们先来了解一些概念

### 1、数据驱动

- 数据驱动
- 响应式的核心原理
- 发布订阅模式和观察者模式

**数据驱动**

- 数据响应式、双向绑定、数据驱动
- 数据响应式
- 数据模型仅仅是普通对象的 JavaScript,而我们修改数据时,视图会进行更新,避免了繁琐的 DOM 操作,提高开发效率

- 双向绑定
- 数据改变,视图改变,数据也随之改变
- 我们可以使用 v-model 在表单元素上创建双向数据绑定

**数据驱动是 Vue 最独特的特性之一**

- 开发过程中仅需要关注数据本身,不需要关系数据时如何渲染到视图

### 2、数据响应式的核心原理 Vue2

```javascript
let data = {
  msg: "大白菜",
};
// 模拟Vue的实例
let vm = {};

// 数据劫持, 当访问或者设置vm中成员的时候,做一些干预操作
Object.defineProperty(vm, "msg", {
  // 可枚举
  enumerable: true,
  // 可配置 (可以使用delete杉树,也可通过defineProperty重新定义)
  configurable: true,
  get() {
    return data.msg;
  },
  set(newValue) {
    if (newValue === data.msg) {
      return;
    }
    data.msg = newValue;
    // 数据更改,更新DOM的值
    document.querySelector("#app").textContent = data.msg;
  },
});

// 测试
vm.msg = "Hello word";
console.log(vm.msg);

// 多个属性
let vm = {};
proxyData(data);

function proxyData(data) {
  Object.keys(data).forEach((key) => {
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get() {
        console.log("set:", key, data[key]);
        return data[key];
      },
      set(newValue) {
        if (newValue === data[key]) {
          return;
        }
        data[key] = newValue;
        document.querySelector("#app").textContent = data[key];
      },
    });
  });
}
// vm.msg = '大白菜'
// set: msg 大白菜
```

### 3、Vue 响应式原理 Vue3

- MDN Proxy
- 直接监听对象, 而非属性
- ES6 中新增, IE 不支持,性能由浏览器优化

```javascript
let data = {
  msg: "hello",
};

let vm = new Proxy(data, {
  get(target, key) {
    return target[key];
  },
  // 设置vm的成员会执行
  set(target, key, newValue) {
    console.log("set", key, newValue);
    if (target[key] === newValue) {
      return;
    }
    target[key] = newValue;
    document.querySelector("#app").textContent = target[key];
  },
});
vm.msg = "大白菜";
console.log(vm.msg);
```

### 4、发布订阅模式

- 发布/订阅模式
- 订阅者
- 发布者
- 信号中心
  > 我们假定,存在一个“信号中心”,某个任务执行完成,就向信号中心“发布” (publish)一个信号,其他任务可以向信号中心“订阅” (subscribe)这个信号,从而知道什么时候自己可以开始执行,这就叫做“发布/定于模式” (publish-subscribe pattern)

```javascript
let vm = new Vue();
// 注册事件(订阅消息)
vm.$on("dataChange", () => {
  console.log("dataChange");
});

vm.$on("dataChange", () => {
  console.log("dataChange1");
});
// 触发事件(发布消息)

// 自定义事件
class EventEmitter {
  constructor() {
    this.subs = Object.create(null);
  }

  // 注册事件
  $on(eventType, handler) {
    this.subs[eventType] = this.subs[eventType] || [];
    this.subs[eventType].push(handler);
  }
  // 触发事件
  $emit(eventType) {
    if (this.subs[eventType]) {
      this.subs[eventType].forEach((handler) => {
        handler();
      });
    }
  }
}

// 测试一下
let em = new EventEmitter();
em.$on("click", () => {
  console.log("click1");
});
em.$on("click", function () {
  console.log("click2");
});

em.$emit("click");
```

### 5、观察者模式

- 观察者(订阅者) -- Watcher
- upload(): 当事件发生时,具体要做的事情
- 目标(发布者) --Dep
  - subs 数组: 存储所有的观察者
  - addSub(): 添加观察者
  - notify(): 当事件发生,调用所有观察者 upload()方法
- 没有事件中心

```javascript
class Dep {
  constructor() {
    // 记录所有的订阅者
    this.subs = [];
  }
  // 添加观察者
  addSub() {
    if (sub && sub.update) {
      this.subs.push(sub);
    }
  }
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}

class Watcher {
  update() {
    console.log("update");
  }
}

// 测试一下
let dep = new Dep();
let watcher = new Watcher();
dep.addSub(watcher);
dep.notify();
```

- 观察者模式是由具体目标调度,Dep 就回去调用观察者的方法,所以观察者模式的订阅者与发布者之间是存在依赖的
- 发布/订阅模式由统一调度中心调用,因此发布者和订阅者不需要知道对方的存在
- 见图

### 6、模拟 Vue 响应式原理-分析

- Vue 基本结构
- 打印 Vue 实例观察
- 见图
  **Vue**
- 把 data 中的成员注入到 Vue 实例,并且把 data 中的成员转成 getter/setter
  **Observer**
- 能够对数据对象的所有属性进行监听,如有变动可拿到最新值并通知 Dep

**好啦,说这么多,终于到了如何去实现 mini 版 vue 了**,下面我们将一步一步去实现 mini 版的 vue

### 7、Vue

- 负责接收初始化的参数(选项)
- 负责把 data 中的属性注入到 Vue 实例,转换成 getter/setter
- 负责调用 observer 监听 data 中所有属性的变化
- 负责调用 compiler 解析指令/差值表达式

**结构**

- `+ $options`
- `+ $el`
- `+ $data`
- `+ _proxyData`

首先在文件中新增一个 vue.js 文件

```js
class Vue {
  constructor(options) {
    // 1. 通过属性保存选项的数据
    // 2. 把data中的成员转换成getter和setter,注入到Vue实例中
    // 3. 调用observer对象,监听数据的辩护
    // 4. 调用compiler对象, 解析指令和差值表达式
  }
  // 代理数据
  _proxyData(data) {}
}
```

**完整代码**

```javascript
// vue.js
class Vue {
  constructor(options) {
    // 1. 通过属性保存选项的数据
    this.$options = options || {};
    this.$data = options.data || {};
    this.$el =
      typeof options.el === "string"
        ? document.querySelector(options.el)
        : options.el;
    // 2. 把data中的成员转换成getter和setter,注入到Vue实例中
    this._proxyData(this.$data);
    // 3. 调用observer对象,监听数据的辩护
    new Observer(this.$data);
    // 4. 调用compiler对象, 解析指令和差值表达式
  }
  _proxyData(data) {
    // 遍历data中的所有属性
    Object.keys(data).forEach((key) => {
      // 把data的属性注入到Vue实例中
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key];
        },
        set(newValue) {
          if (newValue === data[key]) {
            return;
          }
          data[key] = newValue;
        },
      });
    });
  }
}
// 测试一下
// 控制台输入vm看是有实例
```

这个时候我们需要在 index.html 去使用 Vue.js

```js
<script src="vue.js"></script>;

let vm = new Vue({
  el: "#app",
  data: {
    msg: "Hello Vue",
    count: 100,
  },
});
console.log(vm.msg);
```

**在控制台输入 vm 测试一下,可以看到我们刚刚添加的成员**
![在这里插入图片描述](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abe400e65b184979b7ff3ee293cb8dab~tplv-k3u1fbpfcp-zoom-1.image)

### 8、Observer

- 负责把 data 选项中的属性转换成响应式数据
- data 中的某个属性也是对象,把该属性转换成响应式数据
- 数据变化发送通知
  结构

* `+ walk(data)`
* `+ defineReactive(data, key, value)`

**新建一个`observer.js`**, 在`index.html`中引入

```javascript
// +walk(data)
// + defineReactive(data, key, value)
// 结构
class Observer {
  walk(data) {}
  defineReactive(obj, key, val) {}
}
```

**完成代码**

```js
class Observer {
  constructor(data) {
    this.walk(data);
  }
  walk(data) {
    // 1. 判断data是否是对象
    if (!data || typeof data !== "object") {
      return;
    }
    // 2. 遍历data对象的所有属性
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }
  defineReactive(obj, key, val) {
    let that = this;
    // 如果val是对象,把val内部的属性转换成响应式数据
    this.walk(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        return val;
      },
      set(newValue) {
        if (newValue === val) {
          return;
        }
        val = newValue;
        that.walk(newValue);
        //发送通知
      },
    });
  }
}
```

**测试一下**

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue</title>
</head>

<body>
  <div id="app">
    <h1>大白菜</h1>
    <h1>{{ msg }}</h1>
    <h1>{{ count }}</h1>
    <div>{{ name }}</div>
    <h1>v-text</h1>
    <div v-html="htmlStr"></div>
    <div v-text="msg"></div>
    <input type="text" v-model="msg">
    <input type="text" v-model="count">
  </div>
  <script src="observer.js"></script>
  <script src="vue.js"></script>
  <script>
    let vm = new Vue({
      el: '#app',
      data: {
        msg: 'Hello Vue',
        count: 100,
        person: {
          name: 'zzzz'
        }
      }
    })
    console.log(vm.msg)
    vm.msg = { test: '大白菜～' }
  </script>
</body>
</html>
```

记得在`vue.js`第三步 调用 Observer

```js
new Observer(this.$data);
```

**此时在控制台输入 vm 即可看到如下结果** `msg`为响应式对象
![在这里插入图片描述](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82066f5890494b3690d4987fe422996e~tplv-k3u1fbpfcp-zoom-1.image)

### 9、Compiler

**Compiler 功能**

- 负责编译模板,解析指令/差值表达式
- 负责页面的首次渲染
- 当数据变化后重新渲染视图

**Compiler 结构**

- `+ el`
- `+ vm`
- `+ compile(el)`
- `+ compileElement(node)`
- `+ compileText(node)`
- `+ isDirective(arrrNode)`
- `+ isTextNode(node)`
- `+ isElementNode(node)`
- **新建`compiler.js`**

```js
// 接下来会一步一步实现这个compiler.js的方法
class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
  }
  // 编译模板, 处理文本节点和元素节点
  compile(el) {}
  // 编译元素节点, 出来指令
  compileElement(node) {}
  // 编译文本节点，出来插值表达式
  compileText(node) {}
  // 判断元素属性是否是指令
  isDirective(attrName) {
    return attrName.startsWith("v-");
  }
  // 判断节点是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }
  // 判读节点是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
}
```

Compiler compile

```js
class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.compile(this.el);
  }
  // 编译模板, 处理文本节点和元素节点
  compile(el) {
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      // 处理文本节点
      if (this.isTextNode(node)) {
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node);
      }

      // 判断node节点,是否有子节点, 如果有子节点,要递归调用compile
      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
      }
    });
  }
}
```

Compiler compileText

```js
 // 编译文本节点，出来差值
 compileText (node) {
   // console.dir(node)
   let reg = /\{\{(.+?)\}\}/
   let value = node.textContent
   if (reg.test(value)) {
     let key = RegExp.$1.trim()
     node.textContent = value.replace(reg, this.vm[key])
   }
 }
```

Compiler compileElement

```js
 // 编译元素节点, 出来指令
 compileElement (node) {
   console.log(node.attributes)
   // 遍历所有的属性节点
   Array.from(node.attributes).forEach(attr => {
     // 判断是否是指令
     let attrName = attr.name
     if (this.isDirective(attrName)) {
       // v-text --> text
       attrName = attrName.substr(2)
       let key = attr.value
       this.update(node, key, attrName)
     }
   })
 }

 update (node, key, attrName) {
   let updateFn = this[attrName + 'Updater']
   updateFn && updateFn(node, this.vm[key])
 }
```

### 10、Dep

**功能**

- 收集依赖,添加观察者
- 通知所有观察者

**Dep 结构**

- `+ subs`
- `+ addSubs(sub)`
- `+ notify`
- **新建`Dep.js`**

```js
class Dep {
  constructor() {
    // 存储所有的观察者
    this.subs = [];
  }
  // 添加观察者
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub);
    }
  }
  // 发送通知
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  }
}
```

完成`dep.js`之后,我们需要在`Observer.js`中的`defineReactive`中创建`Dep`对象

```js
defineReactive (obj, key, val) {
  let that = this
  // 负责收集依赖, 并发送通知
  let dep = new Dep()
  // 如果是val对象,把val内部的属性转换成响应式对象
  that.walk(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get () {
      // 收集依赖
      Dep.target && dep.addSub(Dep.target)
      return val
    },
    set (newValue) {
      if (newValue === val) {
        return
      }
      val = newValue
      that.walk(newValue)
      // 发送通知
      dep.notify()
    }
  })
}
```

### 11、Watcher

![在这里插入图片描述](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1262e60bead446148f50b26b17d1c72b~tplv-k3u1fbpfcp-zoom-1.image)
**功能**

- 当数据变化出发依赖,dep 通知所有的 Watcher 实例更新试图
- 自身实例化的时候往 dep 对象中添加自己

**Watcher**

- `+ vm`
- `+ key`
- `+ cb`
- `+ oldValue`
- `+ update`

新建`watcher.js`文件

```js
class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    // data中的属性名称
    this.key = key;
    // 回调函数负责更新视图
    this.cb = cb;

    // 把Watcher对象记录到Dep 类的静态属性target中
    Dep.target = this;
    // 触发get方法, 在get方法中调用addSub
    this.oldValue = vm[key];
    Dep.target = null;
  }
  // 当数据发生变化的时候更新视图
  update() {
    let newValue = this.vm[this.key];
    // 判断新值和旧值是否相等
    if (this.oldValue === newValue) {
      return;
    }
    this.cb(newValue);
  }
}
```

我们需要在`compile.js`中的 `compileText`、`textUpdater`、`modelUpdater`去创建 watcher 对象

```js
 // 编译文本节点，出来差值
 compileText (node) {
   // console.dir(node)
   let reg = /\{\{(.+?)\}\}/
   let value = node.textContent
   if (reg.test(value)) {
     let key = RegExp.$1.trim()
     node.textContent = value.replace(reg, this.vm[key])

     // 创建watcher对象, 当数据改变更新视图
     new Watcher(this.vm, key, (newValue) => {
       node.textContent = newValue
     })
   }
 }

 // 处理 v-text 指令
 textUpdater (node, value, key) {
   node.textContent = value
   new Watcher(this.vm, key, (newValue) => {
     node.textContent = newValue
   })
 }
 // v-model
 modelUpdater (node, value, key) {
   node.value = value;
   new Watcher(this.vm, key, (newValue) => {
     node.value = newValue
   })
 }
 // 传入key
 update (node, key, attrName) {
   let updateFn = this[attrName + 'Updater']
   updateFn && updateFn.call(this, node, this.vm[key], key)
 }
```

此时在 vue.js 第四步中调用 compile 对象,解析指令和插值表达式

```js
// 4. 调用compiler对象, 解析指令和差值表达式
new Compiler(this);
```

打开控制台即可看到如下效果,到这里,mini 版的 vue 就基本完成了
![在这里插入图片描述](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f9c19fb64e144008da7c6564dfe3954~tplv-k3u1fbpfcp-zoom-1.image)

### 12、双向绑定

给 input 注册事件,实现双向绑定

```js
 // v-model
 modelUpdater (node, value, key) {
   node.value = value;
   new Watcher(this.vm, key, (newValue) => {
     node.value = newValue
   })
   // 双向绑定
   node.addEventListener('input', () => {
     this.vm[key] = node.value
   })
 }
```

### 13、总结

首先创建了一个`Vue`的对象，在 `Vue` 的构造函数中首先记录了从 `options` 传过来的选项，然后调用一个`Proxy data`，也就是把 data 注入到 Vue 的实例上，创建 `Observer` 和 `Compiler`， `Observer` 的作用是数据劫持，在`Observer`中将`data`属性转换成`getter` 和`setter`，当数据变化的时候，也就是触发`set`的时候，需要去通知变化，调用`Dep`的`notify`方法，而` Dep`的`notify`方法要调用 `Watcher` 中的 `update` 方法发送通知，通知 `Watcher`，数据发生了变化，你们要去更新视图了，接着`Watcher` 的 `update`方法就要去更新视图了，只有当数据变化的时候去更新视图，当创建`Watcher`对象的时候，会将当前的`Watcher`对象添加到`Dep`的`subs`数组中，负责收集依赖，让 `Dep` 记录`Watcher`
然后还要去创建`Compiler`对象，它的作用是解析指令，差值表达式，在页面首次加载的时候，会调用`Compiler`中的相关方法去更新视图，同时在`Compiler`还要去订阅数据的变化，绑定更新函数，当创建一个`Watcher`对象的时候，需要传递一个回调函数，在这个回调函数中去更新视图，注意首次加载是通过 `Compiler` 去更新视图，当数据发送了变化是通过`Watcher`去更新视图。

![在这里插入图片描述](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8be1c971a9fc44b3b5b2535024da563f~tplv-k3u1fbpfcp-zoom-1.image)

完成代码已提交到 github

[请点击这里](https://github.com/endless-z/Daily-earning/tree/master/Vue-mini%E7%89%88%E5%AE%9E%E7%8E%B0)

### 感谢大家

最后感谢您花宝贵的时间阅读这篇内容,如果你觉得这篇内容对你有帮助的话,就给本文点个赞吧。
（感大家的的鼓励与支持 🌹🌹🌹)

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd2137464a8a44078c0963287475bfe5~tplv-k3u1fbpfcp-zoom-1.image)
