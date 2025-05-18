'use strict';

const fp = require('fastify-plugin');

module.exports = fp(async (fastify) => {
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    );
  `);
  fastify.decorate('db', db);
  fastify.addHook('onClose', async () => {
    db.close();
  });
});
