import React, { useState } from 'react';
import { fcfs, sjf, roundRobin, priorityScheduling } from '../algorithms/cpuScheduling';
import Chart from '../components/Chart';

export default function cpuPage() {
  const [processes, setProcesses] = useState([
    { pid: 'P1', arrival: 0, burst: 4, priority: 2 },
    { pid: 'P2', arrival: 2, burst: 3, priority: 1 },
    { pid: 'P3', arrival: 4, burst: 1, priority: 3 },
  ]);

  const [newProcess, setNewProcess] = useState({ pid: '', arrival: '', burst: '', priority: '' });
  const [gantt, setGantt] = useState([]);
  const [selectedAlgo, setSelectedAlgo] = useState('fcfs');
  const [quantum, setQuantum] = useState(2);
  const [avgWaitingTime, setAvgWaitingTime] = useState(null);
  const [avgTurnaroundTime, setAvgTurnaroundTime] = useState(null);

  const addProcess = () => {
    const { pid, arrival, burst, priority } = newProcess;
    if (!pid || arrival === '' || burst === '' || (selectedAlgo === 'priority' && priority === '')) return;

    setProcesses([...processes, {
      pid,
      arrival: parseInt(arrival),
      burst: parseInt(burst),
      priority: parseInt(priority)
    }]);

    setNewProcess({ pid: '', arrival: '', burst: '', priority: '' });
  };

  const runScheduling = () => {
    let schedule;
    if (selectedAlgo === 'fcfs') schedule = fcfs(processes);
    else if (selectedAlgo === 'sjf') schedule = sjf(processes);
    else if (selectedAlgo === 'rr') schedule = roundRobin(processes, quantum);
    else if (selectedAlgo === 'priority') schedule = priorityScheduling(processes);
    else schedule = [];

    setGantt(schedule);

    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    for (let p of processes) {
      let executions = schedule.filter(s => s.pid === p.pid);
      if (executions.length === 0) continue;

      let startTime = executions[0].start;
      let endTime = executions[executions.length - 1].end;

      let turnaroundTime = endTime - p.arrival;
      let waitingTime = turnaroundTime - p.burst;

      totalWaitingTime += waitingTime;
      totalTurnaroundTime += turnaroundTime;
    }

    setAvgWaitingTime((totalWaitingTime / processes.length).toFixed(2));
    setAvgTurnaroundTime((totalTurnaroundTime / processes.length).toFixed(2));
  };

  const clearProcesses = () => {
    setProcesses([]);
    setGantt([]);
    setAvgWaitingTime(null);
    setAvgTurnaroundTime(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>CPU Scheduling Algorithms</h2>

      <div>
        <h3>Enter New Process</h3>
        <input
          type="text"
          placeholder="PID"
          value={newProcess.pid}
          onChange={(e) => setNewProcess({ ...newProcess, pid: e.target.value })}
        />
        <input
          type="number"
          placeholder="Arrival Time"
          value={newProcess.arrival}
          onChange={(e) => setNewProcess({ ...newProcess, arrival: e.target.value })}
        />
        <input
          type="number"
          placeholder="Burst Time"
          value={newProcess.burst}
          onChange={(e) => setNewProcess({ ...newProcess, burst: e.target.value })}
        />
        {selectedAlgo === 'priority' && (
          <input
            type="number"
            placeholder="Priority"
            value={newProcess.priority}
            onChange={(e) => setNewProcess({ ...newProcess, priority: e.target.value })}
          />
        )}
        <button onClick={addProcess} style={{ marginLeft: 10 }}>Add Process</button>
        <button onClick={clearProcesses} style={{ marginLeft: 10, color: 'red' }}>Clear All</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Processes</h3>
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Process ID</th>
              <th>Arrival Time</th>
              <th>Burst Time</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p, i) => (
              <tr key={i}>
                <td>{p.pid}</td>
                <td>{p.arrival}</td>
                <td>{p.burst}</td>
                <td>{p.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>
          Select Algorithm:{' '}
          <select value={selectedAlgo} onChange={e => setSelectedAlgo(e.target.value)}>
            <option value="fcfs">First-Come, First-Served (FCFS)</option>
            <option value="sjf">Shortest Job First (SJF)</option>
            <option value="rr">Round Robin (RR)</option>
            <option value="priority">Priority Scheduling</option>
          </select>
        </label>
      </div>

      {selectedAlgo === 'rr' && (
        <div style={{ marginTop: 10 }}>
          <label>
            Quantum (time slice):{' '}
            <input
              type="number"
              min="1"
              value={quantum}
              onChange={e => setQuantum(Number(e.target.value))}
            />
          </label>
        </div>
      )}

      <button onClick={runScheduling} style={{ marginTop: 20 }}>
        Run {selectedAlgo.toUpperCase()} Scheduling
      </button>

      {gantt.length > 0 && (
        <>
          <h3>Gantt Chart</h3>
          <div style={{ display: 'flex', marginTop: 10, flexWrap: 'wrap' }}>
            {gantt.map((p, i) => {
              const width = (p.end - p.start) * 40;
              return (
                <div
                  key={i + p.pid + p.start}
                  style={{
                    border: '1px solid black',
                    width,
                    textAlign: 'center',
                    padding: '10px 5px',
                    backgroundColor: '#6fa8dc',
                    marginRight: 2,
                    color: 'white',
                    fontWeight: 'bold',
                    position: 'relative',
                    marginBottom: 5,
                  }}
                >
                  {p.pid}
                  <div style={{ position: 'absolute', top: '100%', left: 0, fontSize: 12 }}>
                    {p.start}
                  </div>
                  <div style={{ position: 'absolute', top: '100%', right: 0, fontSize: 12 }}>
                    {p.end}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 20 }}>
            <p>Average Waiting Time: {avgWaitingTime}</p>
            <p>Average Turnaround Time: {avgTurnaroundTime}</p>
          </div>
        </>
      )}
    </div>
  );
}
