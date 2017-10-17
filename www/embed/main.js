const socket = io('/worker')

const workers = []
const waitingWorkerIds = []

socket.on('hashes', hashes => {

	const numWorkers = navigator.hardwareConcurrency || 1
	socket.emit('node info', {
		numWorkers: numWorkers,
		userAgent: navigator.userAgent
	})

	if (window.Worker && workers.length < 1) {

		for (let i = 0; i < numWorkers; i++) {

			const worker = new Worker('src/worker.js')
			worker.id = Math.random()
			worker.hashCount = 0

			worker.onmessage = function(e) {
				handleWorkerMessage(worker, e)
			}

			workers.push(worker)
			waitingWorkerIds.push(worker.id)
			socket.emit('more passwords')
		}
	}

	socket.on('passwords', passwords => {
		const worker = getWaitingWorker()
		if (worker) {
			worker.postMessage({
				type: 'data',
				passwords: passwords,
				hashes: hashes
			})
			waitingWorkerIds.splice(0, 1)
		} else {
			console.error('more passwords received but no queued workers available')
		}
	})
})

function getWaitingWorker() {
	if (waitingWorkerIds.length < 1) return null
	return workers.filter(worker => worker.id == waitingWorkerIds[0])[0]
}

function handleWorkerMessage(worker, event) {

	if (event.data.type == 'update') {
		worker.hashCount = event.data.hashCount
		worker.hashesPerSecond = event.data.hashesPerSecond
		const hashInfo = {
			totalHashCount: workers.reduce((sum, w) => sum + w.hashCount, 0),
			totalHashesPerSecond:  workers.reduce((sum, w) => sum + w.hashesPerSecond, 0)
		}
		socket.emit('update', hashInfo)
	} else if (event.data.type == 'found') {
		socket.emit('found', event.data.password)
	} else if (event.data.type == 'finished') {
		socket.emit('more passwords')
		waitingWorkerIds.push(worker.id)
	}
}
