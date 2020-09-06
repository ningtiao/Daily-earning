```js
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */

// indexOf

var strStr = function(haystack, needle) {
  if (needle.length == 0) return 0 
  let i = 0,j = 0;

  while(i < haystack.length) {
      if (haystack.slice(i, j) == needle) {
          return i
      }

      if (j < haystack.length) {
          j++
      } else {
          i++
          j = i + 1
      }
  }
  return -1
};
```