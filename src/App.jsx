import React, { useEffect, useMemo, useState, useCallback } from 'react'
import Controls from './components/Controls'
import SortingVisualizer from './components/SortingVisualizer'
import GraphVisualizer from './components/GraphVisualizer'
import { mergeSortSteps, quickSortSteps, randomArray } from './algorithms/sorting'
import { generateGrid, bfsSteps, dfsSteps, dijkstraSteps } from './algorithms/graph'

export default function App() {
  const [mode, setMode] = useState('sorting') // 'sorting' | 'graph'
  const [algorithm, setAlgorithm] = useState('merge')
  const [speed, setSpeed] = useState(120)
  const [arraySize, setArraySize] = useState(30)
  const [density, setDensity] = useState(0.6)

  const [baseArray, setBaseArray] = useState(() => randomArray(30))
  const [graph, setGraph] = useState(() => generateGrid(5, 6, 0.6))

  const [steps, setSteps] = useState([])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Rebuild the step list whenever algorithm/data changes
  const rebuildSteps = useCallback(() => {
    let generator
    if (mode === 'sorting') {
      generator = algorithm === 'merge' ? mergeSortSteps(baseArray) : quickSortSteps(baseArray)
    } else {
      const startId = 0
      generator =
        algorithm === 'bfs'
          ? bfsSteps(graph.adjacency, startId)
          : algorithm === 'dfs'
          ? dfsSteps(graph.adjacency, startId)
          : dijkstraSteps(graph.adjacency, startId, graph.nodes.length)
    }
    setSteps(Array.from(generator))
    setStepIndex(0)
    setIsPlaying(false)
  }, [mode, algorithm, baseArray, graph])

  useEffect(() => {
    rebuildSteps()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, algorithm, baseArray, graph])

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false)
      return
    }
    const timer = setTimeout(() => setStepIndex((i) => i + 1), speed)
    return () => clearTimeout(timer)
  }, [isPlaying, stepIndex, steps, speed])

  const handleGenerate = () => {
    if (mode === 'sorting') {
      setBaseArray(randomArray(arraySize))
    } else {
      setGraph(generateGrid(5, 6, density))
    }
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setAlgorithm(newMode === 'sorting' ? 'merge' : 'bfs')
  }

  const currentStep = steps[stepIndex]
  const isDone = steps.length > 0 && stepIndex >= steps.length - 1

  const displayArray = mode === 'sorting' ? (currentStep ? currentStep.array : baseArray) : null

  return (
    <div className="app">
      <header className="app-header">
        <h1>AlgoViz</h1>
        <p>Interactive DSA Visualizer — sorting &amp; graph algorithms, step by step</p>
        <div className="mode-toggle">
          <button className={mode === 'sorting' ? 'active' : ''} onClick={() => handleModeChange('sorting')}>
            Sorting
          </button>
          <button className={mode === 'graph' ? 'active' : ''} onClick={() => handleModeChange('graph')}>
            Graph
          </button>
        </div>
      </header>

      <Controls
        mode={mode}
        algorithm={algorithm}
        onAlgorithmChange={setAlgorithm}
        speed={speed}
        onSpeedChange={setSpeed}
        arraySize={arraySize}
        onArraySizeChange={setArraySize}
        density={density}
        onDensityChange={setDensity}
        onGenerate={handleGenerate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        isPlaying={isPlaying}
        isDone={isDone}
      />

      <div className="visualizer-panel">
        {mode === 'sorting' ? (
          <SortingVisualizer
            array={displayArray}
            highlightIndices={currentStep ? currentStep.indices : []}
            highlightType={currentStep ? currentStep.type : null}
          />
        ) : (
          <GraphVisualizer
            graph={graph}
            visited={currentStep ? currentStep.visited : []}
            current={currentStep ? currentStep.current : null}
            distances={algorithm === 'dijkstra' ? (currentStep ? currentStep.distances : null) : null}
            startId={0}
          />
        )}
      </div>

      <div className="step-info">
        Step {steps.length ? stepIndex + 1 : 0} / {steps.length}
      </div>
    </div>
  )
}
