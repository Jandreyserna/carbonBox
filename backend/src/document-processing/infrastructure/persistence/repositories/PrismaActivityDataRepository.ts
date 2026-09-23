import { IActivityDataRepository } from "@domain/repositories";
import {PrismaClient } from "@prisma/client";
import { PrismaActivityDataMapper } from "../mappers";
import { ActivityData } from "@domain/entities";

export class PrismaActivityDataRepository implements IActivityDataRepository {
    public constructor(private readonly prisma: PrismaClient) {}

    public async saveMany(activityDataList: ActivityData[]): Promise<void> {
        await this.prisma.activityData.createMany({
            data: activityDataList.map((activityData) => 
                PrismaActivityDataMapper.toPersistence(activityData),
            ),
        });
    }

    public async findByUploadId(uploadId: string): Promise<ActivityData[]> {
        const models = await this.prisma.activityData.findMany({
            where: { uploadId },
        });
        return models.map((model) => PrismaActivityDataMapper.toDomain(model));
    }
}