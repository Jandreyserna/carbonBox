import { ActivityData } from '../entities';

export interface IActivityDataRepository {
  saveMany(activityData: ActivityData[]): Promise<void>;
  findByUploadId(uploadId: string): Promise<ActivityData[]>;
}