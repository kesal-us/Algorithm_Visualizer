import React, { useState } from 'react';
import { binarySearch, linearSearch } from '../algorithms/searching';
import '../styles/searchingpage.css';

export default function SearchingPage() {
  const [array, setArray] = useState([1, 2, 4, 5, 7, 9]);
  const [target, setTarget] = useState(5);
  const [inputText, setInputText] = useState('1, 2, 4, 5, 7, 9');
  const [algo, setAlgo] = useState('binary');
  const [result, setResult] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');

  const parseInputArray = () => {
    const trimmed = inputText.trim();
    if (!trimmed) throw new Error('Please enter a valid array.');

    const arr = trimmed
      .split(',')
      .map(s => Number(s.trim()))
      .filter(n => !isNaN(n));

    if (arr.length === 0) throw new Error('Array is empty or contains invalid numbers.');
    return arr;
  };

  const generateRandomArray = () => {
    const arr = Array.from({ length: Math.floor(Math.random() * 21) + 5 }, () => Math.floor(Math.random() * 50) + 1).sort((a, b) => a - b);
    setArray(arr);
    setInputText(arr.join(', '));
    setResult(null);
    setStepIndex(0);
    setError('');
  };

  const runSearch = () => {
    try {
      const arr = parseInputArray();
      const tgt = Number(target);
      if (isNaN(tgt)) throw new Error('Target must be a number.');
      setArray(arr);
      setStepIndex(0);

      let res;
      const t0 = performance.now();
      if (algo === 'binary') res = binarySearch(arr, tgt);
      else res = linearSearch(arr, tgt);
      const t1 = performance.now();

      setResult({ ...res, time: (t1 - t0).toFixed(2), algo: algo === 'binary' ? 'Binary Search' : 'Linear Search' });
      setError('');
    } catch (err) {
      setResult(null);
      setError(err.message || 'Invalid input');
    }
  };

  const nextStep = () => {
    if (result && stepIndex < result.steps.length - 1) setStepIndex(stepIndex + 1);
  };

  const prevStep = () => {
    if (result && stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const currentStep = result ? result.steps[stepIndex] : null;

  return (
    <div className="searching-container">
      <h2>Searching Algorithms Visualizer</h2>

      <div className="searching-controls">
        <label>
          Algorithm:
          <select value={algo} onChange={(e) => setAlgo(e.target.value)}>
            <option value="binary">Binary Search</option>
            <option value="linear">Linear Search</option>
          </select>
        </label>
        <button onClick={generateRandomArray}>
          New Random Array
        </button>
        <button onClick={runSearch}>
          Run Search
        </button>
      </div>

      <div className="searching-controls">
        <label>
          Array (comma-separated):
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </label>

        <label>
          Target:
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </label>
      </div>

      {error && <p className="searching-error">{error}</p>}

      <div className="searching-bars">
        {array.map((val, idx) => {
          let barClass = 'bar-box bar-normal';
          if (currentStep) {
            if (algo === 'binary') {
              if (idx === currentStep.mid) barClass = 'bar-box bar-highlight';
              else if (idx >= currentStep.left && idx <= currentStep.right) barClass = 'bar-box bar-secondary';
              else barClass = 'bar-box bar-outside-range';
            } else if (algo === 'linear') {
              if (idx === currentStep.checkingIndex) barClass = 'bar-box bar-highlight';
            }
          }
          return (
            <div key={idx} className={barClass}>
              {val}
            </div>
          );
        })}
      </div>

      {currentStep && (
        <div className="searching-explanation">
          Explanation:{' '}
          {algo === 'binary' ? (
            <>
              Checking middle index <strong>{currentStep.mid}</strong> (
              value: <strong>{array[currentStep.mid]}</strong>) with left ={' '}
              <strong>{currentStep.left}</strong> and right ={' '}
              <strong>{currentStep.right}</strong>.
            </>
          ) : (
            <>
              Checking index <strong>{currentStep.checkingIndex}</strong> (
              value: <strong>{array[currentStep.checkingIndex]}</strong>).
            </>
          )}
        </div>
      )}

      {result && (
        <div className="searching-result">
          <p>Algorithm: {result.algo}</p>
          <p>Found: {result.found ? 'Yes' : 'No'}</p>
          <p>Index: {result.index}</p>
          <p>Comparisons: {result.comparisons}</p>
          <p>Time Taken: {result.time} ms</p>

          <div className="step-navigation">
            <button onClick={prevStep} disabled={stepIndex === 0}>
              Prev Step
            </button>
            <button onClick={nextStep} disabled={stepIndex === result.steps.length - 1}>
              Next Step
            </button>
            <p>
              Step {stepIndex + 1} / {result.steps.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
