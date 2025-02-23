import { writeFile as writeFileFS } from 'fs'
import { promisify } from 'util'

import { Worker, isMainThread, parentPort } from 'worker_threads'

import { CACHE_FILE_PATH } from '../entries/cache'
import { run, subscribe } from './bootstrap'

const writeFile = promisify(writeFileFS)

function updateTmpFile (data) {
  writeFile(CACHE_FILE_PATH, JSON.stringify(data))
}

if (isMainThread) {
  let worker

  module.exports.runProcessWorker = function () {
    worker = new Worker(__filename)
    worker.on('message', updateTmpFile)
  }
} else {
  // run code
  subscribe(data => parentPort.postMessage(data))
  run().then(data => parentPort.postMessage(data))
}
