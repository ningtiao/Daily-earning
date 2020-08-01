```js
const api = (url, method, async, data) => {
  return new Promise((resolve, reject) => {
    const xhr = XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText))
      } else if (xhr.status > 400) {
        reject('error')
      }
    }
    xhr.open(url, method, async)
    xhr.send(data || null)
  })
}
```