import React, { useState, useEffect } from 'react';
import {
  fcfs,
  sjf,
  srtf,
  rr,
  priorityNonPreemptive,
  priorityPreemptive
} from '../algorithms/cpuScheduling';
import '../styles/CpuPage.css';

export default function CpuPage() {
  const [processes, setProcesses] = useState([
    { pid: 'P1', arrival: 0, burst: 5, priority: 2 },
    { pid: 'P2', arrival: 1, burst: 3, priority: 1 },
    { pid: 'P3', arrival: 2, burst: 8, priority: 3 },
  ]);

  const [pid, setPid] = useState('P4');
  const [arrival, setArrival] = useState('');
  const [burst, setBurst] = useState('');
  const [priority, setPriority] = useState('');

  const [algo, setAlgo] = useState('FCFS');
  const [quantum, setQuantum] = useState(2);

  const [schedule, setSchedule] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [lastRunAlgo, setLastRunAlgo] = useState('');

  const algoNames = {
    FCFS: 'First-Come, First-Served',
    SJF: 'Shortest Job First',
    SRTF: 'Shortest Remaining Time First',
    RR: 'Round Robin',
    'Priority (Non-Preemptive)': 'Priority Scheduling (Non-Preemptive)',
    'Priority (Preemptive)': 'Priority Scheduling (Preemptive)',
  };

  const isQuantumAlgo = algo === 'RR';

  useEffect(() => {
    setCurrentStep(0);
  }, [steps]);

  const addProcess = () => {
    if (!pid || arrival === '' || burst === '' || priority === '') return;
    const newProc = {
      pid,
      arrival: parseInt(arrival, 10),
      burst: parseInt(burst, 10),
      priority: parseInt(priority, 10),
    };
    setProcesses(prev => [...prev, newProc]);
    setPid(`P${processes.length + 2}`);
    setArrival('');
    setBurst('');
    setPriority('');
  };

  const removeProcess = (id) => {
    setProcesses(prev => prev.filter(p => p.pid !== id));
  };

  const runScheduling = () => {
    const copy = JSON.parse(JSON.stringify(processes));
    let result = { schedule: [], steps: [] };
    switch (algo) {
      case 'FCFS': result = fcfs(copy); break;
      case 'SJF': result = sjf(copy); break;
      case 'SRTF': result = srtf(copy); break;
      case 'RR': result = rr(copy, quantum); break;
      case 'Priority (Non-Preemptive)': result = priorityNonPreemptive(copy); break;
      case 'Priority (Preemptive)': result = priorityPreemptive(copy); break;
    }
    setSchedule(result.schedule);
    setSteps(result.steps);
    setLastRunAlgo(algo);
  };

  const cs = steps[currentStep] || { time: '-', queue: [], running: '-' };

  return (
    <div className="cpu-container">
      <h2>CPU Scheduling Visualizer</h2>

      <div className="input-section">
        <input placeholder="PID" value={pid} onChange={e => setPid(e.target.value)} />
        <input type="number" placeholder="Arrival" value={arrival} onChange={e => setArrival(e.target.value)} />
        <input type="number" placeholder="Burst" value={burst} onChange={e => setBurst(e.target.value)} />
        <input type="number" placeholder="Priority" value={priority} onChange={e => setPriority(e.target.value)} />
        <button onClick={addProcess}>Add Process</button>
      </div>

      <div className="process-table">
        <table>
          <thead>
            <tr>
              <th>PID</th>
              <th>Arrival Time</th>
              <th>Burst Time</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {processes.map(p => (
              <tr key={p.pid}>
                <td>{p.pid}</td>
                <td>{p.arrival}</td>
                <td>{p.burst}</td>
                <td>{p.priority}</td>
                <td><button onClick={() => removeProcess(p.pid)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="settings-section">
        <select value={algo} onChange={e => setAlgo(e.target.value)}>
          <option>FCFS</option>
          <option>SJF</option>
          <option>SRTF</option>
          <option>RR</option>
          <option>Priority (Non-Preemptive)</option>
          <option>Priority (Preemptive)</option>
        </select>

        {isQuantumAlgo && (
          <input
            type="number"
            value={quantum}
            min="1"
            onChange={e => setQuantum(parseInt(e.target.value, 10))}
            placeholder="Quantum"
          />
        )}

        <button onClick={runScheduling}>Run Algorithm</button>
      </div>

      {steps.length > 0 && (
        <>
          <div className="gantt-chart">
  <h3>Gantt Chart</h3>
  <div className="gantt-bar">
    {schedule.map((it, idx) => (
      <div
        key={idx}
        className="gantt-column"
        style={{ width: `${(it.end - it.start) * 30}px` }}
      >
        <div className="gantt-block">{it.pid}</div>
      </div>
    ))}
  </div>
  <div className="gantt-times">
    {schedule.map((it, idx) => (
      <div
        key={idx}
        className="gantt-time"
        style={{ width: `${(it.end - it.start) * 30}px` }}
      >
        {it.start}
      </div>
    ))}
    {/* Final end time aligned after last block */}
    <div className="gantt-time">{schedule[schedule.length - 1].end}</div>
  </div>
</div>





          <div className="steps-section">
            <h3>Step-by-Step Execution</h3>
            <p><strong>Time:</strong> {cs.time}, <strong>Running:</strong> {cs.running}, <strong>Queue:</strong> [{cs.queue.join(', ') || 'Empty'}]</p>

            <div className="navigation-buttons">
              <button onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))} disabled={currentStep === 0}>
                Prev
              </button>
              <button onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))} disabled={currentStep === steps.length - 1}>
                Next
              </button>
            </div>
          </div>

          <div className="metrics">
            <p><strong>Algorithm:</strong> {algoNames[lastRunAlgo]}</p>
            <p><strong>Total Steps:</strong> {steps.length}</p>
          </div>
        </>
      )}
    </div>
  );
}
