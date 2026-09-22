import { AwilixContainer, asClass } from "awilix";
import { PrismaUploadRepository } from "../persistence/repositories/PrismaUploadRepository";
import { CreateUploadCommandHandler } from "@application/commands/handlers/CreateUploadCommandHandler";
import { CreateUploadController } from "@presentation/controllers/CreateUploadController";

export function registerDocumentProcessingModule(container: AwilixContainer) {
    container.register({
        uploadRepository: asClass(PrismaUploadRepository).singleton(),

        createUploadCommandHandler: asClass(CreateUploadCommandHandler).singleton(),

        createUploadController: asClass(CreateUploadController).singleton(),
    });
}