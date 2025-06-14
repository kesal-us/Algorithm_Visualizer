// cpuScheduling.js

function recordIdle(schedule, steps, currentTime, nextTime) {
  if (currentTime < nextTime) {
    schedule.push({ pid: 'Idle', start: currentTime, end: nextTime });
    for (let t = currentTime; t < nextTime; t++) {
      steps.push({ time: t, queue: [], running: null });
    }
  }
}

// FCFS
export function fcfs(processes) {
  processes.sort((a, b) => a.arrival - b.arrival);
  let currentTime = 0, schedule = [], steps = [];

  for (let p of processes) {
    if (p.arrival > currentTime) {
      recordIdle(schedule, steps, currentTime, p.arrival);
      currentTime = p.arrival;
    }
    let start = currentTime;
    let end = start + p.burst;
    schedule.push({ pid: p.pid, start, end });

    for (let t = start; t < end; t++) {
      let queue = processes.filter(pr => pr.arrival <= t && pr.pid !== p.pid).map(pr => pr.pid);
      steps.push({ time: t, queue, running: p.pid });
    }
    currentTime = end;
  }

  return { schedule, steps };
}

// SJF
export function sjf(processes) {
  let currentTime = 0, schedule = [], steps = [], completed = new Set();

  while (completed.size < processes.length) {
    let available = processes
      .filter(p => p.arrival <= currentTime && !completed.has(p.pid))
      .sort((a, b) => a.burst - b.burst || a.arrival - b.arrival);

    if (available.length === 0) {
      steps.push({ time: currentTime, queue: [], running: null });
      currentTime++;
      continue;
    }

    let p = available[0];
    let start = currentTime;
    let end = start + p.burst;
    schedule.push({ pid: p.pid, start, end });

    for (let t = start; t < end; t++) {
      let queue = processes.filter(pr => pr.arrival <= t && !completed.has(pr.pid) && pr.pid !== p.pid).map(pr => pr.pid);
      steps.push({ time: t, queue, running: p.pid });
    }

    currentTime = end;
    completed.add(p.pid);
  }

  return { schedule, steps };
}

// SRTF
export function srtf(processes) {
  let currentTime = 0, remaining = {}, schedule = [], steps = [], lastPid = null;
  let completed = 0, n = processes.length;

  processes.forEach(p => remaining[p.pid] = p.burst);

  while (completed < n) {
    let available = processes
      .filter(p => p.arrival <= currentTime && remaining[p.pid] > 0)
      .sort((a, b) => remaining[a.pid] - remaining[b.pid] || a.arrival - b.arrival);

    if (available.length === 0) {
      steps.push({ time: currentTime, queue: [], running: null });
      currentTime++;
      continue;
    }

    let p = available[0];
    if (lastPid !== p.pid) {
      schedule.push({ pid: p.pid, start: currentTime, end: currentTime + 1 });
    } else {
      schedule[schedule.length - 1].end++;
    }

    remaining[p.pid]--;
    if (remaining[p.pid] === 0) completed++;

    let queue = available.filter(pr => pr.pid !== p.pid).map(pr => pr.pid);
    steps.push({ time: currentTime, queue, running: p.pid });

    lastPid = p.pid;
    currentTime++;
  }

  return { schedule, steps };
}

// Round Robin
export function rr(processes, quantum = 2) {
  let currentTime = 0, schedule = [], steps = [], queue = [];
  let remaining = {}, visited = new Set();

  processes.forEach(p => remaining[p.pid] = p.burst);

  while (queue.length > 0 || processes.some(p => p.arrival <= currentTime && remaining[p.pid] > 0)) {
    for (let p of processes) {
      if (p.arrival <= currentTime && !visited.has(p.pid)) {
        queue.push(p);
        visited.add(p.pid);
      }
    }

    if (queue.length === 0) {
      steps.push({ time: currentTime, queue: [], running: null });
      currentTime++;
      continue;
    }

    let p = queue.shift();
    let timeSlice = Math.min(quantum, remaining[p.pid]);
    schedule.push({ pid: p.pid, start: currentTime, end: currentTime + timeSlice });

    for (let t = 0; t < timeSlice; t++) {
      let q = queue.map(pr => pr.pid);
      steps.push({ time: currentTime, queue: q, running: p.pid });
      currentTime++;
    }

    remaining[p.pid] -= timeSlice;

    for (let pr of processes) {
      if (pr.arrival <= currentTime && !visited.has(pr.pid)) {
        queue.push(pr);
        visited.add(pr.pid);
      }
    }

    if (remaining[p.pid] > 0) queue.push(p);
  }

  return { schedule, steps };
}

// Priority (Non-preemptive)
export function priorityNonPreemptive(processes) {
  let currentTime = 0, schedule = [], steps = [], completed = new Set();

  while (completed.size < processes.length) {
    let available = processes
      .filter(p => p.arrival <= currentTime && !completed.has(p.pid))
      .sort((a, b) => a.priority - b.priority || a.arrival - b.arrival);

    if (available.length === 0) {
      steps.push({ time: currentTime, queue: [], running: null });
      currentTime++;
      continue;
    }

    let p = available[0];
    let start = currentTime;
    let end = start + p.burst;
    schedule.push({ pid: p.pid, start, end });

    for (let t = start; t < end; t++) {
      let queue = processes.filter(pr => pr.arrival <= t && pr.pid !== p.pid && !completed.has(pr.pid)).map(pr => pr.pid);
      steps.push({ time: t, queue, running: p.pid });
    }

    currentTime = end;
    completed.add(p.pid);
  }

  return { schedule, steps };
}

// Priority (Preemptive)
export function priorityPreemptive(processes) {
  let currentTime = 0, schedule = [], steps = [], remaining = {};
  let completed = 0, lastPid = null, n = processes.length;

  processes.forEach(p => remaining[p.pid] = p.burst);

  while (completed < n) {
    let available = processes
      .filter(p => p.arrival <= currentTime && remaining[p.pid] > 0)
      .sort((a, b) => a.priority - b.priority || a.arrival - b.arrival);

    if (available.length === 0) {
      steps.push({ time: currentTime, queue: [], running: null });
      currentTime++;
      continue;
    }

    let p = available[0];
    if (lastPid !== p.pid) {
      schedule.push({ pid: p.pid, start: currentTime, end: currentTime + 1 });
    } else {
      schedule[schedule.length - 1].end++;
    }

    remaining[p.pid]--;
    if (remaining[p.pid] === 0) completed++;

    let queue = available.filter(pr => pr.pid !== p.pid).map(pr => pr.pid);
    steps.push({ time: currentTime, queue, running: p.pid });

    lastPid = p.pid;
    currentTime++;
  }

  return { schedule, steps };
}
