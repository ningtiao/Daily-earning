

```javascript
// 原型链向上查找
function myInstanceOf(left, right) {
  if (left !== 'object' || left === null) return false;
  // getProtypeOf是Object对象自带的一个方法,能够拿到参数的原型对象
  let proto = Object.getProtypeOf(left)

  while(true) {
    if (proto === null) return false;
    if (proto === right.prototype) return true;
    proto = Object.getProtypeOf(proto)
  }
}

// console.log(myInstanceOf("11", String)) // false
// console.log(myInstanceOf(new String('222'))) // true
```