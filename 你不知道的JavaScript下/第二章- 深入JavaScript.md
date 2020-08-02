### 2.1值与类型
- string, number, Boolean, null, undefined, Object, BigInt
- JavaScript提供了一个typeof运算符用来检测类型
```js
var a;
console.log(typeof a); // "undefined"

a = 'Hello word'
console.log(typeof a); // "string"

a = 42;
console.log(typeof a); // "number"

a = true;
console.log(typeof a); // "boolean"

a = null;
console.log(typeof a); // "object"

a = {b: "c"};
console.log(typeof a); // "object"
```

### 2.1.2 内置类型方法
```js
var a = "hello world";
var b = 3.14159;
a.length; // 11
a.toUpperCase(); // "HELLO WORLD"
b.toFixed(4); // "3.1416"
```

### 2.1.3值的比较
在不同情况下应该使用 == 还是 ===

- 如果要比较的两个值的任意一个(即一边)可能是 true 或者 false 值，那么要避免使 用 ==，而使用 ===。
- 如果要比较的两个值中的任意一个可能是特定值(0、"" 或者 []——空数组)，那么避 免使用 ==，而使用 ===。
- 在所有其他情况下，使用 == 都是安全的。不仅仅只是安全而已，这在很多情况下也会 简化代码，提高代码的可读性。

```js
var a = [1,2,3];
var b = [1,2,3];
var c = "1,2,3";
a == c; // true
b == c; // true
a == b; // false
```

### 2.5.2 闭包
可以将闭包看作“记忆”并在函数运行完毕后继续访问这个函数作用域(其变量)的一 种方法

```js
function makeAdder(x) {
  // 参数x是一个内层变量
  // 内层函数add()使用x，所以它外围有一个“闭包”
  function add(y) {
    return y + x;
  };
  return add;
}
//  plusOne获得指向内层add(..)的一个引用
// 带有闭包的函数在外层makeAdder(..)的x参数上
var plusOne = makeAdder( 1 );
// plusTen获得指向内层add(..)的一个引用
// 带有闭包的函数在外层makeAdder(..)的x参数上
var plusTen = makeAdder( 10 );
plusOne( 3 ); // 4 <-- 1 + 3 
plusOne( 41 ); // 42 <-- 1 + 41
plusTen( 13 ); // 23 <-- 10 + 13
```
这段代码是如何执行的。

- (1) 调用 makeAdder(1) 时得到了内层 add(..) 的一个引用，它会将 x 记为 1。我们将这个函 数引用命名为 plusOne()。
- (2) 调用 makeAdder(10) 时得到了内层 add(..) 的另一个引用，它会将 x 记为 10，我们将这 个函数引用命名为 plusTen()。
- (3) 调用 plusOne(3) 时，它会向 1(记住的 x)加上 3(内层 y)，从而得到结果 4。
- (4) 调用 plusTen(13) 时，它会向 10(记住的 x)加上 13(内层 y)，从而得到结果 23。

### 2.6 this标识符

```js
function foo() {
  console.log( this.bar );
}
var bar = "global";
var obj1 = { 
  bar: "obj1",
  foo: foo
};
var obj2 = { 
  bar: "obj2"
};
// --------
foo(); // “全局的”
obj1.foo(); // "obj1"
foo.call( obj2 ); // "obj2"
new foo(); // undefined
```
关于如何设置 this 有 4 条规则，上述代码中的最后 4 行展示了这 4 条规则。

- (1) 在非严格模式下，foo() 最后会将 this 设置为全局对象。在严格模式下，这是未定义的 行为，在访问 bar 属性时会出错——因此 "global" 是为 this.bar 创建的值。
- (2) obj1.foo() 将 this 设置为对象 obj1。
- (3) foo.call(obj2) 将 this 设置为对象 obj2。
- (4) new foo() 将 this 设置为一个全新的空对象。