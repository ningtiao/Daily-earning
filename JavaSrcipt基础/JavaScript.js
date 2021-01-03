// 数组扁平化
Array.flat(Infinity)

const arr = [1,[1,2], [1,2,3]]

const str = `[${JSON.stringify(arr).replace(/(\[|\])/g, '')}]`

JSON.parse(str)

function flat (arr) {
  let result = [];
  for (const item of arr) {
    item instanceof Array ? result = result.concat(flat(item)) : result.push(item)
  }
  return result
}

function flat (arr) {
  arr.reduce((prev, curr) => {
    return prev.concat(curr instanceof Array ? flat(curr) : curr)
  }, [])
}

// new 

function myNew (foo, ...args) {
  let obj = Object.create(foo,prototype)

  let result = foo.apply(obj, args)

  return Object.prototype.toString.call(result) === '[object Object]' ? result : obj
}

function Foo (name) {
  this.name = name
}

const newObj = myNew(Foo, 'zhan')
console.log(newObj)
console.log(newObj instanceof Foo)


function Person (name) {
  this.name = [name]
}

Person.prototype.getName = function () {
  console.log(this.name)
}

function Child () {
  Person.call(this, 'zhangsan')
}

Child.prototype = Object.create(Person.prototype)
Child.prototype.constructor = Child

const child1 = new Child()
const child2 = new Child()


// 冒泡
function bubbleSort (arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  return arr
}

// 快排
function quickSort (arr) {
  if (arr.length <= 1) return arr
  const pivot = arr.length / 2 | 0
  const pivotValue = arr.splice(pivot, 1)[0]
  const leftArr = []
  const rightArr = []
  arr.forEach(val => {
    val > pivotValue ? rightArr.push(val) : leftArr.push(val)
  })
  return [...quickSort(leftArr), pivotValue, ...quickSort(rightArr)]
} 

// 优化

function quickSort (arr, left, right) {
   if (left < right) {
     let pos = left - 1;
     for (let i = left; i <= right; i++) {
       let pivot = arr[right]
       if (arr[i] <= pivot) {
         pos++
         let temp = arr[pos]
         arr[pos] = arr[i]
         arr[i] = temp
       }
     }
     quickSort(arr, left, pos -1)
     quickSort(arr, pos + 1, right)
   }
   return arr
}

var arr = [1, 2, 5, 3, 4]

var start = 0

var end = arr.length - 1
quickSort(arr, start, end)

// 适配器模式

class Adaptee {
  test () {
    return '旧接口'
  }
}

class Target {
  constructor () {
    this.adaptee = new Adaptee()
  }
  test () {
    let  indo = this.adaptee.test()
    return `适配${info}`
  }
}

let target = new Target()
console.log(target.test())