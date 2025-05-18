'use strict';

const fp = require('fastify-plugin');

module.exports = fp(async (fastify) => {
  await fastify.register(require('./db'));
  await fastify.register(require('@fastify/secure-session'), {
    key: Buffer.from('secret-key-for-session-encryptio'),
    cookie: {
      path: '/',
    },
  });
  await fastify.register(require('./passport'));
  await fastify.register(require('./routes'));
});
