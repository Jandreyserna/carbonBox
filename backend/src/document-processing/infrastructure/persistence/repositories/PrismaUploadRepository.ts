import { Upload } from "@domain/entities";
import { IUploadRepository, ListUploadsResult, ListUploadsFilter } from "@domain/repositories/IUploadRepository";
import { PrismaClient } from "@prisma/client";
import { UploadMapper } from "../mappers/UploadMapper";


export class PrismaUploadRepository implements IUploadRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async save(upload: Upload): Promise<void> {
        const raw = UploadMapper.toPersistence(upload);
        await this.prisma.upload.upsert({ 
            where: { id: raw.id },
            update: raw,
            create: raw,
         });
    }

    async findById(id: string): Promise<Upload | null> {
        const raw = await this.prisma.upload.findUnique({ where: { id } });
        return raw ? UploadMapper.toDomain(raw) : null;
    }

    async list(filter: ListUploadsFilter): Promise<ListUploadsResult> {
        const [data, total] = await this.prisma.$transaction([
            this.prisma.upload.findMany({
                where: { userId: filter.userId },
                skip: (filter.page - 1) * filter.limit,
                take: filter.limit,
            }),
            this.prisma.upload.count({ where: { userId: filter.userId } }),
        ]);
        return {
            data: data.map(UploadMapper.toDomain),
            total, 
        }
    }
}