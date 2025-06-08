import React, { useState } from 'react';
import { fcfsDisk, sstfDisk, scanDisk, cscanDisk } from '../algorithms/diskScheduling';

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

    if (algorithm === 'fcfs') {
      res = fcfsDisk(head, requests);
    } else if (algorithm === 'sstf') {
      res = sstfDisk(head, requests);
    } else if (algorithm === 'scan') {
      res = scanDisk(head, requests, direction, maxTrack);
    } else if (algorithm === 'cscan') {
      res = cscanDisk(head, requests, maxTrack);
    }

    setResult(res);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Disk Scheduling Algorithms</h2>

      <div>
        <label>
          Initial Head Position:{' '}
          <input
            type="number"
            value={head}
            onChange={e => setHead(Number(e.target.value))}
          />
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>
          Requests (comma separated):{' '}
          <input
            type="text"
            value={requestsStr}
            onChange={e => setRequestsStr(e.target.value)}
            style={{ width: 300 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>
          Select Algorithm:{' '}
          <select
            value={algorithm}
            onChange={e => setAlgorithm(e.target.value)}
          >
            <option value="fcfs">FCFS</option>
            <option value="sstf">SSTF</option>
            <option value="scan">SCAN</option>
            <option value="cscan">C-SCAN</option>
          </select>
        </label>
      </div>

      {(algorithm === 'scan') && (
        <div style={{ marginTop: 10 }}>
          <label>
            Direction:{' '}
            <select value={direction} onChange={e => setDirection(e.target.value)}>
              <option value="up">Up</option>
              <option value="down">Down</option>
            </select>
          </label>
        </div>
      )}

      {(algorithm === 'scan' || algorithm === 'cscan') && (
        <div style={{ marginTop: 10 }}>
          <label>
            Max Track Number:{' '}
            <input
              type="number"
              value={maxTrack}
              onChange={e => setMaxTrack(Number(e.target.value))}
            />
          </label>
        </div>
      )}

      <button onClick={runAlgorithm} style={{ marginTop: 20 }}>
        Run {algorithm.toUpperCase()}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
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
