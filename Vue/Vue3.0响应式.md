Vue3.0 的响应式系统底层使用了 Proxy 对象实现，在初始化的时候不需要遍历所有的属性，再把属性通过 defineProperty 转化成 getter 和 setter，另外如果有多层属性嵌套的话，只有访问某个属性的时候才会递归处理下级的属性，所以 Vue3.0 中的响应式系统的性能要比 Vue2 好。

Vue3 的响应式默认可以监听动态添加的属性，还可以监听属性的删除操作以及数组的索引和 length 属性的修改操作，另外，Vue3 响应式系统还可以作为一个模块单独使用，接下来我们分别来实现 Vue3.0 中几个核心函数：

- reactive / ref / toRefs / computed
- effect
- track
- trigger

### 1、Proxy 对象的基本使用

```js
const target = {
  foo: 'xxx',
  bar: 'yyy'
}
const proxy = new Proxy(target, {
  get (target, key, receiver) {
    // return target[key]
    return Reflect.get(target, key, receiver
  },
  set (target, key, value, receiver) {
    // target[key] = value
    return Reflect.set(target, key, value, receiver)
  },
  deleteProperty (target, key) {
    // delete target[key]
    return Reflect.deleteProperty(target, key)
  }
})

proxy.foo = 'zzz'
delete proxy.foo
```

这里通过 Proxy 代理 target 对象，在创建 Proxy 对象时，传入了第二个参数，它是一个对象，叫处理器或者监听器，get、set、deleteProperty 分别可以监听对属性的访问、赋值、删除操作。在获取和设置值的时候使用了 Reflect，Reflect 是 ES6 新增的成员

### 2、响应式原理 reactive

reactive 函数接收一个参数，在 reactive 中首先需要判断这个参数是否是对象，如果不是的话则返回，reactive 只能把对象转换成响应式对象，这与 Ref 不同，然后创建 Proxy 拦截器对象 hander，里面包含 get/set/deleteProperty 这些拦截的方法，最后创建并返回 Proxy 对象；

在 reactivity 中创建 index.js,以及 index.html

```js
// 判断是否是对象
const isObject = val => val !== null && typeof val === 'object';

export function reactive(target) {
  if (!isObject(target)) return target;
  const handler =  {
    get (target, key, receiver) {
	...
    },
    set (target, key, value, receiver) {
	...
    },
    deleteProperty (target, key) {
    ...
    }
  }
  return new Proxy(target, handler)
}
```

ok, reactive 整体的结构就是这样的，现在我们来一步一步实现 get、set、deleteProperty 方法

在 get 方法中首先要去收集依赖，返回 target 对应的值，通过 Reflect.get 来获取，如果当前的 key 对应的值也是对象，那么我们还需要将它转换成响应式对象，如果对象中有嵌套属性的话，会在 get 中递归收集下一级属性的依赖，通过判断 result 是否是对象，如果是的话，需要调用 reactive 来处理，定义 convert 来处理。

set 方法首先需要获取 key 的值，通过 Reflect.get 来获取 key 的值，用来判断当前传入的值和新值跟 oldValue 是否相等，相同不作处理，不同这则需要调用 Reflect.set 修改值并去触发更新。

deleteProperty 首先判断在当前的 target 中是否有自己的 key 属性，通过 hasOwnProperty 来判断， 如果有 key 属性，并且把 key 从 target 成功删除后，再来触发更新，返回是否删除成功。

```js
// 判断是否是对象
const isObject = (val) => val !== null && typeof val === "object";
const convert = (target) => (isObject(target) ? reactive(target) : target);
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (target, key) => hasOwnProperty.call(target, key);

export function reactive(target) {
  if (!isObject(target)) return target;
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      return convert(result);
    },
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver);
      let result = true;
      if (oldValue !== value) {
        Reflect.set(target, key, value, receiver);
        // 触发更新
        console.log("set", key, value);
      }
      return result;
    },
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      const result = Reflect.deleteProperty(target, key);

      if (hadKey && result) {
        // 触发更新
        console.log("delete", key);
      }
      return result;
    },
  };
  return new Proxy(target, handler);
}
```

```html
// index.html // 测试一下
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue3.0响应式原理</title>
  </head>
  <body>
    <script type="module">
      import { reactive } from "./index.js";
      const obj = reactive({
        name: "大白菜",
        age: 18,
      });
      obj.name = "大白菜321";
      delete obj.age;
      console.log(obj);
    </script>
  </body>
</html>
```

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a115b1a4ddb5499ba8673d4af8f78616~tplv-k3u1fbpfcp-watermark.image)

### 3、收集依赖

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f001dffdb5ef484da5d406c4639ce127~tplv-k3u1fbpfcp-watermark.image)

#### 4、响应式系统原理 effect 和 track

effect 函数

```js
let activeEffect = null;
export function effect(callback) {
  activeEffect = callback;
  callback(); // 访问响应式对象的属性,在这个过程中去收集依赖
}
```

effect 接收一个函数作为参数,在 effect 函数中首先要执行 callback，在 callback 中会访问响应式对象的属性，定义
activeEffect 将 callback 保存，当依赖收集完毕之后，需要将 activeEffect 设置为 null

track 函数

track 函数接收两个参数，目标对象 target，需要跟踪的属性 key，内部需要将 target 保存在 targetMap 中，通过 weackMap 创建一个 targetMap，在内部首先需要判断 activeEffect，如果值为 null 直接返回，说明当前没有要收集依赖，否则需要去 targetMap 中根据当前的 target 找 depsMap，接这判断是否存在 depsMap，不存在则为当前的 target 创建一个对应的 depsMap，去存储 键 和 dep 对象，也就是执行的 effect 函数。最后在 reactive 代理对象中的 get 调用这个函数 track，

```js
let targetMap = new WeakMap();

export function track(target, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  dep.add(activeEffect);
}
```

reactive 函数

```js
// reactive 函数
const handler =  {
  get (target, key, receiver) {
    // 收集依赖
    track(target, key)
    ...
  }
}
```

### 5、触发更新 trigger

在 trigger 函数中，需要根据 target 去 targetMap 中找到 depsMap，在 depsMap 存储的是 属性以及对应的 dep 集合，dep 集合中存储的是 这个 key 对应的 effect 函数，遍历每一个 effect 函数。在 reactive 函数中的 set deleteProperty 调用 trigger 函数触发更新

````js
// 在代理对象中调用这个函数, reactive get
// ```js
// track(target, key)
// ```
// 根据target Map
// 在 reactive set 中触发更新 调用trigger， deleteProperty 调用

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach((effect) => {
      effect();
    });
  }
}
````

在 reactive 函数中调用 trigger 函数

```js
const handler =  {
  ...
  set (target, key, value, receiver) {
    const oldValue = Reflect.get(target, key, receiver);
    let result = true
    if (oldValue !== value) {
      Reflect.set(target, key, value, receiver);
      // 触发更新
      trigger(target, key)
    }
    return result
  },
  deleteProperty (target, key) {
    const hadKey = hasOwn(target, key);
    const result = Reflect.deleteProperty(target, key)

    if (hadKey && result) {
      // 触发更新
      trigger(target, key)
    }
    return result
  }
}
```

测试一下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="module">
      import { reactive, effect, computed } from "./index.js";

      const product = reactive({
        name: "iPhone",
        price: 5000,
        count: 3,
      });

      let total = 0;

      effect(() => {
        total = product.price * product.count;
      });

      console.log(total);

      product.price = 4000;
      console.log(total);

      product.count = 1;
      console.log(total);
    </script>
  </body>
</html>

// 15000 // 12000 // 4000
```

### 6、响应式原理 ref

ref 接收一个参数，可以是原始值和对象，如果传入的是对象，并且是 ref 创建的对象，则直接返回，如果是普通对象，在 ref 内部会调用 reactive 创建响应式对象，否则创建一个只有 value 属性的对象，最后返回。

```js
export function ref(raw) {
  // 判断 raw 是否是 ref 创建的对象,如果是的话直接返回
  if (isObject(raw) && raw.__v_isRef) {
    return;
  }
  let value = convert(raw); // 判断raw 是否是一个对象，如果是调用reactive 转换成响应式对象，否则返回本身

  const r = {
    __v_isRef: true,
    get value() {
      track(r, "value"); // 调用track 收集依赖
      return value;
    },
    set value(newValue) {
      // 判断新值和旧值是否相等，不相等存储在raw 中
      if (newValue !== value) {
        raw = newValue;
        value = convert(raw);
        trigger(r, "value");
      }
    },
  };
  return r;
}
```

测试一下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="module">
      import { reactive, effect, ref } from "./index.js";

      const price = ref(5000);
      const count = ref(3);

      let total = 0;

      effect(() => {
        total = price.value * count.value;
      });

      console.log(total);

      price.value = 4000;
      console.log(total);

      count.value = 1;
      console.log(total);
    </script>
  </body>
</html>

// 15000 // 12000 // 4000
```

**reactive 和 ref** 的区别

- ref 可以把基本数据类型数据,转成响应式对象
- ref 返回的对象,重新赋值成对象也是响应式的
- reactive 返回的对象,重新赋值丢失响应式
- reactive 返回的对象不可以解构

如果一个对象成员非常多的时候,使用 ref 并不方便，因为总要带着 value 属性，如果一个函数内部只有一个响应式数据，这个时候使用 ref 会比较方便,因为可以解构返回。

### 7、响应式原理 toRefs

toRefs 接收一个 reactive 返回的响应式对象，也就是 proxy 对象，如果传入的参数不是 reactive 创建的响应式对象，则直接返回，然后把传入对象的所有属性转换成类似与 ref 返回的对象，把转换后的属性挂载到一个新的对象上返回。

```js
export function toRefs(proxy) {
  const ret = proxy instanceof Array ? new Array(proxy.length) : {};
  // 遍历所有 proxy 属性
  for (const key in proxy) {
    ret[key] = toProxyRef(proxy, key);
  }
  return ret;
}

function toProxyRef(proxy, key) {
  const r = {
    __v_isRef: true,
    get value() {
      return proxy[key]; // 访问的是响应式对象
    },
    set value(newValue) {
      proxy[key] = newValue;
    },
  };
  return r;
}
```

测试一下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="module">
      import { reactive, effect, toRefs } from "./index.js";

      function useProduct() {
        const product = reactive({
          name: "大白菜",
          price: 5000,
          count: 3,
        });
        return toRefs(product);
      }

      const { price, count } = useProduct();

      let total = 0;

      effect(() => {
        total = price.value * count.value;
      });

      console.log(total);

      price.value = 4000;
      console.log(total);

      count.value = 1;
      console.log(total);
    </script>
  </body>
</html>

// 15000 // 12000 // 4000
```

### 8、响应式原理 computed

computed 接收一个有返回值的函数参数，这个函数返回值就是计算属性的值，需要监听这个函数内部使用的响应式数据的变化，最后把函数执行结果返回，computed 内部会通过 effect 监听 getter 内部响应式数据变化，因为在 effect 中执行 getter 时访问响应式数据属性会收集依赖，当数据变化后，会重新执行 effect 函数，把 getter 的结果在存储到 result 中。

```js
export function computed(getter) {
  const result = ref();
  effect(() => (result.value = getter()));
  return result;
}
```

测试一下

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script type="module">
    import { reactive, effect, computed } from './index.js'

    const product = reactive({
      name: '大白菜',
      price: 5000,
      count: 3
    })

    let total = computed(() => {
      return product.price * product.count
    })

    console.log(total.value)

    product.price = 4000
    console.log(total.value)

    product.count = 1
    console.log(total.value)

  </script>
</body>
</html>


// 15000
// 12000
// 4000
```

### 9、完整代码

````js
const isObject = (val) => val !== null && typeof val === "object";

const convert = (target) => (isObject(target) ? reactive(target) : target);
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (target, key) => hasOwnProperty.call(target, key);

export function reactive(target) {
  if (!isObject(target)) return target;

  const handler = {
    get(target, key, receiver) {
      // 收集依赖
      track(target, key);
      const result = Reflect.get(target, key, receiver);
      return convert(result);
    },
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver);
      let result = true;
      if (oldValue !== value) {
        Reflect.set(target, key, value, receiver);
        // 触发更新
        trigger(target, key);
      }
      return result;
    },
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      const result = Reflect.deleteProperty(target, key);

      if (hadKey && result) {
        // 触发更新
        trigger(target, key);
      }
      return result;
    },
  };
  return new Proxy(target, handler);
}

// effect
let activeEffect = null;

export function effect(callback) {
  activeEffect = callback;
  callback(); // 访问响应式对象的属性,在这个过程中去收集依赖
  activeEffect = null;
}

// tarck 函数接收两个参数 target, key, 将target 存储到targetMap中
//
let targetMap = new WeakMap();

export function track(target, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  dep.add(activeEffect);
}

// 在代理对象中调用这个函数, reactive get
// ```js
// track(target, key)
// ```
// 根据target Map
// 在 reactive set 中触发更新 调用trigger， deleteProperty 调用

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach((effect) => {
      effect();
    });
  }
}

export function ref(raw) {
  // 判断 raw 是否是 ref 创建的对象,如果是的话直接返回
  if (isObject(raw) && raw.__v_isRef) {
    return;
  }
  let value = convert(raw);

  const r = {
    __v_isRef: true,
    get value() {
      track(r, "value");
      return value;
    },
    set value(newValue) {
      if (newValue !== value) {
        raw = newValue;
        value = convert(raw);
        trigger(r, "value");
      }
    },
  };

  return r;
}

export function toRefs(proxy) {
  const ret = proxy instanceof Array ? new Array(proxy.length) : {};
  // 遍历所有 proxy 属性
  for (const key in proxy) {
    ret[key] = toProxyRef(proxy, key);
  }
  return ret;
}

function toProxyRef(proxy, key) {
  const r = {
    __v_isRef: true,
    get value() {
      return proxy[key]; // 访问的是响应式对象
    },
    set value(newValue) {
      proxy[key] = newValue;
    },
  };
  return r;
}

export function computed(getter) {
  const result = ref(); // 默认返回undefined
  effect(() => (result.value = getter()));
  return result;
}
````

ok，到这里，我们模拟实现了 Vue3.0 中的响应式原理 reactive / ref / toRefs / computed 函数的内部实现，还实现了依赖收集和触发更新的 effect、track、trigger 函数。

### 最后

感谢您花宝贵的时间阅读这篇内容,如果你觉得这篇内容对你有帮助的话,就给本文点个赞吧，
（感谢掘友的鼓励与支持 🌹🌹🌹）
