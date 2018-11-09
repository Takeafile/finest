# finest

Delay `finish` and `end` events from a `Duplex` stream until both of them have
been emitted from their `Writable` and `Readable` parts

This is useful to be used as a "firewall" to isolate two bi-directional `Duplex`
streams so the `finish` or `end` events are not propagated until we are sure
that both `Writable` and `Readable` parts has finished, leaving the other stream
to be still working as a bi-directional one. One use case of this is if you are
using a network protocol that needs a bi-directional transport layer (to send
back messages for ACKs or flow control) and one of the ends emits a `finish` or
`end` events, so this way the transport layer stream can be isolated from the
application and still works as a bi-directional one.

## Install

```sh
npm install finest
```

## API

- *duplex*: `Duplex` stream that we want to isolate
- *options*: options passed to `duplexify`
  - *receiver*: options passed to underlying `receiver` stream
  - *sender*: options passed to underlying `sender` stream
