// src/algorithms/diskScheduling.js

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

export function sstfDisk(head, requests) {
  let sequence = [];
  let totalSeek = 0;
  let current = head;
  let reqs = [...requests];
  
  while (reqs.length > 0) {
    reqs.sort((a, b) => Math.abs(current - a) - Math.abs(current - b));
    let closest = reqs.shift();
    let distance = Math.abs(current - closest);
    sequence.push({ from: current, to: closest, distance });
    totalSeek += distance;
    current = closest;
  }

  return { sequence, totalSeek };
}

export function scanDisk(head, requests, direction = 'up', maxTrack = 199) {
  let sequence = [];
  let totalSeek = 0;
  let current = head;
  let reqs = [...requests];

  let left = reqs.filter(r => r < current).sort((a, b) => b - a);
  let right = reqs.filter(r => r >= current).sort((a, b) => a - b);

  if (direction === 'up') {
    for (let r of right) {
      let dist = Math.abs(current - r);
      sequence.push({ from: current, to: r, distance: dist });
      totalSeek += dist;
      current = r;
    }
    if (current !== maxTrack) {
      let dist = Math.abs(current - maxTrack);
      sequence.push({ from: current, to: maxTrack, distance: dist });
      totalSeek += dist;
      current = maxTrack;
    }
    for (let r of left) {
      let dist = Math.abs(current - r);
      sequence.push({ from: current, to: r, distance: dist });
      totalSeek += dist;
      current = r;
    }
  } else {
    for (let r of left) {
      let dist = Math.abs(current - r);
      sequence.push({ from: current, to: r, distance: dist });
      totalSeek += dist;
      current = r;
    }
    if (current !== 0) {
      let dist = Math.abs(current - 0);
      sequence.push({ from: current, to: 0, distance: dist });
      totalSeek += dist;
      current = 0;
    }
    for (let r of right) {
      let dist = Math.abs(current - r);
      sequence.push({ from: current, to: r, distance: dist });
      totalSeek += dist;
      current = r;
    }
  }

  return { sequence, totalSeek };
}

export function cscanDisk(head, requests, maxTrack = 199) {
  let sequence = [];
  let totalSeek = 0;
  let current = head;
  let reqs = [...requests];

  let left = reqs.filter(r => r < current).sort((a, b) => a - b);
  let right = reqs.filter(r => r >= current).sort((a, b) => a - b);

  for (let r of right) {
    let dist = Math.abs(current - r);
    sequence.push({ from: current, to: r, distance: dist });
    totalSeek += dist;
    current = r;
  }
  if (current !== maxTrack) {
    let dist = Math.abs(current - maxTrack);
    sequence.push({ from: current, to: maxTrack, distance: dist });
    totalSeek += dist;
    current = maxTrack;
  }

  let jumpDist = maxTrack; // from maxTrack to 0
  sequence.push({ from: current, to: 0, distance: jumpDist });
  totalSeek += jumpDist;
  current = 0;

  for (let r of left) {
    let dist = Math.abs(current - r);
    sequence.push({ from: current, to: r, distance: dist });
    totalSeek += dist;
    current = r;
  }

  return { sequence, totalSeek };
}

// LOOK Disk Scheduling
export function lookDisk(head, requests, direction = 'up') {
  let sequence = [];
  let totalSeek = 0;
  let current = head;
  let reqs = [...requests];

  let left = reqs.filter(r => r < current).sort((a, b) => b - a);
  let right = reqs.filter(r => r >= current).sort((a, b) => a - b);

  if (direction === 'up') {
    for (let r of right) {
      let dist = Math.abs(current - r);
      sequence.push({ from: current, to: r, distance: dist });
      totalSeek += dist;
      current = r;
    }
    for (let r of left) {
      let dist = Math.abs(current - r);
      sequence.push({ from: current, to: r, distance: dist });
      totalSeek += dist;
      current = r;
    }
  } else {
    for (let r of left) {
      let dist = Math.abs(current - r);
      sequence.push({ from: current, to: r, distance: dist });
      totalSeek += dist;
      current = r;
    }
    for (let r of right) {
      let dist = Math.abs(current - r);
      sequence.push({ from: current, to: r, distance: dist });
      totalSeek += dist;
      current = r;
    }
  }

  return { sequence, totalSeek };
}

// C-LOOK Disk Scheduling
export function clookDisk(head, requests) {
  let sequence = [];
  let totalSeek = 0;
  let current = head;
  let reqs = [...requests];

  let left = reqs.filter(r => r < current).sort((a, b) => a - b);
  let right = reqs.filter(r => r >= current).sort((a, b) => a - b);

  for (let r of right) {
    let dist = Math.abs(current - r);
    sequence.push({ from: current, to: r, distance: dist });
    totalSeek += dist;
    current = r;
  }

  if (left.length > 0) {
    let jumpDist = Math.abs(current - left[0]);
    sequence.push({ from: current, to: left[0], distance: jumpDist });
    totalSeek += jumpDist;
    current = left[0];
  }

  for (let i = 1; i < left.length; i++) {
    let dist = Math.abs(current - left[i]);
    sequence.push({ from: current, to: left[i], distance: dist });
    totalSeek += dist;
    current = left[i];
  }

  return { sequence, totalSeek };
}
