import React, { useState, useEffect } from 'react';
import {
  bubbleSort,
  selectionSort,
  insertionSort,
  quickSort,
  mergeSort,
  heapSort,
} from '../algorithms/sorting';
import '../styles/SortingPage.css';


export default function SortingPage() {
  const [array, setArray] = useState([5, 2, 9, 1, 7]);
  const [userInput, setUserInput] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [metrics, setMetrics] = useState({});
  const [algo, setAlgo] = useState('bubble');
  const [error, setError] = useState('');
  const [lastRunAlgo, setLastRunAlgo] = useState('');


  const algoNames = {
  bubble: 'Bubble Sort',
  selection: 'Selection Sort',
  insertion: 'Insertion Sort',
  quick: 'Quick Sort',
  merge: 'Merge Sort',
  heap: 'Heap Sort',
};


  useEffect(() => {
    setCurrentStep(0);
  }, [steps]);

// Math.floor(Math.random() * (max - min + 1)) + min;
  const generateRandomArray = () => {
    const arr = Array.from({ length: Math.floor(Math.random() * 21) + 5 }, () => Math.floor(Math.random() * 25) + 1);
    setArray(arr);
    setUserInput('');
    setSteps([]);
    setMetrics({});
    setError('');
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    setError('');
  };

  const parseInputArray = () => {
    try {
      const arr = userInput
        .split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n));

      if (arr.length === 0) throw new Error('Array is empty or invalid');
      return arr;
    } catch (err) {
      throw new Error('Invalid array format. Use numbers separated by commas.');
    }
  };

  const runSort = () => {
    try {
      const inputArr = userInput ? parseInputArray() : array;
      setArray(inputArr);
      let steps = [];
      let result = {};
      const t0 = performance.now();

      switch (algo) {
        case 'bubble':
          steps = bubbleSort(inputArr);
          break;
        case 'selection':
          steps = selectionSort(inputArr);
          break;
        case 'insertion':
          steps = insertionSort(inputArr);
          break;
        case 'quick':
          steps = quickSort(inputArr);
          break;
        case 'merge':
          steps = mergeSort(inputArr);
          break;
        case 'heap':
          steps = heapSort(inputArr);
          break;
        default:
          throw new Error('Invalid algorithm selected');
      }

      const t1 = performance.now();
      const comparisons = steps.filter(step => step.type === 'compare').length;
      const swaps = steps.filter(step => step.type === 'swap').length;

      setSteps(steps);
      setLastRunAlgo(algo);
      setMetrics({
        comparisons,
        swaps,
        time: (t1 - t0).toFixed(2),
      });
      setCurrentStep(0);
      setError('');
    } catch (err) {
      setError(err.message);
      setSteps([]);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentArray = steps.length ? steps[currentStep].array : array;
  const comparing = steps.length && steps[currentStep].type === 'compare' ? steps[currentStep].indices : [];
  const swapped = steps.length && steps[currentStep].type === 'swap' ? steps[currentStep].indices : [];
  const maxVal = Math.max(...currentArray);
  return (
  <div className="sorting-container">
    <h2>Sorting Algorithms Visualizer</h2>

    <div className="sorting-controls">
      <label>
        Algorithm:
        <select value={algo} onChange={(e) => setAlgo(e.target.value)}>
          <option value="bubble">Bubble Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="quick">Quick Sort</option>
          <option value="merge">Merge Sort</option>
          <option value="heap">Heap Sort</option>
        </select>
      </label>
      <button onClick={generateRandomArray}>New Array</button>
    </div>

    <div className="sorting-controls">
      <label>Enter array (comma-separated):</label>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="e.g. 5,2,9,1,7"
      />
      <button onClick={runSort}>Run Sort</button>
    </div>

    {error && <p className="error-message">{error}</p>}

    <div className="bar-visualization">
      {currentArray.map((val, idx) => {
        const className = swapped.includes(idx)
          ? 'bar swap'
          : comparing.includes(idx)
          ? 'bar compare'
          : 'bar normal';
        const height = (val / maxVal) * 140 + 10;
        return (
          <div key={idx} className={className} style={{ height }}>
            {val}
          </div>
        );
      })}
    </div>

    <div className="step-description">
      {steps.length > 0 && (
        <p>
          Step {currentStep + 1}/{steps.length}:{' '}
          {steps[currentStep].type === 'compare' &&
            `Comparing indices ${steps[currentStep].indices[0]} (${currentArray[steps[currentStep].indices[0]]}) and ${steps[currentStep].indices[1]} (${currentArray[steps[currentStep].indices[1]]})`}
          {steps[currentStep].type === 'swap' &&
            `Swapping indices ${steps[currentStep].indices[0]} and ${steps[currentStep].indices[1]}`}
        </p>
      )}
    </div>

    {steps.length > 0 && (
      <>
        <div className="navigation-buttons">
          <button onClick={prevStep} disabled={currentStep === 0}>
            Prev Step
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep >= steps.length - 1}
          >
            Next Step
          </button>
        </div>

        <div className="metrics">
          <p>Algorithm: {algoNames[lastRunAlgo]}</p>
          <p>Comparisons: {metrics.comparisons}</p>
          <p>Swaps: {metrics.swaps}</p>
          <p>Time Taken: {metrics.time} ms</p>
        </div>
      </>
    )}

  </div>
);

}
