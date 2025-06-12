// src/algorithms/cpuScheduling.js

// First-Come, First-Served (FCFS)
export function fcfs(processes) {
  processes.sort((a, b) => a.arrival - b.arrival);
  let currentTime = 0;
  let schedule = [];

  for (let p of processes) {
    let start = Math.max(currentTime, p.arrival);
    let end = start + p.burst;
    schedule.push({ pid: p.pid, start, end });
    currentTime = end;
  }
  return schedule;
}

// Shortest Job First (SJF) - Non-preemptive
export function sjf(processes) {
  let proc = processes.map(p => ({ ...p }));
  let currentTime = 0;
  let schedule = [];
  let completed = new Set();

  while (completed.size < proc.length) {
    // Pick process with shortest burst time among arrived & not completed
    let available = proc.filter(p => p.arrival <= currentTime && !completed.has(p.pid));
    if (available.length === 0) {
      // If none arrived, advance time
      currentTime++;
      continue;
    }
    available.sort((a, b) => a.burst - b.burst);
    let currentProc = available[0];
    let start = currentTime;
    let end = start + currentProc.burst;
    schedule.push({ pid: currentProc.pid, start, end });
    currentTime = end;
    completed.add(currentProc.pid);
  }
  return schedule;
}

// Round Robin (RR)
// quantum: time slice for each process
export function roundRobin(processes, quantum) {
  let proc = processes.map(p => ({
    pid: p.pid,
    arrival: p.arrival,
    burst: p.burst,
    remaining: p.burst,
  }));
  let currentTime = 0;
  let schedule = [];
  let queue = [];
  let completed = new Set();

  // Sort by arrival initially
  proc.sort((a, b) => a.arrival - b.arrival);

  while (completed.size < proc.length) {
    // Add newly arrived processes to queue
    proc.forEach(p => {
      if (p.arrival <= currentTime && !queue.includes(p) && !completed.has(p.pid) && !queue.some(q => q.pid === p.pid)) {
        queue.push(p);
      }
    });

    if (queue.length === 0) {
      currentTime++;
      continue;
    }

    let currentProc = queue.shift();
    let execTime = Math.min(quantum, currentProc.remaining);
    let start = currentTime;
    let end = start + execTime;

    schedule.push({ pid: currentProc.pid, start, end });

    currentProc.remaining -= execTime;
    currentTime = end;

    // Add newly arrived processes during this quantum
    proc.forEach(p => {
      if (p.arrival > start && p.arrival <= currentTime && !queue.includes(p) && !completed.has(p.pid)) {
        queue.push(p);
      }
    });

    if (currentProc.remaining > 0) {
      queue.push(currentProc);
    } else {
      completed.add(currentProc.pid);
    }
  }

  return schedule;
}

// Priority Scheduling (Non-preemptive)
// Assumes each process has a 'priority' property (lower number = higher priority)
export function priorityScheduling(processes) {
  let proc = processes.map(p => ({ ...p }));
  let currentTime = 0;
  let schedule = [];
  let completed = new Set();

  while (completed.size < proc.length) {
    // Pick highest priority among arrived & not completed
    let available = proc.filter(p => p.arrival <= currentTime && !completed.has(p.pid));
    if (available.length === 0) {
      currentTime++;
      continue;
    }
    available.sort((a, b) => a.priority - b.priority);
    let currentProc = available[0];
    let start = currentTime;
    let end = start + currentProc.burst;
    schedule.push({ pid: currentProc.pid, start, end });
    currentTime = end;
    completed.add(currentProc.pid);
  }

  return schedule;
}

// Shortest Remaining Time First (SRTF) - Preemptive SJF
export function srtf(processes) {
  let proc = processes.map(p => ({ ...p, remaining: p.burst }));
  let currentTime = 0;
  let schedule = [];
  let completed = new Set();
  let lastPid = null;

  while (completed.size < proc.length) {
    // Get all arrived and not completed processes
    let available = proc.filter(p => p.arrival <= currentTime && !completed.has(p.pid));
    if (available.length === 0) {
      currentTime++;
      continue;
    }

    // Choose process with shortest remaining time
    available.sort((a, b) => a.remaining - b.remaining);
    let currentProc = available[0];

    // Record a new execution slice if a different process is scheduled
    if (lastPid !== currentProc.pid) {
      schedule.push({ pid: currentProc.pid, start: currentTime, end: currentTime + 1 });
    } else {
      schedule[schedule.length - 1].end++;
    }

    currentProc.remaining--;
    if (currentProc.remaining === 0) completed.add(currentProc.pid);

    lastPid = currentProc.pid;
    currentTime++;
  }

  return schedule;
}

// Priority Scheduling (Preemptive)
export function priorityPreemptive(processes) {
  let proc = processes.map(p => ({ ...p, remaining: p.burst }));
  let currentTime = 0;
  let schedule = [];
  let completed = new Set();
  let lastPid = null;

  while (completed.size < proc.length) {
    let available = proc.filter(p => p.arrival <= currentTime && !completed.has(p.pid));
    if (available.length === 0) {
      currentTime++;
      continue;
    }

    // Choose highest priority (lowest number)
    available.sort((a, b) => a.priority - b.priority);
    let currentProc = available[0];

    if (lastPid !== currentProc.pid) {
      schedule.push({ pid: currentProc.pid, start: currentTime, end: currentTime + 1 });
    } else {
      schedule[schedule.length - 1].end++;
    }

    currentProc.remaining--;
    if (currentProc.remaining === 0) completed.add(currentProc.pid);

    lastPid = currentProc.pid;
    currentTime++;
  }

  return schedule;
}
