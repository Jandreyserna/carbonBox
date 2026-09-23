import { Either, ValueObject } from "@shared/domain";

export enum UploadStatusEnum {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

interface UploadStatusProps {
    value: UploadStatusEnum;
}

export class UploadStatus extends ValueObject<UploadStatusProps> {
    private constructor(props: UploadStatusProps) { super(props); }

    get value(): UploadStatusEnum {
        return this.props.value;
    }

    static create(status: string): Either<Error, UploadStatus> {
        if(!Object.values(UploadStatusEnum).includes(status as UploadStatusEnum)) {
            return Either.left(new Error(`Invalid upload status: ${status}`));
        }
        return Either.right(new UploadStatus({ value: status as UploadStatusEnum }));
    }

    static pending(): UploadStatus {
        return new UploadStatus({ value: UploadStatusEnum.PENDING });
    }
    static processing(): UploadStatus {
        return new UploadStatus({ value: UploadStatusEnum.PROCESSING });
    }
    static completed(): UploadStatus {
        return new UploadStatus({ value: UploadStatusEnum.COMPLETED });
    }
    static failed(): UploadStatus {
        return new UploadStatus({ value: UploadStatusEnum.FAILED });
    }
}
