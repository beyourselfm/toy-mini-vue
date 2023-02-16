const queue: Function[] = []
let isFLush = false
export function nextTick(fn?: () => void) {
  return fn ? Promise.resolve().then(fn) : Promise.resolve()
}
export function queueJobs(job: Function) {
  if (!queue.includes(job))
    queue.push(job)

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
  let job
  while (queue.length !== 0) job = queue.shift()

  job && job()
}
