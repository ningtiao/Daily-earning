var searchInsert = function(nums, target) {
  for (let i = 0; i< nums.length; i++) {
    if (target <= nums[i]) {
      return i;
    }
  }
  return nums.length; 
};

let a = searchInsert([1,3,5,6], 7)
console.log(a)