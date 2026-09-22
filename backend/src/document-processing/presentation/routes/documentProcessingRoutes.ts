import { FastifyInstance } from 'fastify';

export async function documentProcessingRoutes(app: FastifyInstance) {
    app.post('/', (req, res) => app.container.resolve('createUploadController').execute(req, res));
}