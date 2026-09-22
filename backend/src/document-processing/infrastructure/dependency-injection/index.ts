import { AwilixContainer, asClass } from "awilix";
import { PrismaUploadRepository } from "../persistence/repositories/PrismaUploadRepository";
import { S3FileStorage } from "../storage/S3FileStorage";
import { CreateUploadCommandHandler } from "@application/commands/handlers/CreateUploadCommandHandler";
import { CreateUploadController } from "@presentation/controllers/CreateUploadController";

export function registerDocumentProcessingModule(container: AwilixContainer) {
    container.register({
        uploadRepository: asClass(PrismaUploadRepository).singleton(),
        fileStorage: asClass(S3FileStorage).singleton(),

        createUploadCommandHandler: asClass(CreateUploadCommandHandler).singleton(),

        createUploadController: asClass(CreateUploadController).singleton(),
    });
}