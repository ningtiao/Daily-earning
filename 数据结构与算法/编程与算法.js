 // 1. 实现sendRequest(promises, max, callback)，同时最多执行max个promises，超过的等待有空闲的开始执行，执行完成后执行callback

function sendRequest(promises, max, callback) {
  let current = 0
  const results = []
  const originLen = promises.length
  const next = () => {
    while (current < max && promises.length) {
      const index = originLen - promises.length
      const promise = promises.shift()
      results[index] = {
        value: null,
        reason: null
      }
      Promise.resolve(promise).then(value => {
        results[index].value = value
      }, reason => {
        results[index].reason = reason
      }).finally(() => {
        current--
        next()
      })
      current++
    }
    if (current === 0) {
      callback(results)
    }
  }
  next()
}

// 5.实现 findFirstIndex函数，找到有序数组 [1, 2, 3, 4, 7, 7, 7, 9, 12, 23, 34, 45, 55, 67]中第一次出现的位置，比如7第一次出现的位置是4

function findFirstIndex (arr, target) {
  let begin = 0
  let end = arr.length
  while (begin < end) {
    const mid = (begin + end) >>> 1
    if (arr[mid] >= target) {
      end = mid
    } else {
      begin = mid + 1
    }
  }
  if (begin === arr.length) return -1
  return arr[begin] === target ? begin : -1
}

// 7. 大数相加
function bigAdd(a, b) {
  const aArr = a.split('')
  const bArr = b.split('')

  let flag = 0
  let result = []
  while(aArr.length || bArr.length) {
      const left = aArr.pop() || 0
      const right = bArr.pop() || 0

      const value = Number(left) + Number(right) + flag

      result.unshift(value % 10)

      flag = parseInt(value / 10)
  }

  if (flag) {
      result.unshift(flag)
  }

  return result.join('')
}

// 实现深拷贝

function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
      return obj
  }

  if (map.has(obj)) {
      return map.get(obj)
  }

  const copy = Array.isArray(obj) ? [] : {}

  map.set(obj, copy)

  const keys = Reflect.ownKeys(obj)

  keys.forEach(key => {
      copy[key] = deepClone(obj[key], map)
  })

  return copy
}