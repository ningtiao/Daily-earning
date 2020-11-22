// function print(n) {
//   setTimeout(() => {
//     console.log(n)
//   }, 0*Math.floor(Math.random() * 1000))
// }

// for (var i = 0; i < 100; i++) {
//   print(i)
// }
var getNumbers = () => {
  return Promise.resolve([1, 2, 3])
}

var multi = num => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (num) {
        resolve(num * num)
      } else {
        reject(new Error('num not specified'))
      }
    }, 1000)
  })
}
async function test () {
  var nums = await getNumbers()
  for (let x of nums) {
    var res = await multi(x)
    console.log(res)
  }
}
test()