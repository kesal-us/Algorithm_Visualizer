// sorting.js

export function bubbleSort(arr) {
  const steps = [];
  const a = [...arr];
  let n = a.length;
  let swapped;

  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      steps.push({ type: 'compare', indices: [i, i + 1], array: [...a] });
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        steps.push({ type: 'swap', indices: [i, i + 1], array: [...a] });
        swapped = true;
      }
    }
    n--;
  } while (swapped);

  return steps;
}

export function selectionSort(arr) {
  const steps = [];
  const a = [...arr];

  for (let i = 0; i < a.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      steps.push({ type: 'compare', indices: [minIdx, j], array: [...a] });
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ type: 'swap', indices: [i, minIdx], array: [...a] });
    }
  }

  return steps;
}

export function insertionSort(arr) {
  const steps = [];
  const a = [...arr];

  for (let i = 1; i < a.length; i++) {
    let key = a[i];
    let j = i - 1;

    while (j >= 0 && a[j] > key) {
      steps.push({ type: 'compare', indices: [j, j + 1], array: [...a] });
      a[j + 1] = a[j];
      steps.push({ type: 'shift', indices: [j, j + 1], array: [...a] });
      j--;
    }

    a[j + 1] = key;
    steps.push({ type: 'insert', indices: [j + 1], array: [...a] });
  }

  return steps;
}

export function quickSort(arr) {
  const steps = [];
  const a = [...arr];

  function partition(low, high) {
    const pivot = a[high];
    let i = low;

    for (let j = low; j < high; j++) {
      steps.push({ type: 'compare', indices: [j, high], array: [...a] });
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        steps.push({ type: 'swap', indices: [i, j], array: [...a] });
        i++;
      }
    }

    [a[i], a[high]] = [a[high], a[i]];
    steps.push({ type: 'swap', indices: [i, high], array: [...a] });
    return i;
  }

  function quickSortHelper(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  }

  quickSortHelper(0, a.length - 1);
  return steps;
}


export function mergeSort(arr) {
  const steps = [];
  const a = [...arr];

  function merge(start, mid, end) {
    let left = a.slice(start, mid + 1);
    let right = a.slice(mid + 1, end + 1);

    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
      steps.push({ type: 'compare', indices: [start + i, mid + 1 + j], array: [...a] });

      if (left[i] <= right[j]) {
        a[k] = left[i];
        i++;
      } else {
        a[k] = right[j];
        j++;
      }

      steps.push({ type: 'merge', indices: [k], array: [...a] });
      k++;
    }

    while (i < left.length) {
      a[k] = left[i];
      steps.push({ type: 'merge', indices: [k], array: [...a] });
      i++;
      k++;
    }

    while (j < right.length) {
      a[k] = right[j];
      steps.push({ type: 'merge', indices: [k], array: [...a] });
      j++;
      k++;
    }
  }

  function mergeSortHelper(start, end) {
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      mergeSortHelper(start, mid);
      mergeSortHelper(mid + 1, end);
      merge(start, mid, end);
    }
  }

  mergeSortHelper(0, a.length - 1);
  return steps;
}

export function heapSort(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;

  function heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      steps.push({ type: 'compare', indices: [left, largest], array: [...a] });
      if (a[left] > a[largest]) largest = left;
    }

    if (right < n) {
      steps.push({ type: 'compare', indices: [right, largest], array: [...a] });
      if (a[right] > a[largest]) largest = right;
    }

    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      steps.push({ type: 'swap', indices: [i, largest], array: [...a] });
      heapify(n, largest);
    }
  }

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    steps.push({ type: 'swap', indices: [0, i], array: [...a] });
    heapify(i, 0);
  }

  return steps;
}
