### let const 不存在变量提升
* 暂死性区域

```
var tmp = 123
if(true) {
    tmp = 'abc' //ReferenceError
    let tmp 
}
```
上面的代码中存在全局变量 trnp，但是块级作用域内 let 又声明了一个局部变量 trnp，导 致后者绑定这个块级作用域，所以在 let 声明变量前，对 tmp 赋值会报错
### 不允许重复声明
* let 不允许在相同作用域内重复声明同一个变量
```
function foo() {
    let a = 10;
    var a = 10
}
foo() // 报错
```
* 块级作用域
ES5 只有全局作用域和函数作用域，没有块级作用域，这导致很多场景不合理。
第一种场景，内层变量可能会覆盖外层变量


```
var tmp = new Date();
function f() {
    console.log(tmp);
    if(false) {
        var tmp = 'Hello word'
    }
}
f() // undefined
```
* const 声明一个只读的常量。 一旦声明，常量的值就不能改变。
```
const PI = 3 .1415
PI // 3.1415
PI = 3; II TypeError: Assignment to constant variable
```
### 数组解构
* 以前，为变量赋值只能直接指定值

```
let a = 1
let b = 2
let c = 3
let [a, b, c] = [1,2,3]
```
* 对象的解构赋值,解构不仅可以用于数组，还可以用于对象。
```
let { foo, bar} = {foo: 'aaa', bar : 'bbb'}
foo // aaa
bar // bbb
```
* 对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值是由它的 位置决定的：而对象的属性没有次序，变量必须与属性同名才能取到正确的值
与数组一样，解构也可以用于嵌套结构的对象


```
let obj = {
    p: [
    'Hello',
        {y: 'Word'}
    ]
}

let ( p: [x, ( y }] ) =obj

x // Hello
y // Word
```
### 字符串解构

```
const [a,b,c,d,e] = 'Hello'
H
e
l
l
o
```
### 数值和布尔值的解构赋值

```
let {toString: s} = 123; 
s === Number .prototype.toString // true 
let {toString: s} = true; 
s === Boolean.prototype.toString // true 
```
### 遍历 Map 结构
任何部署了 Iterator 接口的对象都可以用 for ... of 循环遍历。 Map 结构原生支持 Iterator 接口，配合变量的解构赋值获取键名和键值就非常方便

```
var map= new Map()
map.set ('first','hello')
map.set ('second','world'); 
for (let [key, value) of map){ 
    console.log(key + 'is' + value)
}
// first is hello // second is world 
```
### 模板字符串


```
const name = 'Tom'
const age = `20`
const mag =  `Hi, ${name} ${age}`
```
### 展开数组运算符...

```
const arr = ['aaa', 'bbb', 'ccc']
console.log(...arr) // aaa bbb ccc
```
### 箭头函数

```
const arr = [1, 2, 3, 4, 5, 6]
arr.filter(i => i % 2)

// 箭头函数不会改变 this 指向
var foo = {
    name: 'dabaicai',
    getName: () => {
        conosle.log(this.name)
    }
}
```
### Proxy
* ES6原生提供了Proxy构造函数，用来生成Proxy实例。

```
var proxy = new Proxy(target, handler);
```
监听属性读取

```
const person = {
  name: 'zce',
  age: 20
}

const personProxy = new Proxy(person, {
  // 监视属性读取
  get (target, property) {
    return property in target ? target[property] : 'default'
    // console.log(target, property)
    // return 100
  },
  // 监视属性设置
  set (target, property, value) {
    if (property === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError(`${value} is not an int`)
      }
    }

    target[property] = value
    // console.log(target, property, value)
  }
})

personProxy.age = 100

personProxy.gender = true

console.log(personProxy.name)
console.log(personProxy.xxx)
```
* Object.definedProerty()

```
const person = {
  name: 'zce',
  age: 20
}

const personProxy = new Proxy(person, {
  deleteProperty (target, property) {
    console.log('delete', property)
    delete target[property]
  }
})
 delete personProxy.age
 console.log(person)
```
#### Proxy 对比 Object.defineProperty()
* Proxy 可以监视读写以外的操作
* Proxy 可以很方便的监视数组操作
* Proxy 不需要侵入对象 

### Promise
  基本实例
  * Promise.resolve
```
const MyPromise = new Promise((resolve, reject)=>{
    resolve('555')
})

MyPromise.then((res) => {
    console.log(res) // 555
})
```
返回一个状态已变成 resolved 的 Promise 对象。

* Promise.reject
> 返回的 promise 对象的状态为 rejected
* Promise.then
> 实例方法，为 Promise 注册回调函数
* Promise.catch
> 实例方法，捕获异常
* Promise.race
> 类方法，多个 Promise 任务同时执行，返回最先执行结束的 Promise 任务的结果，不管这个 Promise 结果是成功还是失败
* Promise.all
> 类方法，多个 Promise 任务同时执行。
如果全部成功执行，则以数组的方式返回所有 Promise 任务的执行结果。 如果有一个 Promise 任务 rejected，则只返回 rejected 任务的结果。

 Promise.all 应用

```
let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Hello')
    }, 10);
})

let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('lagou')
    }, 10);
})

let p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('I love you')
    }, 10);
})

Promise.all([p1, p2, p3]).then(([a, b, c]) => {
    console.log(a + b + c) // Hello lagou I love you
})
```

### Async / Await 语法糖
Async为JavaScript 对于异步操作有了终极解决方案
`async `函数是 Generator 函数的语法糖。使用 关键字 async 来表示，在函数内部使用 await 来表示异步

```
 async function getUserByAsync(){
    let user = await fetchUser();
    return user;
 }
getUserByAsync()
.then(v => console.log(v));
```
* Ansnc错误处理
```
async function main () {
  try {
    const users = await ajax('/api/users.json')
    console.log(users)

    const posts = await ajax('/api/posts.json')
    console.log(posts)

    const urls = await ajax('/api/urls.json')
    console.log(urls)
  } catch (e) {
    console.log(e)
  }
}
```