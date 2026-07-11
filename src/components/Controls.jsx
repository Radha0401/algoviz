import React from 'react'

export default function Controls({
  mode,
  algorithm,
  onAlgorithmChange,
  speed,
  onSpeedChange,
  arraySize,
  onArraySizeChange,
  density,
  onDensityChange,
  onGenerate,
  onPlay,
  onPause,
  isPlaying,
  isDone,
}) {
  const sortAlgorithms = [
    { value: 'merge', label: 'Merge Sort' },
    { value: 'quick', label: 'Quick Sort' },
  ]
  const graphAlgorithms = [
    { value: 'bfs', label: 'BFS' },
    { value: 'dfs', label: 'DFS' },
    { value: 'dijkstra', label: "Dijkstra's Algorithm" },
  ]
  const options = mode === 'sorting' ? sortAlgorithms : graphAlgorithms

  return (
    <div className="controls">
      <div className="control-group">
        <label>Algorithm</label>
        <select value={algorithm} onChange={(e) => onAlgorithmChange(e.target.value)}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label>Speed: {speed}ms</label>
        <input
          type="range"
          min="10"
          max="500"
          step="10"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        />
      </div>

      {mode === 'sorting' ? (
        <div className="control-group">
          <label>Array Size: {arraySize}</label>
          <input
            type="range"
            min="5"
            max="80"
            value={arraySize}
            onChange={(e) => onArraySizeChange(Number(e.target.value))}
          />
        </div>
      ) : (
        <div className="control-group">
          <label>Graph Density: {density.toFixed(2)}</label>
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.05"
            value={density}
            onChange={(e) => onDensityChange(Number(e.target.value))}
          />
        </div>
      )}

      <div className="control-group buttons">
        <button onClick={onGenerate}>Generate New</button>
        {isPlaying ? (
          <button onClick={onPause}>Pause</button>
        ) : (
          <button onClick={onPlay} disabled={isDone}>{isDone ? 'Done' : 'Play'}</button>
        )}
      </div>
    </div>
  )
}
