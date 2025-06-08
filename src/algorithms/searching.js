// src/algorithms/searching.js

export function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let comparisons = 0;
  let steps = [];

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons++;
    steps.push({ left, mid, right, comparisons, checkingIndex: mid });

    if (arr[mid] === target) {
      return { found: true, index: mid, comparisons, steps };
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return { found: false, index: -1, comparisons, steps };
}

export function linearSearch(arr, target) {
  let comparisons = 0;
  let steps = [];

  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    steps.push({ checkingIndex: i, comparisons });

    if (arr[i] === target) {
      return { found: true, index: i, comparisons, steps };
    }
  }
  return { found: false, index: -1, comparisons, steps };
}
