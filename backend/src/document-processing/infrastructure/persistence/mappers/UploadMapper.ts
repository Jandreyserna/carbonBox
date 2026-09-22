import { Upload as UploadModel } from "@prisma/client";
import { Upload } from "@domain/entities/Upload";
import { FileName } from "@domain/value-objects/FileNameProps";
import { UploadStatus } from "@domain/value-objects/UploadStatus";

export class UploadMapper {
    public static toDomain(model: UploadModel): Upload {
        const fileNameOrError = FileName.create(model.fileName);
        if (fileNameOrError.isLeft()) {
            throw new Error(`Registro de upload corrupto (${model.id}): ${fileNameOrError.value.message}`);
        }

        const statusOrError = UploadStatus.create(model.status);
        if (statusOrError.isLeft()) {
            throw new Error(`Registro de upload corrupto (${model.id}): ${statusOrError.value.message}`);
        }

        return Upload.reconstitute(
            {
                fileName: fileNameOrError.value,
                fileUrl: model.fileUrl,
                status: statusOrError.value,
                userId: model.userId,
                totalRows: model.totalRows ?? undefined,
                processedRows: model.processedRows ?? undefined,
                failedRows: model.failedRows ?? undefined,
                errorMessage: model.errorMessage ?? undefined,
                createdAt: model.createdAt,
                updatedAt: model.updatedAt,
            },
            model.id,
        );
    }

    public static toPersistence(upload: Upload) {
        return {
            id: upload.id,
            fileName: upload.fileName,
            fileUrl: upload.fileUrl,
            status: upload.status,
            userId: upload.userId,
            totalRows: upload.totalRows ?? null,
            processedRows: upload.processedRows ?? null,
            failedRows: upload.failedRows ?? null,
            errorMessage: upload.errorMessage ?? null,
            createdAt: upload.createdAt,
            updatedAt: upload.updatedAt,
        };
    }
}
