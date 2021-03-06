'use strict'

const CSRF = require('csrf')

const Session = require('./session')
const Store = require('./store')

module.exports = (app, options) => {
  const store = new Store(options)
  const tokens = new CSRF(options)

  options.key = options.key || 'session-id'
  options.overwrite = true
  options.httpOnly = options.httpOnly !== false
  options.signed = options.signed !== false

  return Object.assign(koaRedisSessionSets, {
    v2,
    store,
    tokens,
    options,
    createSession,
    getReferenceKey,
  })

  function v2 (ctx, next) {
    ctx.session = createSession(ctx)
    return next()
  }

  function * koaRedisSessionSets (next) {
    this.session = createSession(this)
    yield next
  }

  // create the session
  function createSession (ctx) {
    return new Session(ctx, store, tokens, options)
  }

  // get the key for a reference set
  function getReferenceKey (field, value) {
    return store.getReferenceKey(field, value)
  }
}
