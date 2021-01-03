const tasks = [];

const output = (i) => new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log(new Date, i)
    resolve()
  }, 1000 * i)
})

for (var i = 0; i < 5; i++) {
  tasks.push(output(i))
}

Promise.all(tasks).then(() => {
  setTimeout(() => {
    console.log(new Date, i)
  }, 1000)
})


const sleep = (timeOuntMS) => new Promise((resolve) => {
  setTimeout(resolve, timeOuntMS)
})

( async () => {
  for (var i = 0; i< 5; i++) {
    if (i > 0) {
      await sleep(1000)
    }
    console.log(new Date, i)
  }
  await sleep(1000)
  console.log(new Date, i)
})



setTimeout(function(){
  for (var i=0; i<5; i++) {
    console.log(1)
  }
},5000)

setTimeout(() => {
  console.log('cs')
}, 3000)