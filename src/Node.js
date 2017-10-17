class Node {

	constructor(socket) {
		this.socket = socket
		this.id = socket.id
		this.time = Date.now() // time connected
		this.cracked = []
		this.hashCount = 0
		this.hashesPerSecond = 0
		this.alive = true
		this.userAgent = null
		this.numWorkers = null
	}

	found(password) {
		this.cracked.push(password)
	}

	serialize() {
		return {
			id: this.id,
			time: this.time,
			cracked: this.cracked,
			hashCount: this.hashCount,
			hashesPerSecond: this.hashesPerSecond,
			alive: this.alive,
			userAgent: this.userAgent,
			numWorkers: this.numWorkers
		}
	}

}

module.exports = Node