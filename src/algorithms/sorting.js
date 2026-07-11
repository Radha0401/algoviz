/**
 * Sorting algorithms implemented as JS generators.
 * Each `yield` produces a "step" describing the array state and what's
 * currently happening (comparison / swap / overwrite), which the
 * visualizer replays frame-by-frame to animate the algorithm.
 *
 * Step shape: { array, type: 'compare'|'swap'|'overwrite'|'sorted', indices: number[] }
 */

export function* mergeSortSteps(inputArray) {
  const array = [...inputArray]

  function* mergeSort(start, end) {
    if (end - start <= 1) return
    const mid = Math.floor((start + end) / 2)
    yield* mergeSort(start, mid)
    yield* mergeSort(mid, end)
    yield* merge(start, mid, end)
  }

  function* merge(start, mid, end) {
    const left = array.slice(start, mid)
    const right = array.slice(mid, end)
    let i = 0, j = 0, k = start

    while (i < left.length && j < right.length) {
      yield { array: [...array], type: 'compare', indices: [start + i, mid + j] }
      if (left[i] <= right[j]) {
        array[k] = left[i]
        i++
      } else {
        array[k] = right[j]
        j++
      }
      yield { array: [...array], type: 'overwrite', indices: [k] }
      k++
    }
    while (i < left.length) {
      array[k] = left[i]
      yield { array: [...array], type: 'overwrite', indices: [k] }
      i++; k++
    }
    while (j < right.length) {
      array[k] = right[j]
      yield { array: [...array], type: 'overwrite', indices: [k] }
      j++; k++
    }
  }

  yield* mergeSort(0, array.length)
  yield { array: [...array], type: 'sorted', indices: array.map((_, idx) => idx) }
}

export function* quickSortSteps(inputArray) {
  const array = [...inputArray]

  function* quickSort(low, high) {
    if (low >= high) return
    const pivotIndex = yield* partition(low, high)
    yield* quickSort(low, pivotIndex - 1)
    yield* quickSort(pivotIndex + 1, high)
  }

  function* partition(low, high) {
    const pivot = array[high]
    let i = low - 1

    for (let j = low; j < high; j++) {
      yield { array: [...array], type: 'compare', indices: [j, high] }
      if (array[j] < pivot) {
        i++
        ;[array[i], array[j]] = [array[j], array[i]]
        yield { array: [...array], type: 'swap', indices: [i, j] }
      }
    }
    ;[array[i + 1], array[high]] = [array[high], array[i + 1]]
    yield { array: [...array], type: 'swap', indices: [i + 1, high] }
    return i + 1
  }

  yield* quickSort(0, array.length - 1)
  yield { array: [...array], type: 'sorted', indices: array.map((_, idx) => idx) }
}

export function randomArray(size, max = 100) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 5)
}
