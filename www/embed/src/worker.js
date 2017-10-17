importScripts('../lib/spark-md5.min.js', '../lib/hashcatJS.js')

onmessage = function(e) {
	if (e.data.type == 'data') {
		crack(e.data.passwords, e.data.hashes)
	}
}

let then = 0
let hashCount = 0
let hashesPerSecond = 0

function tick(hashCount) {

	if (Date.now() - then >= 1000) {
		postMessage({type: 'update', hashCount, hashesPerSecond})
		hashesPerSecond = 0
		then = Date.now()
	}
}

function crack(passwords, hashes) {
	
	hashes.forEach((hash, i) => {

		passwords.forEach((password, j) => {

			hashesPerSecond++
			hashCount++

			// this loop blocks setTimeout, so use a tick() instead
			// to report hash count once per second
			tick(hashCount)
			if (SparkMD5.hash(password) == hash) {
				postMessage({ type: 'found', password, hash})
			}

		})
	})

	postMessage({ type: 'finished', totalHashes: hashCount })
}
