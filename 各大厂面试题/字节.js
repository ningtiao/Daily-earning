// function print(n) {
//   setTimeout(() => {
//     console.log(n)
//   }, 0*Math.floor(Math.random() * 1000))
// }

// for (var i = 0; i < 100; i++) {
//   print(i)
// }
// var getNumbers = () => {
//   return Promise.resolve([1, 2, 3])
// }

// var multi = num => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (num) {
//         resolve(num * num)
//       } else {
//         reject(new Error('num not specified'))
//       }
//     }, 1000)
//   })
// }
// async function test () {
//   var nums = await getNumbers()
//   for (let x of nums) {
//     var res = await multi(x)
//     console.log(res)
//   }
// }
// test()

//  双指针 合并两个有序数组

// 输入：
// nums1 = [1,2,3,0,0,0], m = 3
// nums2 = [2,5,6],       n = 3

// 输出：[1,2,2,3,5,6]

let nums1 = [1, 2, 3, 0, 0, 0],
    m = 3
    nums2 = [2,5,6]
    n = 3

    // 双指针
// var merge = function(nums1, m, nums2, n) {
//   let len1 = m - 1;
//   let len2 = n - 1;
//   let len = m + n - 1;
//   while (len1 >= 0 && len2 >= 0) {
//     nums1[len--] = nums1[len1] > nums2[len2] ? nums1[len1--] : nums2[len2--]
//   }
//   function arrayCopy(src, srcIndex, dest, destIndex, length) {
//     dest.splice(destIndex, length, ...src.slice(srcIndex, srcIndex + length));
//   }
//   arrayCopy(nums2, 0, nums1, 0, len2 + 1)
// };

// merge(nums1, m, nums2, n)

// 归并排序

var merge = function (nums1, m , nums2, n) {
  let index1 = m -1;
  let index2 = n - 1;
  let tail = m + n -1;
  while (index1 >= 0 && index2 >= 0) {
    if (nums1[index1] > nums2[index2]) {
      nums1[tail] = nums1[index1]
      index1--
    } else {
      nums1[tail] = nums2[index2]
      index2--
    }
    tail--
  }
  while (tail >= 0 && index1 >= 0) {
    nums1[tail] = nums1[index1]
    index1--
    tail--
  }

  while (tail >=0 && index2 >= 0) {
    nums1[tail] = nums2[index2]
    index2--
    tail--
  }
}

// var merge = function(nums1, m, nums2, n, l) {
//   l = m + n, m--, n--
//   while(l--) {
//       nums1[l] = (nums2[n] === undefined ? -Infinity : nums2[n]) >= (nums1[m] === undefined ? -Infinity : nums1[m]) ? nums2[n--] : nums1[m--]
//   }
// };
