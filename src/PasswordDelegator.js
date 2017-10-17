const fs = require('fs')
const md5 = require('md5')
const utils = require('./utils')

class PasswordDelegator {

	constructor() {
		this.cracked = []
		this.passwords = fs.readFileSync('data/passwords.txt', { encoding: 'utf8' })
							.split('\n').filter(line => line != '')
		this.hashes = fs.readFileSync('data/hashes.txt', { encoding: 'utf8' })
							.split('\n').filter(line => line != '')
		this.passwordHead = 0
		this.batchHead = 0

		this.prevCracked = []
		if (fs.existsSync('data/cracked.txt')) {
			const lines = fs.readFileSync('data/cracked.txt', { encoding: 'utf8' }).split('\n')
			this.prevCracked = lines.map(line => line.split(':')[1])
									.filter(pass => pass != undefined)
		}
	}

	getPasswordBatch(batchSize=100) {
		const pw = this.passwords.slice(this.passwordHead, this.passwordHead + batchSize)
		this.passwordHead = Math.min(this.passwordHead + batchSize, this.passwords.length)
		return this.passwordHead < this.passwords.length - 1 ? pw : null
	}

	found(password) {
		if (this.cracked.indexOf(password) == -1) {
			this.cracked.push(password)
			if (this.prevCracked.indexOf(password) == -1) {
				fs.appendFileSync('data/cracked.txt', `${md5(password)}:${password}\n`)
			}
		}
	}

	// return the percentage of passwords that
	// have been distributed
	progress() {
		return utils.mapRange(this.passwordHead, 0, this.passwords.length - 1, 0, 1)
	}
}

module.exports = PasswordDelegator
