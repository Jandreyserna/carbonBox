import { randomUUID } from 'crypto';
import { Either, AggregateRoot } from '../../../shared/domain';
import { FileName } from '../value-objects';
import { UploadStatus, UploadStatusEnum } from '../value-objects/UploadStatus';

export interface UploadProps {
  fileName: FileName; fileUrl: string; status: UploadStatus; userId: string;
  totalRows?: number; processedRows?: number; failedRows?: number; errorMessage?: string;
  createdAt: Date; updatedAt: Date;
}

export class Upload extends AggregateRoot<UploadProps> {
  private constructor(props: UploadProps, id: string) { super(props, id); }

  static create(
    input: { fileName: string; fileUrl: string; userId: string },
    id: string = randomUUID(),
  ): Either<Error, Upload> {
    const fileNameOrError = FileName.create(input.fileName);
    if (fileNameOrError.isLeft()) return Either.left(fileNameOrError.value);

    const now = new Date();
    return Either.right(new Upload({
      fileName: fileNameOrError.value, fileUrl: input.fileUrl, status: UploadStatus.pending(),
      userId: input.userId, createdAt: now, updatedAt: now,
    }, id));
  }

  static reconstitute(props: UploadProps, id: string): Upload {
    return new Upload(props, id);
  }

  markAsProcessing(): void {
    this.props.status = UploadStatus.processing();
    this.props.updatedAt = new Date();
  }

  markAsCompleted(totalRows: number, processedRows: number, failedRows: number): void {
    this.props.status = UploadStatus.completed();
    this.props.totalRows = totalRows;
    this.props.processedRows = processedRows;
    this.props.failedRows = failedRows;
    this.props.updatedAt = new Date();
  }

  markAsFailed(errorMessage: string): void {
    this.props.status = UploadStatus.failed();
    this.props.errorMessage = errorMessage;
    this.props.updatedAt = new Date();
  }

  get fileName(): string { return this.props.fileName.value; }
  get fileUrl(): string { return this.props.fileUrl; }
  get status(): UploadStatusEnum { return this.props.status.value; }
  get userId(): string { return this.props.userId; }
  get totalRows(): number | undefined { return this.props.totalRows; }
  get processedRows(): number | undefined { return this.props.processedRows; }
  get failedRows(): number | undefined { return this.props.failedRows; }
  get errorMessage(): string | undefined { return this.props.errorMessage; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
}