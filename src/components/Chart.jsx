// src/components/Chart.js
import React from 'react';

export default function Chart({ data, barHeight = 120, isGantt = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'end', gap: 6, marginTop: 20 }}>
      {data.map((item, index) => {
        const height = isGantt ? 40 : item * 10;
        const label = isGantt ? item.pid : item;
        const width = isGantt ? (item.end - item.start) * 40 : 30;
        return (
          <div
            key={index}
            style={{
              height: height,
              width: width,
              backgroundColor: isGantt ? '#6fa8dc' : '#007acc',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 14,
              borderRadius: 4,
              position: 'relative',
            }}
          >
            {label}
            {isGantt && (
              <>
                <div style={{ position: 'absolute', top: '100%', left: 0, fontSize: 12 }}>{item.start}</div>
                <div style={{ position: 'absolute', top: '100%', right: 0, fontSize: 12 }}>{item.end}</div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
