const {PassThrough} = require('stream')

const duplexify = require('duplexify')

const Finest = require('.')


const {performance: {now}} = require('perf_hooks')


test('basic', function(done)
{
  expect.assertions(4)

  const delay    = 1000
  const expected = 'asdf'

  let finest_finish
  let downstream_finish

  const upstream   = new PassThrough
  const downstream = new PassThrough

  upstream.on('data', downstream.write.bind(downstream))

  const finest = new Finest(duplexify(upstream, downstream))

  upstream.on('data', function(data)
  {
    expect(data.toString()).toBe(expected)
  })

  finest.on('data', function(data)
  {
    expect(data.toString()).toBe(expected)

    setTimeout(downstream.end.bind(downstream), delay)
  })

  downstream.once('finish', function()
  {
    downstream_finish = now()
  })

  finest.once('finish', function()
  {
    finest_finish = now()
  })

  Promise.all([
    new Promise(function(resolve, reject)
    {
      upstream.once('end', function()
      {
        try {
          expect(now() - finest_finish).toBeGreaterThan(delay)
        }
        catch(e)
        {
          return reject(e)
        }

        resolve()
      })
    }),
    new Promise(function(resolve, reject)
    {
      finest.once('end', function()
      {
        try {
          expect(now() - downstream_finish).toBeLessThan(50)
        }
        catch(e)
        {
          return reject(e)
        }

        resolve()
      })
    })
  ])
  .then(done.bind(null, null), done)

  finest.end(expected)
})
