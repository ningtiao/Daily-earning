// 数组扁平 

function arrFlat(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? arrFlat(cur) : cur)
  }, [])
}

function arrFlat1 (arr) {
  let result = []
  arr.map((item, index) => {
    if (Array.isArray(item)) {
      result = result.concat(arrFlat1(item))
    } else {
      result.push(item)
    }
  })
  return result
}

// 数组去重

let arr = [1, 1, "1", "1", null, null, undefined, undefined, /a/, /a/, NaN, NaN, {}, {}, [], []]

let res = [...new Set(arr)] // 引用数据类型不行

let res = arr.filter((item, index) => {
  return arr.indexOf(item) === index
})

// 2
let res = arr.reduce((pre, cur) => {
  return pre.includes(cur) ? pre : [...pre, cur]
}, [])

// 3 
let obj = {}

let res = arr.filter((item, index) => {
  if (obj.hasOwnProperty(typeof item + item)) {
    return false
  } else {
    obj[typeof item + item ] = true
    return true
  }
})

console.log(res)

// 最长回文字串

var longestPalindrome = function(s) {
  function isPalindrome (str) {
    var len = str.length;
    var middle = parseInt(len / 2)
    for (var i = 0; i < middlel;i++) {
      if (str[i] != str[len - i -1]) {
        return false
      }
    }
    return true
  }

  var ans = ''
  var max = 0
  var len = s.length
  for (let i = 0; i < len;i++) {
    for (let r = i + 1; r <= len; r++) {
      let tempStr = s.substring(i, r)
      if (isPalindrome(tempStr) && tempStr.length > max) {
        ans = s.substring(i, r)
        max = tempStr.length;
      }
    }
  }
  return ans
};

// 手写EventEmiter

class EventEmiter {
  constructor () {
    this.events = {}
  }
  emit(event, ...args) {
    this.events[event].forEach(fn => {
      fn.apply(this, args)
    })
  }
  on (event, fn) {
    if (this.events[event]) {
      this.events[event].push(fn)
    } else {
      this.events[event] = [fn]
    }
  }
  remove (event) {
    delete this.event[event]
  }
}

const eventHub = new EventEmiter()
eventHub.on('test', data => {
  console.log(data)
})

eventHub.emit('test', 1)
console.log(2)

