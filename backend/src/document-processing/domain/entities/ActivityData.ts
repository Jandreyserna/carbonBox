import { randomUUID } from 'crypto';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { Either } from '../../../shared/domain/Either';

export interface ActivityDataProps {
  uploadId: string; category: string; amount: number; unit: string; date: Date; createdAt: Date;
}

export class ActivityData extends AggregateRoot<ActivityDataProps> {
  private constructor(props: ActivityDataProps, id: string) { super(props, id); }

  static create(
    input: { uploadId: string; category: string; amount: number; unit: string; date: Date },
    id: string = randomUUID(),
  ): Either<Error, ActivityData> {
    if (!input.category || input.category.trim() === '') return Either.left(new Error('category cannot be empty'));
    if (!input.unit || input.unit.trim() === '') return Either.left(new Error('unit cannot be empty'));
    if (Number.isNaN(input.amount) || input.amount <= 0) return Either.left(new Error('amount must be a positive number'));
    if (Number.isNaN(input.date.getTime())) return Either.left(new Error('date is not a valid date'));

    return Either.right(new ActivityData({
      uploadId: input.uploadId, category: input.category, amount: input.amount,
      unit: input.unit, date: input.date, createdAt: new Date(),
    }, id));
  }

  static reconstitute(props: ActivityDataProps, id: string): ActivityData {
    return new ActivityData(props, id);
  }

  get uploadId(): string { return this.props.uploadId; }
  get category(): string { return this.props.category; }
  get amount(): number { return this.props.amount; }
  get unit(): string { return this.props.unit; }
  get date(): Date { return this.props.date; }
}