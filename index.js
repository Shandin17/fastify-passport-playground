'use strict';

require('dotenv/config');
const fastify = require('fastify');
const App = require('./js/app');

async function start() {
  const server = fastify({
    trustProxy: true,
    logger: {
      level: 'info',
    },
  });
  await server.register(App);
  await server.listen({
    host: 'localhost',
    port: 3000,
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
