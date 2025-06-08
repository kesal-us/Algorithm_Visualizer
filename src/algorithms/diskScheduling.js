// src/algorithms/diskScheduling.js

// FCFS Disk Scheduling
// head: current head position
// requests: array of requested track positions
// Returns sequence of moves and total seek time
export function fcfsDisk(head, requests) {
  let sequence = [];
  let totalSeek = 0;
  let current = head;

  for (let r of requests) {
    let distance = Math.abs(current - r);
    sequence.push({ from: current, to: r, distance });
    totalSeek += distance;
    current = r;
  }

  return { sequence, totalSeek };
}

// SSTF Disk Scheduling (Shortest Seek Time First)
export function sstfDisk(head, requests) {
  let sequence = [];
  let totalSeek = 0;
  let current = head;
  let reqs = [...requests];
  
  while (reqs.length > 0) {
    // Find closest request to current head
    reqs.sort((a, b) => Math.abs(current - a) - Math.abs(current - b));
    let closest = reqs.shift();
    let distance = Math.abs(current - closest);
    sequence.push({ from: current, to: closest, distance });
    totalSeek += distance;
    current = closest;
  }

  return { sequence, totalSeek };
}

// SCAN Disk Scheduling (Elevator algorithm)
// head: start position
// requests: array of requested tracks
// direction: 'up' or 'down' (head movement direction)
// maxTrack: maximum track number on the disk (e.g., 199)
export function scanDisk(head, requests, direction = 'up', maxTrack = 199) {
  let sequence = [];
  let totalSeek = 0;
  let current = head;
  let reqs = [...requests];

  // Requests less than and greater than current head
  let left = reqs.filter(r => r < current).sort((a, b) => b - a);
  let right = reqs.filter(r => r >= current).sort((a, b) => a - b);

  if (direction === 'up') {
    // Move up servicing requests to the end
    for (let r of right) {
      let dist = Math.abs(current - r);
      sequence.push({ from: current, to: r, distance: dist });
      totalSeek += dist;
      current = r;
    }
    // Then move to max track (if not already there)
    if (current !== maxTrack) {
      let dist = Math.abs(current - maxTrack);
      sequence.push({ from: current, to: maxTrack, distance: dist });
      totalSeek += dist;
      current = maxTrack;
    }
    // Move down servicing left requests
    for (let r of left) {
      let dist = Math.abs(current - r);
      sequence.push({ from: current, to: r, distance: dist });
      totalSeek += dist;
      current = r;
    }
  } else {
    // direction === 'down'
    for (let r of left) {
      let dist = Math.abs(current - r);
      sequence.push({ from: current, to: r, distance: dist });
      totalSeek += dist;
      current = r;
    }
    // Then move to 0 track
    if (current !== 0) {
      let dist = Math.abs(current - 0);
      sequence.push({ from: current, to: 0, distance: dist });
      totalSeek += dist;
      current = 0;
    }
    // Move up servicing right requests
    for (let r of right) {
      let dist = Math.abs(current - r);
      sequence.push({ from: current, to: r, distance: dist });
      totalSeek += dist;
      current = r;
    }
  }

  return { sequence, totalSeek };
}

// C-SCAN Disk Scheduling (Circular SCAN)
export function cscanDisk(head, requests, maxTrack = 199) {
  let sequence = [];
  let totalSeek = 0;
  let current = head;
  let reqs = [...requests];

  // Requests less than and greater than current head
  let left = reqs.filter(r => r < current).sort((a, b) => a - b);
  let right = reqs.filter(r => r >= current).sort((a, b) => a - b);

  // Move up servicing requests on the right
  for (let r of right) {
    let dist = Math.abs(current - r);
    sequence.push({ from: current, to: r, distance: dist });
    totalSeek += dist;
    current = r;
  }
  // Move from last track to start track (circular jump)
  if (current !== maxTrack) {
    let dist = Math.abs(current - maxTrack);
    sequence.push({ from: current, to: maxTrack, distance: dist });
    totalSeek += dist;
    current = maxTrack;
  }
  // Jump from maxTrack to 0 (no servicing during jump, but counting seek)
  let jumpDist = maxTrack; // from maxTrack to 0
  sequence.push({ from: current, to: 0, distance: jumpDist });
  totalSeek += jumpDist;
  current = 0;

  // Move up servicing left requests (from 0 upwards)
  for (let r of left) {
    let dist = Math.abs(current - r);
    sequence.push({ from: current, to: r, distance: dist });
    totalSeek += dist;
    current = r;
  }

  return { sequence, totalSeek };
}
