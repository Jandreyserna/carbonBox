import { FastifyInstance } from 'fastify';

export async function documentProcessingRoutes(app: FastifyInstance) {
    app.post('/', (req, res) => app.container.resolve('createUploadController').execute(req, res));
    app.get('/:id', (req, res) => app.container.resolve('getUploadByIdController').execute(req, res));
    app.get('/', (req, res) => app.container.resolve('listUploadsController').execute(req, res));
    app.get('/:id/results', (req, res) => app.container.resolve('getUploadResultsController').execute(req, res));
}