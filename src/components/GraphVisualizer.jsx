import React from 'react'

const CELL = 70

export default function GraphVisualizer({ graph, visited, current, distances, startId }) {
  if (!graph) return null
  const { nodes, edges } = graph
  const maxRow = Math.max(...nodes.map((n) => n.row))
  const maxCol = Math.max(...nodes.map((n) => n.col))
  const width = (maxCol + 1) * CELL
  const height = (maxRow + 1) * CELL

  const pos = (id) => {
    const node = nodes.find((n) => n.id === id)
    return { x: node.col * CELL + CELL / 2, y: node.row * CELL + CELL / 2 }
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="graph-svg" width="100%">
      {edges.map((e, i) => {
        const a = pos(e.from)
        const b = pos(e.to)
        return (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#d1d5db" strokeWidth="2" />
            {distances && (
              <text
                x={(a.x + b.x) / 2}
                y={(a.y + b.y) / 2}
                fontSize="10"
                fill="#9ca3af"
                textAnchor="middle"
              >
                {e.weight}
              </text>
            )}
          </g>
        )
      })}
      {nodes.map((n) => {
        const isVisited = visited.includes(n.id)
        const isCurrent = current === n.id
        const isStart = n.id === startId
        const fill = isCurrent ? '#ef4444' : isStart ? '#22c55e' : isVisited ? '#4f46e5' : '#e5e7eb'
        return (
          <g key={n.id}>
            <circle cx={n.col * CELL + CELL / 2} cy={n.row * CELL + CELL / 2} r="16" fill={fill} />
            <text
              x={n.col * CELL + CELL / 2}
              y={n.row * CELL + CELL / 2 + 4}
              fontSize="11"
              fill="#fff"
              textAnchor="middle"
            >
              {n.id}
            </text>
            {distances && distances[n.id] !== undefined && distances[n.id] !== Infinity && (
              <text
                x={n.col * CELL + CELL / 2}
                y={n.row * CELL + CELL / 2 - 22}
                fontSize="10"
                fill="#111827"
                textAnchor="middle"
              >
                d={distances[n.id]}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
