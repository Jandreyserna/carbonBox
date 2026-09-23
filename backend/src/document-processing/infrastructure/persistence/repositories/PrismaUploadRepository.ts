import { Upload } from "@domain/entities";
import { IUploadRepository, ListUploadsResult, ListUploadsFilter, UploadStatusCount } from "@domain/repositories/IUploadRepository";
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

    async countByStatus(userId: string): Promise<UploadStatusCount> {
        const groups = await this.prisma.upload.groupBy({
            by: ['status'],
            where: { userId },
            _count: { _all: true },
        });

        const counts: UploadStatusCount = { total: 0, pending: 0, processing: 0, completed: 0, failed: 0 };

        for (const group of groups) {
            const key = group.status.toLowerCase() as keyof Omit<UploadStatusCount, 'total'>;
            if (key in counts) {
                counts[key] = group._count._all;
            }
            counts.total += group._count._all;
        }

        return counts;
    }
}