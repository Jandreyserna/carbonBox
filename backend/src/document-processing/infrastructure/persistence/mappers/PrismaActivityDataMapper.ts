import { ActivityData } from "@domain/entities";
import { ActivityData as PrismaActivityDataModel } from "@prisma/client";

export class PrismaActivityDataMapper {
    public static toDomain(model: PrismaActivityDataModel): ActivityData {
        return ActivityData.reconstitute({
            uploadId: model.uploadId,
            category: model.category,
            amount: model.amount,
            unit: model.unit,
            date: model.date,
            createdAt: model.createdAt,
        }, model.id);
    }

    public static toPersistence(activityData: ActivityData): Omit<PrismaActivityDataModel, 'createdAt'> {
        return {
            id: activityData.id,
            uploadId: activityData.uploadId,
            category: activityData.category,
            amount: activityData.amount,
            unit: activityData.unit,
            date: activityData.date,
        };
    }

}