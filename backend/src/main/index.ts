import Fastify from 'fastify';
import { buildContainer } from './container';
import { Routes } from './routes';

const app = Fastify();
const container = buildContainer();

app.decorate('container', container);

new Routes(app).register();

app.listen({ port: 3000 }, () => console.log('Server running on http://localhost:3000'));