/**
 * Graph utilities + traversal algorithms as generators.
 *
 * The graph is a grid of nodes; edges connect grid-adjacent nodes with
 * probability = density (controls how sparse/dense the graph is).
 * Each edge has a random weight (used by Dijkstra).
 */

export function generateGrid(rows, cols, density = 0.6) {
  const nodes = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      nodes.push({ id: r * cols + c, row: r, col: c })
    }
  }

  const edges = []
  const adjacency = new Map(nodes.map((n) => [n.id, []]))
  const edgeSet = new Set() // "a-b" keys already added, to avoid duplicates

  const addEdge = (aId, bId) => {
    const key = aId < bId ? `${aId}-${bId}` : `${bId}-${aId}`
    if (edgeSet.has(key)) return
    edgeSet.add(key)
    const weight = Math.floor(Math.random() * 9) + 1
    edges.push({ from: aId, to: bId, weight })
    adjacency.get(aId).push({ to: bId, weight })
    adjacency.get(bId).push({ to: aId, weight })
  }

  // --- Union-Find, used to guarantee the graph ends up fully connected ---
  const parent = nodes.map((n) => n.id)
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])))
  const union = (a, b) => {
    const ra = find(a), rb = find(b)
    if (ra === rb) return false
    parent[ra] = rb
    return true
  }

  // Candidate grid-adjacency pairs (right + bottom neighbor)
  const candidates = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = r * cols + c
      if (c + 1 < cols) candidates.push([id, r * cols + (c + 1)])
      if (r + 1 < rows) candidates.push([id, (r + 1) * cols + c])
    }
  }

  // Pass 1: randomized spanning tree first, guarantees connectivity
  const shuffled = [...candidates].sort(() => Math.random() - 0.5)
  for (const [a, b] of shuffled) {
    if (union(a, b)) addEdge(a, b)
  }

  // Pass 2: add extra edges on top, based on density, for a denser-looking graph
  for (const [a, b] of candidates) {
    if (Math.random() < density) addEdge(a, b)
  }

  return { nodes, edges, adjacency }
}

export function* bfsSteps(adjacency, startId) {
  const visited = new Set([startId])
  const queue = [startId]
  yield { visited: [...visited], current: startId, frontier: [...queue] }

  while (queue.length) {
    const node = queue.shift()
    const neighbors = adjacency.get(node) || []
    for (const { to } of neighbors) {
      if (!visited.has(to)) {
        visited.add(to)
        queue.push(to)
        yield { visited: [...visited], current: to, frontier: [...queue] }
      }
    }
  }
}

export function* dfsSteps(adjacency, startId) {
  const visited = new Set()
  const stack = [startId]

  while (stack.length) {
    const node = stack.pop()
    if (visited.has(node)) continue
    visited.add(node)
    yield { visited: [...visited], current: node, frontier: [...stack] }

    const neighbors = adjacency.get(node) || []
    for (const { to } of neighbors) {
      if (!visited.has(to)) stack.push(to)
    }
  }
}

export function* dijkstraSteps(adjacency, startId, nodeCount) {
  const distances = new Map()
  for (let i = 0; i < nodeCount; i++) distances.set(i, Infinity)
  distances.set(startId, 0)

  const visited = new Set()
  const remaining = new Set(Array.from({ length: nodeCount }, (_, i) => i))

  while (remaining.size) {
    let current = null
    let best = Infinity
    for (const id of remaining) {
      if (distances.get(id) < best) {
        best = distances.get(id)
        current = id
      }
    }
    if (current === null) break // unreachable remainder

    remaining.delete(current)
    visited.add(current)
    yield {
      visited: [...visited],
      current,
      distances: Object.fromEntries(distances),
    }

    const neighbors = adjacency.get(current) || []
    for (const { to, weight } of neighbors) {
      if (visited.has(to)) continue
      const newDist = distances.get(current) + weight
      if (newDist < distances.get(to)) {
        distances.set(to, newDist)
      }
    }
  }
}
