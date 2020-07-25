const PENDING = 'pending'; // 等待
const FULFILLED = 'fulfilled'; // 成功
const REJECTED = 'rejected'; // 失败

class MyPromise {
  constructor (executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e);
    }
  }
  // promise 状态
  status = PENDING;
  // 成功后的值
  value = undefined;
  // 失败后的值
  reason = undefined;
  // 成功回调
  successCallback = [];
  // 失败后的回调
  failCallback = [];
  resolve = value => {
    // 如果状态不是等待,阻止程序向下运行
    if (this.status !== PENDING) return;
    // 将状态更改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // 判断成功回调是否存在,如果存在 调用
    // this.successCallback && this.successCallback(this.value);
    while (this.successCallback.length) this.successCallback.shift()();
  }
  reject = reason => {
    // 如果状态不是等待,阻止程序向下运行
    if (this.status !== PENDING) return;
    // 将状态更改为失败
    this.status = REJECTED;
    // 保存失败后的原因
    this.reason = reason;
    // 判断失败回调是否存在,如果存在则调用
    // this.faliCallback && this.faliCallback(this.reason);
    while (this.failCallback.length) this.failCallback.shift()();
  }
  then (successCallback, failCallback) {
    // 根据规范，如果then的参数不是function，则我们需要忽略它, 让链式调用继续往下执行
    successCallback = typeof successCallback === 'function' ? successCallback : value => value;
    failCallback = typeof failCallback === 'function' ? failCallback : reason => { throw reason };
    let promise2 = new MyPromise((resolve, reject) => {
      // 判断状态
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = successCallback(this.value);
            // 判断x的是是普通值还是promise对象
            // 如果是普通值, 直接调用resolve
            // 如是是promise对象 查看promise对象返回的结果
            // 在根据promise对象返回的结果 决定调用resovle还是reject
            resolvePromise(promise2, x, resolve, reject)           
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = failCallback(this.reason);
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else {
        // 等待
        // 将等待回调和失败回调存储起来
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
              let x = successCallback(this.value);
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        }) // 将成功回调推入
        this.failCallback.push(() => {
          setTimeout(() => {
            try {
              let x = failCallback(this.reason);
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        }) // 将失败回调推入
      }
    });
    return promise2;
  }

  static all(array) {
    let result = []
    let index = 0
    return new MyPromise((resolve, reject) => {
      // 执行for 循环有异步操作,循环没有等待异步操作。
      // 如果index 等于 array的length 就调用resolve
      function addData (key, value) {
        result[key] = value;
        index++;
        // 保证all的每一项都执行完了
        if (index === array.length) {
          resolve(result);
        }
      }
      // 需要判断是普通值, 还是Promise 对象
      for (let i = 0; i < array.length; i++) {
        let current = array[i];
        if (current instanceof MyPromise) {
          // promise 对象
          current.then(value => addData(i, value), reason => reject(reason));
        } else {
          // 普通值
          addData(i, array[i])
        }
      }
    })
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value))
  }
  static reject(reason) {
    return new MyPromise((resolve,reject) => reject(reason))
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (promises.length === 0) {
        return
      } else {
        for (let p of promises) {
          MyPromise.resolve(p).then(value => {
            resolve(value)
          }, reason => {
            reject(reason)
          })
        }   
      }
    })
  }
  // finally链式调用返回Promise
  finally(callback) {
    return this.then(value => {
      return MyPromise.resolve(callback()).then(() => value);
    }, reason => {
      return MyPromise.resolve(callback()).then(() => { throw reason },);
    })
  }

  catch (failCallback) {
    return this.then(undefined, failCallback);
  }
}

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

module.exports = MyPromise;