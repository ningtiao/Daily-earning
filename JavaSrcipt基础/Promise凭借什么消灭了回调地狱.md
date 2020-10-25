```js
let readFilePromise = (filename) => {
  fs.readFile(filename, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
};

readFilePromise(".json").then((data) => {
  return readFilePromise("2.json");
});
```
