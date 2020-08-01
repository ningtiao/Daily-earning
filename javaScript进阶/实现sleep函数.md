
```js
function sleep(fn, time) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(fn);
		}, time)
	})
}

let saySomething = (name) => console.log(`hello, ${name}`)
async function autoPlay() {
	let result = await sleep(saySomething('Cat'), 1000);
	let result1 = await sleep(saySomething('Dog'), 1000);
}
autoPlay()
```
