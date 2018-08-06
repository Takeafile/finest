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

  const sender   = new PassThrough({...sendOpts, flush})
  const receiver = new PassThrough({...recvOpts, flush})

  sender.pipe(duplex).pipe(receiver)

  return duplexify(sender, receiver, options)
}
