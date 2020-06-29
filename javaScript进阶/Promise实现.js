// const p1 = new Promise((resolve,reject) => {
//     setTimeout(() => {
//         resolve('大大白菜')
//     }, 1000)
// })
// p1.then((res) => {
//     console.log(res)
// }).catch((err) => {
//     console.log(err)
// })

class MyPromise {
    // 构造方法接收一个回调
    constructor(executor) {
        this._resloveQueue = []
        this._rejectQueue = []

        let _reslove = (val) => {
            while(this._resloveQueue.length) {
                const callBack = this._resloveQueue.shift()
                callBack(val)
            }
        }

        let _reject = (val) => {
            while(this._rejectQueue.length) {
                const callBack = this._rejectQueue.shift()
                callBack(val)
            }
        }

        executor(_reslove, _reject)
    }
    then(resolceFn, rejectFn) {
        this._resloveQueue.push(resolceFn)
        this._rejectQueue.push(rejectFn)
    }
}

const p1 = new MyPromise((resole, reject) => {
    setTimeout(() => {
        console.log('大大白菜')
    }, 1000)
})

p1.then((res) => {
    console.log(res)
})

// Promise A+规范

const PENDING = 'pending'

const FULFILLED = 'fulfilled'

const REJECTED = 'rejected'

class MyPromise {
    constructor (executor) {
        this._status = PENDING
        this._resloveQueue = []
        this._rejectQueue = []

        let _reslove = (val) => {
            if (this._stats !== PENDING) return

            this._status = FULFILLED

            while (this._rejectQueue.length) {
                const callBack = this._resloveQueue.shift()
                callBack(val)
            }
        }

        let _reject = (val) => {
            if (this._status !== PENDING)  return

            this._status = REJECTED
            while (this._rejectQueue.length) {
                const callBack = this._rejectQueue.shift()
                callBack(val)
            }
        }
        executor(_reslove, _reject)
    }
    then(resolceFn, rejectFn) {
        this._resloveQueue(resolceFn)
        this._rejectQueue(rejectFn)
    }
}

// 链式调用

then(resolceFn, rejectFn) {
    this._resloveQueue(resolceFn)
    this._rejectQueue(rejectFn)

    return new Promise((reslove, reject) => {
        const fulfilledFn = value => {
            try {
                let x = resolveFn(value)
                x instanceof MyPromise ? x.then(reslove, reject) : reslove(x)
            } catch (error) {
                reject(error)
            }
        }

        // 把后续then手机的依赖都push进当前Promise的成功回调队列中(_rejectQueue) 这是为了保证顺序调用

        this._resloveQueue.push(fulfilledFn)

        // reject同理
        const rejectedFn = error => {
            try {
                let x = rejectFn(value)
                x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
            } catch (error) {
                reject(error)
            }
        }

        this._rejectQueue.push(rejectFn)
    })
}

// 4值穿透 & 状态已变更的情况


// 值穿透：根据规范，如果 then() 接收的参数不是function，那么我们应该忽略它。如果没有忽略，当then()回调不为function时将会抛出异常，导致链式调用中断
// 处理状态为resolve/reject的情况：其实我们上边 then() 的写法是对应状态为padding的情况，但是有些时候，resolve/reject 在 then() 
// 之前就被执行（比如Promise.resolve().then()），如果这个时候还把then()回调push进resolve/reject的执行队列里，那么回调将不会被执行，
// 因此对于状态已经变为fulfilled或rejected的情况，我们直接执行then回调：

then(resolveFn, rejectFn) {

    typeof resloveFn !== 'function' ? resolveFn = value => value : null

    typeof rejectFn !== 'function' ? rejectFn = reason => {
        throw new Error(reason instanceof Error ? reason.message: reason);
    } : null

    this._resloveQueue(resolceFn)
    this._rejectQueue(rejectFn)

    return new Promise((reslove, reject) => {
        const fulfilledFn = value => {
            try {
                let x = resolveFn(value)
                x instanceof MyPromise ? x.then(reslove, reject) : reslove(x)
            } catch (error) {
                reject(error)
            }
        }

        // 把后续then手机的依赖都push进当前Promise的成功回调队列中(_rejectQueue) 这是为了保证顺序调用

        // reject同理
        const rejectedFn = error => {
            try {
                let x = rejectFn(value)
                x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
            } catch (error) {
                reject(error)
            }
        }
        
        switch (this._status) {
            case PENDING:
                this._rejectQueue.push(fulfilledFn)
                this._rejectQueue.push(rejectFn)
                break;
            case FULFILLED:
                fulfilledFn(this._value)
                break;
            case REJECTED: 
                rejectedFn(this._value)
                break;
        }
    })
}



//Promise/A+规定的三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  // 构造方法接收一个回调
  constructor(executor) {
    this._status = PENDING     // Promise状态
    this._value = undefined    // 储存then回调return的值
    this._resolveQueue = []    // 成功队列, resolve时触发
    this._rejectQueue = []     // 失败队列, reject时触发

    // 由于resolve/reject是在executor内部被调用, 因此需要使用箭头函数固定this指向, 否则找不到this._resolveQueue
    let _resolve = (val) => {
      //把resolve执行回调的操作封装成一个函数,放进setTimeout里,以兼容executor是同步代码的情况
      const run = () => {
        if(this._status !== PENDING) return   // 对应规范中的"状态只能由pending到fulfilled或rejected"
        this._status = FULFILLED              // 变更状态
        this._value = val                     // 储存当前value

        // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
        // 如果使用一个变量而非队列来储存回调,那么即使多次p1.then()也只会执行一次回调
        while(this._resolveQueue.length) {    
          const callback = this._resolveQueue.shift()
          callback(val)
        }
      }
      setTimeout(run)
    }
    // 实现同resolve
    let _reject = (val) => {
      const run = () => {
        if(this._status !== PENDING) return   // 对应规范中的"状态只能由pending到fulfilled或rejected"
        this._status = REJECTED               // 变更状态
        this._value = val                     // 储存当前value
        while(this._rejectQueue.length) {
          const callback = this._rejectQueue.shift()
          callback(val)
        }
      }
      setTimeout(run)
    }
    // new Promise()时立即执行executor,并传入resolve和reject
    executor(_resolve, _reject)
  }

  // then方法,接收一个成功的回调和一个失败的回调
  then(resolveFn, rejectFn) {
    // 根据规范，如果then的参数不是function，则我们需要忽略它, 让链式调用继续往下执行
    typeof resolveFn !== 'function' ? resolveFn = value => value : null
    typeof rejectFn !== 'function' ? rejectFn = reason => {
      throw new Error(reason instanceof Error? reason.message:reason);
    } : null
  
    // return一个新的promise
    return new MyPromise((resolve, reject) => {
      // 把resolveFn重新包装一下,再push进resolve执行队列,这是为了能够获取回调的返回值进行分类讨论
      const fulfilledFn = value => {
        try {
          // 执行第一个(当前的)Promise的成功回调,并获取返回值
          let x = resolveFn(value)
          // 分类讨论返回值,如果是Promise,那么等待Promise状态变更,否则直接resolve
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error)
        }
      }
  
      // reject同理
      const rejectedFn  = error => {
        try {
          let x = rejectFn(error)
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error)
        }
      }
  
      switch (this._status) {
        // 当状态为pending时,把then回调push进resolve/reject执行队列,等待执行
        case PENDING:
          this._resolveQueue.push(fulfilledFn)
          this._rejectQueue.push(rejectedFn)
          break;
        // 当状态已经变为resolve/reject时,直接执行then回调
        case FULFILLED:
          fulfilledFn(this._value)    // this._value是上一个then回调return的值(见完整版代码)
          break;
        case REJECTED:
          rejectedFn(this._value)
          break;
      }
    })
  }

  //catch方法其实就是执行一下then的第二个回调
  catch(rejectFn) {
    return this.then(undefined, rejectFn)
  }

  //finally方法
  finally(callback) {
    return this.then(
      value => MyPromise.resolve(callback()).then(() => value),             //执行回调,并returnvalue传递给后面的then
      reason => MyPromise.resolve(callback()).then(() => { throw reason })  //reject同理
    )
  }

  //静态的resolve方法
  static resolve(value) {
    if(value instanceof MyPromise) return value //根据规范, 如果参数是Promise实例, 直接return这个实例
    return new MyPromise(resolve => resolve(value))
  }

  //静态的reject方法
  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason))
  }

  //静态的all方法
  static all(promiseArr) {
    let index = 0
    let result = []
    return new MyPromise((resolve, reject) => {
      promiseArr.forEach((p, i) => {
        //Promise.resolve(p)用于处理传入值不为Promise的情况
        MyPromise.resolve(p).then(
          val => {
            index++
            result[i] = val
            if(index === promiseArr.length) {
              resolve(result)
            }
          },
          err => {
            reject(err)
          }
        )
      })
    })
  }

  //静态的race方法
  static race(promiseArr) {
    return new MyPromise((resolve, reject) => {
      //同时执行Promise,如果有一个Promise的状态发生改变,就变更新MyPromise的状态
      for (let p of promiseArr) {
        MyPromise.resolve(p).then(  //Promise.resolve(p)用于处理传入值不为Promise的情况
          value => {
            resolve(value)        //注意这个resolve是上边new MyPromise的
          },
          err => {
            reject(err)
          }
        )
      }
    })
  }
}
