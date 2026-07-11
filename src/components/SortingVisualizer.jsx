import React from 'react'

export default function SortingVisualizer({ array, highlightIndices, highlightType }) {
  const max = Math.max(...array, 1)

  const colorFor = (idx) => {
    if (!highlightIndices.includes(idx)) return '#4f46e5'
    if (highlightType === 'compare') return '#f59e0b'
    if (highlightType === 'swap') return '#ef4444'
    if (highlightType === 'overwrite') return '#ef4444'
    if (highlightType === 'sorted') return '#22c55e'
    return '#4f46e5'
  }

  return (
    <div className="bars-container">
      {array.map((value, idx) => (
        <div
          key={idx}
          className="bar"
          style={{
            height: `${(value / max) * 100}%`,
            background: colorFor(idx),
            width: `${Math.max(4, 100 / array.length - 1)}%`,
          }}
          title={value}
        />
      ))}
    </div>
  )
}
