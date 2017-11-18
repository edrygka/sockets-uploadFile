const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const fs = require('fs')
const ss = require('socket.io-stream')
const config = require('./config.json')


server.listen(config.port, () => {
  console.log('Server listening on port '+config.port)
})

app.get('/', (req, res) => {
  res.sendfile(__dirname + '/page.html')
});

io.on('connection', socket => {
    socket.emit('news', { hello: 'world' })
    socket.on('message', data => {
        console.log(data)
    })

    var uploadRunning = false

    ss(socket).on('file', (stream, data) => {
        console.log('>>>Received File Emit at <<<', new Date().toString())
        console.log('data.originalName', data.originalName)

        buffer = new Buffer.alloc(parseInt(data.size)) //change to number req.headers['content-length']
        var bufferLength = 0

        var total = 0
        stream.on('data', chunk => {
            console.log('>>>>> Chunk length : ',chunk.length)

            var written = buffer.write(chunk.toString('binary'), bufferLength, chunk.length, 'binary')
            bufferLength += written
        })

        fs.writeFile('./saves/' + data.originalName, buffer, err => {
          if (err) {
              return console.log(err)
          }
          console.log("File saved successfully!")
        })

    })
})

/*enctype="multipart/form-data"
            action="/file"
            method="post"*/
            