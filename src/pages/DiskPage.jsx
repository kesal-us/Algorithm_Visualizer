import React, { useState } from 'react';
import {
  fcfsDisk,
  sstfDisk,
  scanDisk,
  cscanDisk,
  lookDisk,
  clookDisk,
} from '../algorithms/diskScheduling';
import '../styles/diskpage.css';

export default function DiskPage() {
  const [head, setHead] = useState(50);
  const [requestsStr, setRequestsStr] = useState('82, 170, 43, 140, 24, 16, 190');
  const [algorithm, setAlgorithm] = useState('fcfs');
  const [direction, setDirection] = useState('up');
  const [maxTrack, setMaxTrack] = useState(199);
  const [result, setResult] = useState(null);

  const parseRequests = () => {
    return requestsStr
      .split(',')
      .map(r => parseInt(r.trim()))
      .filter(r => !isNaN(r));
  };

  const runAlgorithm = () => {
    const requests = parseRequests();
    let res;

    switch (algorithm) {
      case 'fcfs':
        res = fcfsDisk(head, requests);
        break;
      case 'sstf':
        res = sstfDisk(head, requests);
        break;
      case 'scan':
        res = scanDisk(head, requests, direction, maxTrack);
        break;
      case 'cscan':
        res = cscanDisk(head, requests, maxTrack);
        break;
      case 'look':
        res = lookDisk(head, requests, direction);
        break;
      case 'clook':
        res = clookDisk(head, requests);
        break;
      default:
        res = null;
    }

    setResult(res);
  };

  return (
    <div className="disk-container">
      <h2>Disk Scheduling Algorithms</h2>

      <div className="input-group">
        <label>Initial Head Position:</label>
        <input
          type="number"
          value={head}
          onChange={e => setHead(Number(e.target.value))}
        />
      </div>

      <div className="input-group">
        <label>Requests (comma separated):</label>
        <input
          type="text"
          value={requestsStr}
          onChange={e => setRequestsStr(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Select Algorithm:</label>
        <select value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
          <option value="fcfs">FCFS</option>
          <option value="sstf">SSTF</option>
          <option value="scan">SCAN</option>
          <option value="cscan">C-SCAN</option>
          <option value="look">LOOK</option>
          <option value="clook">C-LOOK</option>
        </select>
      </div>

      {(algorithm === 'scan' || algorithm === 'look') && (
        <div className="input-group">
          <label>Direction:</label>
          <select value={direction} onChange={e => setDirection(e.target.value)}>
            <option value="up">Up</option>
            <option value="down">Down</option>
          </select>
        </div>
      )}

      {(algorithm === 'scan' || algorithm === 'cscan') && (
        <div className="input-group">
          <label>Max Track Number:</label>
          <input
            type="number"
            value={maxTrack}
            onChange={e => setMaxTrack(Number(e.target.value))}
          />
        </div>
      )}

      <button className="run-button" onClick={runAlgorithm}>
        Run {algorithm.toUpperCase()}
      </button>

      {result && (
        <div className="result-section">
          <h3>Seek Sequence:</h3>
          <ul>
            {result.sequence.map(({ from, to, distance }, i) => (
              <li key={i}>
                Move from {from} to {to} (distance: {distance})
              </li>
            ))}
          </ul>
          <p><strong>Total Seek Time:</strong> {result.totalSeek}</p>
        </div>
      )}
    </div>
  );
}
