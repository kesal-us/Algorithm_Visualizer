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

  useEffect(() => {
    setCurrentStep(0);
  }, [steps]);

  const generateRandomArray = () => {
    const arr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 20) + 1);
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

  return (
    <div style={{ padding: 20 }}>
      <h2>Sorting Algorithms Visualizer</h2>

      <div>
        <label>
          Algorithm:{' '}
          <select value={algo} onChange={(e) => setAlgo(e.target.value)}>
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="quick">Quick Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="heap">Heap Sort</option>
          </select>
        </label>

        <button onClick={generateRandomArray} style={{ marginLeft: 10 }}>
          New Array
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Enter array (comma-separated): </label>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="e.g. 5,2,9,1,7"
          style={{ width: 200, marginRight: 10 }}
        />
        <button onClick={runSort}>Run Sort</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div
        style={{
          display: 'flex',
          alignItems: 'end',
          height: 150,
          marginTop: 20,
          gap: '5px',
          border: '1px solid #ccc',
          padding: 10,
        }}
      >
        {currentArray.map((val, idx) => {
          const isComparing = comparing.includes(idx);
          const isSwapped = swapped.includes(idx);
          return (
            <div
              key={idx}
              style={{
                height: val * 10,
                width: 30,
                backgroundColor: isSwapped ? 'red' : isComparing ? 'orange' : 'teal',
                color: 'white',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: 14,
                borderRadius: 4,
              }}
            >
              {val}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 15 }}>
        <button onClick={prevStep} disabled={currentStep === 0}>
          Prev Step
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep >= steps.length - 1 || steps.length === 0}
          style={{ marginLeft: 10 }}
        >
          Next Step
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <p>Comparisons: {metrics.comparisons || 0}</p>
        <p>Swaps: {metrics.swaps || 0}</p>
        <p>Time Taken: {metrics.time || 0} ms</p>
      </div>
    </div>
  );
}
