// 实现Storage

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