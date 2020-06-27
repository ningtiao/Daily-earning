```
  // 事件触发器
  class EventEmitter {
    constructor () {
      // { 'click' [fn1, fn2], 'change': [fn] }
      this.subs = Object.create(null)
    }
    // 注册事件
    $on (eventType, hander) {
      this.subs[eventType] = this.subs[eventType] || []
      this.subs[eventType].push(hander)
    }
    // 触发事件
    $emit (eventType) {
      if (this.subs[eventType]) {
        this.subs[eventType].forEach(hander => {
          hander()
        })
      }
    }
  }
  // 测试
  let em = new EventEmitter()
  em.$on('click', () => {
    console.log('click')
  })
  em.$on('click', () => {
    console.log('click2')
  })

  em.$emit('click')
```