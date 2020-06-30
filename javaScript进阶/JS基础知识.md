##原型

每个对象都有一个 __proto__ 属性指向了原型

```

function Student (name, grade) {
    this.name = name
    this.grage = grade
}

const stu = new Student('xiaoMing', 15)

console.log(stu.__proto__)
```

#### new 的过程
- 创建一个新对象
- 链接到原型
- 绑定this
- 返回新对象
```
let obj = { age: 25}
conosole.log(obj)

function create () {
    // 创建一个空对象
    let obj = new Object()
    // 获得构造函数
    let Con = [].shift.call(arguments)
    // 链接到原型
    obj.__proto__ = Con.prototype
    // 绑定this
    let result = Con.apply(obj, argumens)
    // 返回新对象
    return typeof result === 'object' ? result : obj
}
```

#### ES5实现const
```javascript
function _const(key, value) {
  const desc = {
    value:,
    writable: false,
  }
  Object.definePrototype(window, key, desc)
}

_const('obj',{a: 1})
obj.b = 2
obj = {}
```