const SparkMD5 = require('spark-md5')
const hashes = require('../data/hashes')
const passwords = require('../data/passwords')

const cracked = []
let num = 0

hashes.forEach(hash => {
	passwords.forEach(password => {
		if (SparkMD5.hash(password) == hash) {
			cracked.push(password)
			console.log(`cracked ${password}`)
		}
		num++
	})
})

console.log('done')
console.log(num)
