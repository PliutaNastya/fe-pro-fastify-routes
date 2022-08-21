import Fastify from 'fastify';

import { users } from './users';

const fastify = Fastify({
  logger: true,
});
fastify.register(import('@fastify/cors'));
fastify.register(import('@fastify/multipart'), {
  addToBody: true,
});
fastify.register(import('@fastify/cookie'));

const censor = (str, word, reply) =>
  str.toLowerCase().includes(word)
    ? reply.status(403).send('unresolved')
    : reply.send(str);

fastify.post('/uppercase', (request, reply) => {
  const str = request.body.toUpperCase();
  censor(str, 'fuck', reply);
});

fastify.post('/lowercase', (request, reply) => {
  const str = request.body.toLowerCase();
  censor(str, 'fuck', reply);
});

fastify.get('/user/:id', (request, reply) => {
  const { id } = request.params;

  if (!users[id]) {
    return reply.status(400).send('User not exist');
  }
  reply.send(users[id]);
});

fastify.get('/users', (request, reply) => {
  const { filter, value } = request.query;

  if (!filter && !value) {
    return reply.send(Object.values(users));
  }
  return reply.send(
    Object.values(users).filter((user) => String(user[filter]) === value)
  );
});

export default fastify;
