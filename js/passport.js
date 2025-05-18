'use strict';

const fastifyPassport = require('@fastify/passport');
const GoogleStrategy = require('passport-google-oidc');
const { callbackify } = require('node:util');
require('dotenv').config({
  override: true,
});
const fp = require('fastify-plugin');

module.exports = fp(async (fastify) => {
  await fastify.register(fastifyPassport.initialize());
  await fastify.register(fastifyPassport.secureSession());

  fastify.decorate('passport', fastifyPassport);

  fastifyPassport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
        scope: ['openid', 'profile', 'email'],
      },
      callbackify(authenticate),
    ),
  );

  async function authenticate(source, profile) {
    console.log('AUTHENTICATE', profile);
    const insert = fastify.db.prepare('INSERT OR IGNORE INTO user (name, email) VALUES (?, ?)');
    const select = fastify.db.prepare('SELECT * FROM user WHERE id = ?');
    let user = select.get(profile.id);
    if (!user) {
      const { lastInsertRowid } = insert.run(profile.displayName, profile.emails[0].value);
      user = select.get(lastInsertRowid);
    }
    return { id: user.id, name: profile.displayName, email: profile.emails[0].value };
  }

  // authenticate -> cookie
  fastifyPassport.registerUserSerializer(async (user) => user.id);
  // cookie -> user
  fastifyPassport.registerUserDeserializer(async (userId) => {
    const select = fastify.db.prepare('SELECT * FROM user WHERE id = ?');
    return select.get(userId);
  });
});
