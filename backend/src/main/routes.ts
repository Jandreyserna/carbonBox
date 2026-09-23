import { documentProcessingRoutes } from '@presentation/routes/documentProcessingRoutes';
import { FastifyInstance } from 'fastify';

type RouteModule = {
  prefix: string;
  plugin: (app: FastifyInstance) => Promise<void>;
};

export class Routes {
  private modules: RouteModule[] = [
    { prefix: process.env.PATH_PREFIX + '', plugin: documentProcessingRoutes },
  ];

  constructor(private readonly app: FastifyInstance) {}

  public register(): void {
    this.modules.forEach(({ prefix, plugin }) => this.app.register(plugin, { prefix }));
  }
}