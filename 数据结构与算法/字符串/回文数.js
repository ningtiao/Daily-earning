// 判断一个整数是否是回文数。回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。
var isPalindrome = function(x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) {
    return false
  }
 
  let revertedNumber = 0;
  while (x > revertedNumber) {
    revertedNumber = revertedNumber * 10 + x % 10;
    console.log(revertedNumber, 'revertedNumber')
    x = Math.floor(x / 10)
    console.log(x, 'x')
  }
  console.log(x, revertedNumber, 'c')
  return x === revertedNumber || x === Math.floor(revertedNumber / 10);
 };
 
 isPalindrome(1234)