import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import cors from '@fastify/cors';
import { buildContainer } from './container';
import { Routes } from './routes';

const app = Fastify();
const container = buildContainer();

app.register(multipart, {
    attachFieldsToBody: true,
    limits: { fileSize: 20 * 1024 * 1024 },
});

app.register(cors, {origin: 'http://localhost:3001'});

app.decorate('container', container);

app.setErrorHandler((error, _req, reply) => {
    app.log.error(error);
    reply.code(500).send({ error: 'Internal server error' });
});

new Routes(app).register();

app.listen({ port: 3000 }, () => console.log('Server running on http://localhost:3000'));