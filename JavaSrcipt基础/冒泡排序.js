function bubbleSort (arr) {
  for (let i = 0; i < arr.length; i++) {
    let flag = true;
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        falg = false;
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp
      }
    }
    if (flag) break;
  }
  return arr;
}