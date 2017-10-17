const path = require('path')
const express = require('express')
const cors = require('cors')
const UAparser = require('ua-parser-js')

const PasswordDelegator = require('./src/PasswordDelegator')
const Node = require('./src/Node')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(cors())
app.use(express.static(path.join(__dirname, 'www')))

const pd = new PasswordDelegator()

console.log(`passwords: ${pd.passwords.length}`)
console.log(`hashes: ${pd.hashes.length}`)

const nodes = []

// socket.io admin room
const admin = io.of('/radmin')
admin.on('connection', socket => {
    socket.emit('nodes', serialize(nodes))
})

// socket.io worker/embed room
const worker = io.of('/worker')
worker.on('connection', socket => {

    // create a new worker node and emit the "node added" event to the admin
    const node = new Node(socket)
    nodes.push(node)
    admin.emit('node added', node.serialize())

    // send the hashes to the worker node
    socket.emit('hashes', pd.hashes)

    // fired when a worker node sends info like user-agent and num CPUs
    socket.on('node info', info => {
        node.userAgent = UAparser(info.userAgent)
        node.numWorkers = info.numWorkers
        admin.emit('node update', node.serialize())
    })

    // fired when a worker node cracks a password
    socket.on('found', password => {
        console.log(`[notice] found password: ${password}`)
        pd.found(password)
        node.found(password)
        admin.emit('node updated', node.serialize())
    })

    // fired by each worker node ~once per second per CPU
    socket.on('update', hashInfo => {
        node.hashCount = hashInfo.totalHashCount
        node.hashesPerSecond = hashInfo.totalHashesPerSecond
        admin.emit('node updated', node.serialize())
    })

    // fired when a worker node needs more passwords to crack.
    // Also used to give the worker node the first batch of passwords.
    socket.on('more passwords', () => {
        const batch = pd.getPasswordBatch()
        if (batch != null) {
            console.log(`[info] ${parseInt(pd.progress() * 100)}% passwords distributed`)
            admin.emit('progress', pd.progress())
            socket.emit('passwords', batch)
        }
        else console.log('[info] no passwords left to distribute')
    })

    socket.on('disconnect', reason => {
        nodes.forEach(node => {
            if (node.id == socket.id) {
                node.alive = false
            }
        })
        admin.emit('node updated', node.serialize())
    })
})

http.listen(3000, () => {
  console.log('HTTP server listening on port 3000');
})

function serialize(nodes) {
    const n = [] ; nodes.forEach(node => n.push(node.serialize()))
    return n
}
