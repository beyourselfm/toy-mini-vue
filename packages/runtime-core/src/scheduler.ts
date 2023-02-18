const queue: Function[] = []
const activePreFlushQueue: Function[] = []
let isFLush = false
export function nextTick(fn?: () => void) {
  return fn ? Promise.resolve().then(fn) : Promise.resolve()
}
export function queueJobs(job: Function) {
  if (!queue.includes(job))
    queue.push(job)

  queueFlush()
}

export function queuePreFlushJob(fn:Function) {
  activePreFlushQueue.push(fn)
  queueFlush()
}
function queueFlush() {
  if (isFLush)
    return
  isFLush = true
  nextTick(flushQueueJobs)
}
function flushQueueJobs() {
  isFLush = false
  // pre
  flushPreFlushJobs()

  // render
  let job
  while (queue.length !== 0) {
    job = queue.shift()
    job && job()
  }
}

function flushPreFlushJobs() {
  for (let i = 0; i < activePreFlushQueue.length; i++) {
    const job = activePreFlushQueue[i]
    job && job()
  }
}

