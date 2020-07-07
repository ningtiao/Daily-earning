class Vue {
  constructor (options) {
    // 1. 通过属性保存选项的数据
    this.$options = options || {}
    this.$data = options.data
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    this._proxyData(this.$data)
    // 2. 把data中的成员转换成getter/setter,注入到Vue实例中
    // 3. 调用observer对象,监听数据的辩护
    new Observer(this.$data)
    // 4. 调用compiler对象, 解析指令和差值表达式
    new Compiler(this)
  }
  _proxyData (data) {
    // 遍历data中的属性
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumberable: true,
        configurable: true,
        get () {
          return data[key]
        },
        set (newValue) {
          if (newValue === data[key]) {
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}
