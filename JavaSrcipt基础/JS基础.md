### 1、如何在 ES5 环境下实现 let

```js
// 原代码
for (let i = 0; i < 10; i++) {
  console.log(i);
}

console.log(i);
```

```js
// babel 转换后
for (var _i = 0; _i < 10; _i++) {
  console.log(_i);
}

console.log(i);
```

### 3、手写 Call

```js
Function.prototype.myCall = function (thisArg, ...args) {
  thisArg.fn = this;

  return thisArg.fn(...args);
};

// 优化

Function.prototype.myCall = function (thisArg, ...args) {
  const fn = Symbol("fn");

  thisArg = thisArg || window;
  thisArg[fn] = this;
  const result = thisArg[fn](...args);
  delete thisArg[fn];
  return result;
};

// ceshi

foo.myCall(obj);
```

### 实现 Apply

```js
Function.prototype.myApply = function(thisArg, args) {
  const fn = Symbol('fn')

  thisArg = thisArg || window

  thisArg[fn] = this

  const result = thisArg[fn][...args]
  delete thisArg[fn]
  return result
}
```

### 实现一个节流函数

> 防抖，即短时间内大量触发同一事件，只会执行一次函数，实现原理为设置一个定时器，约定在 xx 毫秒后再触发事件处理，每次触发事件都会重新设置计时器，直到 xx 毫秒内无第二次操作，防抖常用于搜索框/滚动条的监听事件处理，如果不做防抖，每输入一个字/滚动屏幕，都会触发事件处理，造成性能浪费。

```js
function debounce(func, wait) {
  let timeout = null;
  return function () {
    let context = this;
    let args = arguments;
    if (timeout) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
```

### 实现一个节流

```js
function throttle(func, wait) {
  let timeout = null;
  return function () {
    let context = this;
    let args = arguments;
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        fn.apply(context, args);
      }, wait);
    }
  };
}

function throttle(func, wait) {
  let prev = 0;
  return function () {
    let context = this;
    let now = Date.now();
    let args = arguments;
    if (now - prev > wait) {
      func.apply(context, args);
      prev = now;
    }
  };
}
```

### 数组扁平化

对于[1, [1,2], [1,2,3]]这样多层嵌套的数组，我们如何将其扁平化为[1, 1, 2, 1, 2, 3]这样的一维数组呢

1、ES6 的 flat

```js
const arr = [1, [1, 2], [1, 2, 3]];

console.log(arr.flat(Infinity));
```

2、序列化正则

```js
const arr = [1, [1, 2], [1, 2, 3]];

const str = `[${JSON.stringify(arr).replace(/(\[|\])/g, "")}]`;

JSON.parse(str);
```

3、递归

```js
const arr = [1, [1, 2], [1, 2, 3]];

function flat(arr) {
  let result = [];
  for (const item of arr) {
    item instanceof Array
      ? (result = result.concat(flat(item)))
      : result.push(item);
  }
  return result;
}

console.log(flat(arr));
```

### 4、reduce

```js
const arr = [1, [1, 2], [1, 2, 3]];

function flat(arr) {
  return arr.reduce((prev, cur) => {
    return prev.concat(cur instanceof Array ? flat(cur) : cur);
  }, []);
}

flat(arr);
```

### 5、迭代 + 展开运算符

```js
const arr [1, [2,4], [5]]

while(arr.some(Array.isArray) => {
  arr = [].concat(...arr)
})
console.log(arr)
```

### new 的实现

```js
function objectFactory() {
  let obj = new Object();

  Constructor = [].shift().call(arguments);

  obj.__proto__ = Constructor.prototype;

  let result = Constructor.apply(obj, arguments);

  return typeof result === "object" ? result : obj;
}

function myNew(foo, ...args) {
  let obj = Object.create(foo.prototype);

  let result = obj.apply(obj, args);

  return Object.prototype.toString.call(result) === "[object Object]"
    ? result
    : obj;
}
```

### ES5 实现继承

原型链继承

```js
function Person() {
  this.name = "大白菜";
}

Person.prototype.getName = function () {
  return this.name;
};

function Child() {}

Child.prototype = new Person();

Child.prototype.constructor = Child;

const child = new Child();

child.name;

child.getName();
```

> 原型继承的缺点

- 由于所有 Child 实例原型都指向同一个 Parent 实例, 因此对某个 Child 实例的父类引用类型变量修改会影响所有的 Child 实例
- 在创建子类实例时无法向父类构造传参, 即没有实现 super()的功能

### 构造函数继承

构造函数继承，即在子类的构造函数中执行父类的构造函数，并为其绑定子类的 this，让父类的构造函数把成员属性和方法都挂到子类的 this 上去，这样既能避免实例之间共享一个原型实例，又能向父类构造方法传参

```js
function Person(name) {
  this.name = [name];
}

Person.prototype.getName = function () {
  return this.name;
};

function Child() {
  Person.call(this, "张三");
}

// 测试
const child = new Child();

const child2 = new Child();

child.name[0] = "foo";
console.log(child.name);

console.log(child2.name);

console.log(child.getName);
```

缺点

继承不到父类原型上的属性和方法

### 寄生组合继承

```js
function Parent(name) {
  this.name = [name];
}
Parent.prototype.getName = function () {
  return this.name;
};
function Child() {
  // 构造函数继承
  Parent.call(this, "zhangsan");
}
//原型链继承
Child.prototype = new Parent();
Child.prototype.constructor = Child;

//测试
const child1 = new Child();
const child2 = new Child();
child1.name[0] = "foo";
console.log(child1.name); // ['foo']
console.log(child2.name); // ['zhangsan']
child2.getName(); // ['zhangsan']
```

### 寄生组合式继承

为了解决构造函数被执行两次的问题, 我们将指向父类实例改为指向父类原型, 减去一次构造函数的执行

```js
function Parent(name) {
  this.name = [name];
}
Parent.prototype.getName = function () {
  return this.name;
};
function Child() {
  // 构造函数继承
  Parent.call(this, "zhangsan");
}
//原型链继承
// Child.prototype = new Parent()
Child.prototype = Parent.prototype; //将`指向父类实例`改为`指向父类原型`
Child.prototype.constructor = Child;

//测试
const child1 = new Child();
const child2 = new Child();
child1.name[0] = "foo";
console.log(child1.name); // ['foo']
console.log(child2.name); // ['zhangsan']
child2.getName(); // ['zhangsan']
```
