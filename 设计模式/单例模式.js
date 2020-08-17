// 实现Storage
// 万变不离其踪，记住getInstance方法、记住instance变量、记住闭包和静态方法
class Storage {
  static getInstance () {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance
  }

  getItem (key) {
    return localStorage.getItem(key)
  }
  setItem (key, val) {
    return localStorage.setItem(key, val)
  }
}

const storage1 = Storage.getInstance()
const storage2 = Storage.getInstance()

storage1.setItem('name', '大白菜')
// 大白菜
storage1.getItem('name')
// 也是大白菜
storage2.getItem('name')

storage1 === storage2 // true


// 闭包版本

function StorageBase() {}

StorageBase.prototype.getItem = function (key) {
  return localStorage.getItem(key)
}

StorageBase.prototype.setItem = function(key, val) {
  return localStorage.setItem(key, value)
}

const Storage = (function() {
  let instance = null
  return function() {
    if (!instance) {
      instance = new StorageBase()
    }
    return instance
  }
})()

const storage1 = new Storage()
storage1.setItem('name', 'lilei')
storage1.getItem('name')

storage2.getItem('name')

storage1 === storage2 // true