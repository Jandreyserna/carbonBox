import { AwilixContainer, asClass } from "awilix";
import { PrismaUploadRepository } from "../persistence/repositories";
import { S3FileStorage } from "../storage/S3FileStorage";
import { CreateUploadCommandHandler, ProcessFileCommandHandler } from "@application/commands/handlers";
import { CreateUploadController } from "@presentation/controllers";
import { CsvParserService } from "@application/services";

export function registerDocumentProcessingModule(container: AwilixContainer) {
    container.register({
        uploadRepository: asClass(PrismaUploadRepository).singleton(),
        fileStorage: asClass(S3FileStorage).singleton(),
        csvParserService: asClass(CsvParserService).singleton(),
        
        processFileCommandHandler: asClass(ProcessFileCommandHandler).singleton(),
        createUploadCommandHandler: asClass(CreateUploadCommandHandler).singleton(),

        createUploadController: asClass(CreateUploadController).singleton(),
    });
}