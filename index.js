const {PassThrough} = require('stream')

const {obj: duplexify} = require('duplexify')


module.exports = function(
  duplex,
  {receiver: recvOpts, sender: sendOpts, ...options} = {}
) {
  let _callback

  function flush(callback)
  {
    if(_callback)
    {
      _callback()
      callback()
    }

    else
      _callback = callback
  }

  const sender   = new PassThrough({...sendOpts, flush, objectMode: true})
  const receiver = new PassThrough({...recvOpts, flush, objectMode: true})

  sender.pipe(duplex).pipe(receiver)

  const result = duplexify(sender, receiver, options)

  duplex.on('error', result.emit.bind(result, 'error'))

  return result
}
