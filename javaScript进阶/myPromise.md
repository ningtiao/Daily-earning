### Promise核心实现
- Promise就是一个类,在执行这个类的时候,需要传递一个执行器进去,执行器会立即执行
- Promise中有三种状态,分别为 成功 fulfilled,失败 rejected, 等待 pending, 
- pending -> fulfilled, pending -> rejected, 一旦状态确定就不可更改
- resolve 和reject函数是用来更改状态的 resolve: fulfilled, reject: rejected
- then方法内部做的事情就是判断状态,如果状态是成功,调用成功的回调函数,如果状态是失败,调用失败的函数,then方法是被定义在原型对象上的
- then成功回调有一个参数,表示成功之后的值,then失败回调有一个参数,表示失败后的原因
```js
new Promise((resolve,reject) => {

})
```
### 在promise中加入异步逻辑
```js
let promise = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('大白菜')
  }, 2000)
})

// 成功回调
successCallback = undefined;
// 失败后的回调
faliCallback = undefined;

resolve = value => {
  // 判断成功回调是否存在,如果存在 调用
  this.successCallback && this.successCallback(this.value)
}
reject = reason => {
  // 判断失败回调是否存在,如果存在则调用
  this.faliCallback && this.faliCallback(this.reason)
}

then (successCallback, faliCallback) {
  // 判断状态
  if (this.status === FULFILLED) {
    successCallback(this.value)
  } else if (this.status === REJECTED) {
    faliCallback(this.reason);
  } else {
    // 等待
    // 将等待回调和失败回调存储起来
    this.successCallback = successCallback;
    this.faliCallback = faliCallback;
  }
}

```
### 实现then 方法多次调用添加多个处理函数
- 分同步和异步情况处理
- 如果是同步直接调用回调函数,如果是异步,需要将回调函数存储起来
- 首先把成功回调和失败回调的值变成数组
- 接着将成功回调和失败回调使用push方法把成功回调push进数组
- 当promise的状态变成成功或者失败时,我们需要依次调用数组中的回调函数
- 当成功回调的数组长度不等于0,就有回调函数,while 循环从前往后执行调用shift()方法,每执行一个删除一个,直到数组长度为0
```js
successCallback = [];
failCallback = [];

// 将原来代码修改为
// this.successCallback && this.successCallback(this.value);
while (this.successCallback.length) this.successCallback.shift()(this.value);
// this.faliCallback && this.faliCallback(this.reason);
while (this.faliCallback.length) this.faliCallback.shift()(this.reason);

// 测试一下
let promise = new myPromise((resolve, reject) => {
  // resolve('大白菜～～')
  // reject('失败')
  setTimeout(() => {
    resolve('setTimeout 大白菜～')
  }, 2000)
})
promise.then(value => {
  // 大白菜
  console.log(value)
}, reason => {
  // 失败
  console.log(reason)
})

promise.then(value => {
  // 大白菜
  console.log(value)
}, reason => {
  // 失败
  console.log(reason)
})
// 大白菜
// 大白菜
```
### 实现then方法链式调用
- promise的then方法是可以链式调用的,后面的then方法回调函数拿到的值实际上是拿到上一个then方法回调函数的返回值
- 实现then方法的链式调用, then方法是promise对象下面的,如果要实现链式调用,那么每一个then方法都应该返回一个promise对象
- 创建一个promise对象

**注意**
在链式调用then方法的时候,回调函数可以返回一个普通值,和一个promise对象

如果返回的是普通值,我们可以直接调用resolve(x)把这个普通值传递给下一个promise对象

如果是promise对象的话,我们需要查看返回的promise对象状态,如果状态是成功的,我们需要调用resolve方法,把成功的状态传递给它,
如果是失败的,需要把reject传递给下一个promise对象
```js
// 改造then方法
then (successCallback, faliCallback) {
  let promise2 = new myPromise((resolve, reject) => {
    // 判断状态
    if (this.status === FULFILLED) {
      let x = successCallback(this.value);
      // 判断x的是是普通值还是promise对象
      // 如果是普通值, 直接调用resolve
      // 如是是promise对象 查看promise对象返回的结果
      // 在根据promise对象返回的结果 决定调用resovle还是reject
      resolvePromise(x, resolve, reject)
      // resolve(x)
    } else if (this.status === REJECTED) {
      faliCallback(this.reason);
    } else {
      // 等待
      // 将等待回调和失败回调存储起来
      this.successCallback.push(successCallback);
      this.faliCallback.push(faliCallback);
    }
  });
  return promise2;
}

// 定义resolvePromise方法
function resolvePromise(x, resolve, reject) {
  if (x instanceof myPromise) {
    // promise对象
    x.then(resolve, reject);
  } else {
    // 普通值
  }
}

// 测试一下
let promise = new myPromise((resolve, reject) => {
  resolve('大白菜～～')
  // reject('失败')
  // setTimeout(() => {
  //   resolve('setTimeout 大白菜～')
  // }, 2000)
})

function other () {
  return new myPromise((resolve, reject) => {
    resolve('other');
  })
}
promise.then(value => {
  console.log(value);
  return other();
}).then(value => {
  console.log(value)
})
// 大白菜
// other
```

### Promise then方法链式调用识别Promise对象自动返回
当链式调用promise 对象下面的then方法的时候, 在then方法回调函数中可以返回promise 对象,但我们需要考虑另外一种情况,在then方法回调函数中不能返回当前这个then方法他所返回的promise对象, 如果返回了then方法返回的promise对象,就会发生循环调用。

**示例**
```js
let promise = new Promise((resolve, reject) => {
  resolve('大白菜')
})

let p1 = promise.then((value) => {
  console.log(value)
  return p1
})
// 报错
// TypeError: Chaining cycle detected for promise #<Promise>
```

**解决**

- 在then方法中返回的 promise 对象就是promise 2
- 那么成功的回调 返回的promise对象就是 x
- 判断 peomise2 与 x 是否相等,
- 相等就是自己返回了自己, 需要将状态放到reject

**改造代码**
```js
// 将then方法里面改造成异步代码加入setTimeout()
setTimeout(() => {
  // 执行成功调用成功回调函数,拿到返回值
  let x = successCallback(this.value);
  resolvePromise(promise2, x, resolve, reject)
}, 0)


// 改造resolvePromise方法
function resolvePromise (promise2, x, resolve, reject) {
  // 判断是否相等
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if (x instanceof MyPromise) {
    // promise 对象
    x.then(resolve, reject)
  } else {
    // 普通值
    resolve(x)
  }
}
```
**测试一下**
```js

let promise = new MyPromise((resolve, reject) => {
  resolve('大白菜')
})

let p1 = promise.then((value) => {
  console.log(value)
  return p1
})
p1.then((value) => {
    console.log(value)
}, (err) => {
    console.log(err)
})
// 大白菜
// Chaining cycle detected for promise #<Promise>
```
### 捕获错误及then链式调用其他状态
- 在执行构造器中加入try catch
```js
constructor (executor) {
  try {
    executor(this.resolve, this.reject)
  } catch (e) {
    this.reject(e);
  }
}

// 测试一下

let promise = new myPromise((resolve, reject) => {
  throw new Error('executor error')
})

promise.then(value => {
  console.log(value)
}, reason => {
  console.log(reason.message)
})

// 成功捕获错误 excutor error
```

- then 回调函数捕获错误
```js
// 在then方法的setTimeout 中添加try catch
setTimeout(() => {
  try {
    let x = successCallback(this.value);
    resolvePromise(promise2, x, resolve, reject)
  } catch (e) {
    reject(e)
  }
}, 0)

// 测试
let promise = new MyPromise((resolve, reject) => {
  resolve('大白菜')
})

promise.then((value) => {
  console.log(value)
  throw new Error('then error')
}, (err) => {
  console.log(err.message)
}).then((value) => {
  console.log(value)
}, reason => {
  console.log('~~~')
  console.log(reason.message)
})

// 大白菜
// ~~~
// then error
```
**修改失败的地方**

```js
setTimeout(() => {
  try {
    let x = failCallback(this.reason);
    resolvePromise(promise2, x, resolve, reject)
  } catch (e) {
    reject(e)
  }
}, 0)

// 测试一下

let promise = new myPromise((resolve, reject) => {
  reject('失败')
})
promise.then(value => {
  console.log(value)
}, reason => {
  console.log(reason)
  return '大白菜～～';
}).then(value => {
  console.log(value)
})
// 失败
// 大白菜～～
```
**当是异步的时候**

将原来的代码改成

```js
this.successCallback.push(successCallback);
this.failCallback.push(failCallback);


this.successCallback.push(() => {
  setTimeout(() => {
    try {
      let x = successCallback(this.value);
      resolvePromise(promise2, x, resolve, reject)
    } catch (e) {
      reject(e)
    }
  }, 0)
})
this.failCallback.push(() => {
  setTimeout(() => {
    try {
      let x = failCallback(this.reason);
      resolvePromise(promise2, x, resolve, reject)
    } catch (e) {
      reject(e)
    }
  }, 0)
})

// 然后resolve和reject就不需要传值了
while (this.successCallback.length) this.successCallback.shift()();
while (this.failCallback.length) this.failCallback.shift()();
```
**测试一下**
```js
let promise = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success~~~~');
    // reject('error~~~~')
  }, 2000)
})

promise.then((value) => {
  console.log(value)
  return '米糕';
}, reason => {
  console.log(reason)
  return '大白菜';
}).then((value) => {
  console.log(value);
})
// suceess～～～
// 米糕
```
到这里Promise的核心功能就基本已经实现啦～～～

### 将then方法的参数变成可选参数
- then方法有两个可选参数,一个成功回调,一个失败回调
- 这两个参数都是可选参数,加入遇到一下情况
```js
let promise = new Promise((resolve, reject) => {
  resolve(100)
})
promise
  .then()
  .then()
  .then(value => {
    cosole.log(value)
  })
```
- 在这种情况下, promise 会依次往下传递
- 我们需要在then方法中判断是否有参数,如果不存在就补一个参数,这样状态就可以依次向后传递了

**修改Promise的代码**
在then方法我们判断successCallback和failCallback是否存在
```js
successCallback = successCallback ? successCallback : value => value;
failCallback = failCallback ? failCallback : reason => { throw reason };
```
**测试一下**

```js
let promise = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success');
    // reject('reject');
  }, 2000)
})
promise.then().then().then(value => {
  console.log(value);
}, reason => {
  console.log(reason);
})
// success
// reject
```

### Promise.all实现
- 接收一个数组作为参数填充,在数组中可以填入任意值,包括普通值和Promise对象,数组的顺序一定是得到结果的顺序
- Promise.all 特点在all 中的所有Promise 对象, 如果他的状态都是成功的,那么 all方法就是成功的,如果有一个是失败的, 那么就是失败的
- 利用类 .上all 所以 all 是一个静态方法
- Promise.all 是解决异步并发问题, 允许按照异步代码调用的顺序得到异步代码执行的结果, 由于all 方法是静态方法, all 前面定义 static 关键字, all 方法接收一个数组作为参数, all方法的返回值也是一个Promise 对象, 在Promise 对象中通过循环 传递的数组,在循环的过程判断是普通值,还是Promise 对象, 进行不同的调用
```js
static all(array) {
  let result = []
  let index = 0
  return new myPromise((resolve, reject) => {
    // 执行for 循环有异步操作,循环没有等待异步操作。
    // 如果index 等于 array的length 就调用resolve
    function addData (key, value) {
      result[key] = value;
      index++ 
      if (index === array.length) {
        resolve(result)
      }
    }
    // 需要判断是普通值, 还是Promise 对象
    for (let i = 0; i < array.length; i++) {
      let current = array[i];
      if (current instanceof myPromise) {
        // promise 对象
        current.then(value => addData(i, value), reason => reject(reason) )
      } else {
        // 普通值
        addData(i, array[i])
      }
    }
  })
}
```

**测试一下**
```js
function p1() {
  return new myPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1')
    }, 1000)
  })
}

function p2() {
  return new myPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1')
    }, 1000)
  })
}

myPromise.all(['a', 'b', p1(), p2(), 'c']).then(result => {
  console.log(result)
})

// [ 'a', 'b', 'p1', 'p1', 'c' ]
```
### Promise.resolve 方法实现
- Promise.resolve的作用是将给定的值转换为Promise 对象, 也就是说Promise.resolve 的返回值就就是一个Promise对象,在返回的Promise 对象中会包裹给定的这个值
- 在resolve 的内部, 会创建一个Promise 对象,并把这个值包裹在Promise对象中,然后把创建出来的Promise 对象最作为resolve的返回值,正是因为这样,我们才能后面进行链式调用then方法, 通过then方法的成功回调函数来拿到这个值, Promise.resolve()也可以接收一个Promise 对象, 在Promise.resolve()内部会判断给定的值是普通值还是 Promise 对象,如果是Promise对象的话,会原封不动把Promise 在作为Promise.resolve的返回值,所以才能在后在调用then方法,通过then方法成功回调函数来拿到Promise对象的返回值

```js
static resolve(value) {
  if (value instanceof myPromise) return value;
  return new myPromise(resolve => resolve(value))
}
```
**测试一下**

```js
function p1() {
  return new myPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1')
    }, 1000)
  })
}

myPromise.resolve('大白菜').then(value => console.log(value))
myPromise.resolve(p1()).then(value => console.log(value))
// 大白菜
// p1
```

### Promise.finally方法实现
**Promise.finally有两个特点**
- 无论当前这个Promise对象最终的状态是成功还是失败,finally方法这个会回调函数始终都会执行一次
- 在finally的后面可以链式调用then 方法来拿到当前这个Promise对象最终返回的结果
```js
finally(callback) {
  return this.then(value => {
    callback();
    return value
  }, reason => {
    callback();
    throw reason
  })
}
```
**测试一下**
```js
function p1() {
  return new myPromise((resolve, reject) => {
    resolve('p1 reject')
    // reject('p1 reject')
  })
}
function p2() {
  return new myPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('p2')
    }, 2000)
  })
}

p1().finally(() => {
  console.log('finally');
  // return p2();
}).then(value => {
  console.log(value);
}, reason => {
  console.log(reason);
})

// finally
// p1 reject
```
- 在finally 的回调函数中,其实可以在return 一个Promise 对象
- return p2后面的then需要等待setTimeout之后执行
- 借助resolve方法
- 如果callback返回的是普通值,转换Promise对象, 等待Promise 对象执行完成,如果返回的是Promise 对象,还等待你执行完成,在返回value
优化上面的代码

```js
finally(callback) {
  return this.then(value => {
    return myPromise.resolve(callback()).then(() => value);
  }, reason => {
    return myPromise.resolve(callback()).then(() => { throw reason },);
  })
}
```
**测试一下**
```js
function p1() {
  return new myPromise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1 resolve')
    }, 2000)
  })
}
function p2() {
  return new myPromise((resolve, reject) => {
    resolve('p2 resolve')
    // reject('p2 reject')
  })
}

p2().finally(() => {
  console.log('finally');
  return p1()
}).then(value => {
  console.log(value);
}, reason => {
  console.log(reason);
})
// finally 
// 等待2s后执行 输出p2 resolve
```
### Promise.catch 方法实现
- catch方法的作用是用来处理当前这个Promise 对象最终状态为失败的情况的,就是说当我们调用then方法时候，我们可以不传递失败回调, 如果不传失败回调,那么失败回调就可以被catch捕获,从而去执行传入到catch方法的回调函数
- 只需要在catch方法内部去调用then方法就可以了
```js
catch (failCallback) {
  return this.then(undefind, failCallback);
}
```
**测试一下**
```js
function p1() {
  return new myPromise((resolve, reject) => {
    // resolve('大白菜～～')
    reject('error')
  })
}

p1()
  .then(value => console.log(value))
  .catch(reason => console.log(reason))
```