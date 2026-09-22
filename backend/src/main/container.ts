import { createContainer, InjectionMode, asValue, asClass } from 'awilix';
import { registerDocumentProcessingModule } from '@infrastructure/dependency-injection';
import { PrismaClient } from '@prisma/client';

export function buildContainer() {
    const container = createContainer({injectionMode: InjectionMode.CLASSIC});

    container.register({
        // infrastructure
        prisma: asValue( new PrismaClient() ),
    });

    // register document processing module
    registerDocumentProcessingModule(container);

    return container;
}