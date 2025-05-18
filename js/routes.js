'use strict';

module.exports = async function (fastify) {
  fastify.get(
    '/auth/google/callback',
    {
      preValidation: fastify.passport.authenticate('google'),
    },
    async (request, reply) => reply.redirect('/'),
  );

  fastify.get('/', async (req) => req.user);
};
