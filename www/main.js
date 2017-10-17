const data = {
	nodes: [],
	progress: 0
}

const vm = new Vue({
	el: '#app',
	data: data,
	computed: {
		percentProgress: function() {
			return parseInt(this.progress * 100)
		},
		numLiveNodes: function() {
			return this.nodes.filter(n => n.alive).length
		},
		sortedUsers: function() {
			return this.sortedNodes.map(n => {
				if (!n.userAgent) return ""
				let str = `${n.userAgent.browser.name} / ${n.userAgent.os.name}`
				if (n.userAgent.device.type) {
					 str += ` / ${n.userAgent.device.type}`
				}
				return str
			})
		},
		sortedNodes: function() {
			return this.nodes.sort(n => n.alive ? 0 : 1)
		}
	},
	methods: {
		cpus: function() {
			return this.nodes.filter(n => n.alive)
				   .reduce((sum, node) => sum + node.numWorkers, 0)
		},
		networkHashrate: function() {
			return parseInt(networkHashrate())
		}
	}
})

const socket = io('/radmin')
socket.on('nodes', nodes => {
	nodes.forEach((node, i) => {
		node.orderAdded = i + 1
		data.nodes.push(node)
	})
})

socket.on('node added', node => {
	node.orderAdded = data.nodes.length + 1
	data.nodes.unshift(node)
})
socket.on('node updated', node => updateNode(node))

socket.on('progress', progress => data.progress = progress)

function networkHashrate() {
	const now = Date.now()
	const alive = data.nodes.filter(n => n.alive)
	if (alive.length < 1) return 0
	return alive.reduce((sum, node) => sum + node.hashesPerSecond, 0)
}

function updateNode(node) {
	data.nodes.forEach(n => {
		if (n.id == node.id) {
			n.hashCount = node.hashCount
       		n.hashesPerSecond = node.hashesPerSecond
			n.alive = node.alive
			n.cracked = node.cracked
			n.userAgent = node.userAgent
       		n.numWorkers = node.numWorkers
		}
	})
}
